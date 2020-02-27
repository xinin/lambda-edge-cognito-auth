const { parse: parseQueryString, stringify: stringifyQueryString } = require('querystring');

const nonceGenerator = require('nonce-generator');
const pkceChallenge = require('pkce-challenge');

const {
  getCookies, getCookieHeaders, extractAndParseCookies,
  decodeToken, validate,
  httpPostWithRetry,
  createErrorHtml,
} = require('./lib/utils');

const { headersCloudfront, cookieSettings } = require('./lib/constants');

const {
  COGNITO_DOMAIN, COGNITO_CLIENT_ID,
  COGNITO_SCOPE, COGNITO_REGION, COGNITO_USER_POOL_ID, COGNITO_CLIENT_SECRET, APP_SIGNIN_URI,
} = require('./config.json');

exports.handler = async (event) => {
  try {
    console.log(JSON.stringify(event));
    console.log('');

    const { request } = event.Records[0].cf;
    const { headers } = request;
    const cookies = getCookies(headers);
    const domainName = headers.host[0].value;

    console.log('cookies', cookies);

    // Generate Token after Cognito Response
    if (request.uri === '/parseauth') {
      const { code, state } = parseQueryString(request.querystring);
      console.info('code', code, 'state', state);
      if (!code || !state || typeof code !== 'string' || typeof state !== 'string') {
        throw new Error('Invalid query string. Your query string should include parameters "state" and "code"');
      }
      const { nonce: currentNonce, requestedUri } = JSON.parse(state);
      console.info('currentNonce', currentNonce, 'requestedUri', requestedUri);

      const { nonce: originalNonce, pkce } = extractAndParseCookies(cookies, COGNITO_CLIENT_ID);
      console.info('originalNonce', originalNonce, 'pkce', pkce);

      if (!currentNonce || !originalNonce || currentNonce !== originalNonce) {
        if (!originalNonce) {
          throw new Error('Your browser didn\'t send the nonce cookie along, but it is required for security (prevent CSRF).');
        }
        throw new Error('Nonce mismatch');
      }

      const body = stringifyQueryString({
        grant_type: 'authorization_code',
        client_id: COGNITO_CLIENT_ID,
        redirect_uri: `https://${domainName}${APP_SIGNIN_URI}`,
        code,
        code_verifier: pkce,
      });

      console.info('body', body);

      const headersToken = { 'Content-Type': 'application/x-www-form-urlencoded' };
      // If Cognito is assigned to ALB it has to have a Client Secret
      if (COGNITO_CLIENT_SECRET) {
        console.log('Added Authorization header to Cognito token request');
        headersToken.Authorization = `Basic ${Buffer.from(`${COGNITO_CLIENT_ID}:${COGNITO_CLIENT_SECRET}`).toString('base64')}`;
        console.log(headersToken);
      }

      const res = await httpPostWithRetry(`https://${COGNITO_DOMAIN}.auth.eu-west-1.amazoncognito.com/oauth2/token`, body, { headers: headersToken });

      const response = {
        status: '307',
        statusDescription: 'Temporary Redirect',
        headers: {
          location: [{
            key: 'location',
            value: `https://${domainName}${requestedUri || ''}`,
          }],
          'set-cookie': getCookieHeaders(COGNITO_CLIENT_ID, COGNITO_SCOPE, res.data, domainName, cookieSettings),
          ...headersCloudfront,
        },
      };
      return response;
    }


    const requestedUri = `${request.uri}${request.querystring ? `?${request.querystring}` : ''}`;
    const nonce = nonceGenerator(10);
    const {
      tokenUserName,
      idToken,
      refreshToken,
    } = extractAndParseCookies(cookies, COGNITO_CLIENT_ID);
    if (!cookies || !idToken || !tokenUserName) {
    // REDIRECCION
      const { code_verifier: codeVerifier, code_challenge: codeChallenge } = pkceChallenge();

      const COGNITO_URL = `https://${COGNITO_DOMAIN}.auth.eu-west-1.amazoncognito.com/oauth2/authorize?${stringifyQueryString(
        {
          redirect_uri: `https://${domainName}${APP_SIGNIN_URI}`,
          response_type: 'code',
          client_id: COGNITO_CLIENT_ID,
          state: JSON.stringify({ nonce, requestedUri }),
          scope: COGNITO_SCOPE.join(' '),
          code_challenge_method: 'S256',
          code_challenge: codeChallenge,
        },
      )}`;

      const response = {
        status: '307',
        statusDescription: 'Temporary Redirect',
        headers: {
          location: [{
            key: 'location',
            value: COGNITO_URL,
          }],
          'set-cookie': [
            { key: 'set-cookie', value: `spa-auth-edge-nonce=${encodeURIComponent(nonce)};  Path=/; Secure; HttpOnly; Max-Age=1800; SameSite=Lax` },
            { key: 'set-cookie', value: `spa-auth-edge-pkce=${encodeURIComponent(codeVerifier)};  Path=/; Secure; HttpOnly; Max-Age=1800; SameSite=Lax` },
          ],
          ...headersCloudfront,
        },
      };

      console.log(JSON.stringify(response));
      return response;
    }

    // VALIDATE
    const { exp } = decodeToken(idToken);
    console.log('exp', exp);
    if ((Date.now() / 1000) - 60 > exp && refreshToken) {
      /*
      return {
        status: '307',
        statusDescription: 'Temporary Redirect',
        headers: {
          location: [{
            key: 'location',
            value: `https://${domainName}${redirectPathAuthRefresh}?${stringifyQueryString({ requestedUri, nonce })}`,
          }],
          'set-cookie': [
            { key: 'set-cookie', value: `spa-auth-edge-nonce=${encodeURIComponent(nonce)}; ${cookieSettings.nonce}` },
          ],
          ...cloudFrontHeaders,
        },
      };
      */

      console.log('Ha expirado');
      // TODO redir a refresh token
    }

    // TODO
    console.log('estas autenticado TODO');

    const tokenIssuer = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`;
    const tokenJwksUri = `${tokenIssuer}/.well-known/jwks.json`;

    try {
      const isValid = await validate(idToken, tokenJwksUri, tokenIssuer, COGNITO_CLIENT_ID);
      console.log(isValid);
      // Return the request unaltered to allow access to the resource:
      return request;
    } catch (e) {
      console.log('no validado TODO redir to login');
    }
    /*
const {verifyChallenge} = require('pkce-challenge');
expect(
    verifyChallenge(
        challenge.code_verifier,
        challenge.code_challenge
    )
).toBe(true);
*/
  } catch (err) {
    console.error('Lambda execution error', err);
    return {
      body: createErrorHtml('Bad Request', err.toString()),
      status: '400', // Note: do not send 403 (!) as we have CloudFront send back index.html for 403's to enable SPA-routing
      headers: {
        ...headersCloudfront,
        'content-type': [{
          key: 'Content-Type',
          value: 'text/html; charset=UTF-8',
        }],
      },
    };
  }
};
