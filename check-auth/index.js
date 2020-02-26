const { parse: parseQueryString, stringify: stringifyQueryString } = require('querystring');

const nonceGenerator = require('nonce-generator');
const pkceChallenge = require('pkce-challenge');

const {
  headersCloudfront, getCookies, createErrorHtml,
  decodeToken, validate, extractAndParseCookies, httpPostWithRetry, getCookieHeaders,
} = require('./utils');

const COGNITO_DOMAIN = 'gyp-code-test';
const COGNITO_CLIENT_ID = '3gc6acvtrh829d7pmq0qscidrr';
const COGNITO_SCOPE = ['email', 'openid'];
const COGNITO_REGION = 'eu-west-1';
const COGNITO_USER_POOL_ID = 'eu-west-1_WRRXNv7s5';
const COGNITO_CLIENT_SECRET = '9qqb7qe7fmr5i5j2i0i6r7hgqimhkk7m78vcmn28e860rruekd6';
const APP_SIGNIN_URI = '/parseauth';


const parseauth = async (event) => {
  console.log(JSON.stringify(event));
  const { request } = event.Records[0].cf;
  const domainName = request.headers.host[0].value;
  let redirectedFromUri = `https://${domainName}`;
  const { headers } = request;
  const cookies = getCookies(headers);

  try {
    const { code, state } = parseQueryString(request.querystring);
    console.log('code', code, 'state', state);
    if (!code || !state || typeof code !== 'string' || typeof state !== 'string') {
      throw new Error('Invalid query string. Your query string should include parameters "state" and "code"');
    }
    const { nonce: currentNonce, requestedUri } = JSON.parse(state);
    console.log('currentNonce', currentNonce, 'requestedUri', requestedUri);
    redirectedFromUri += requestedUri || '';
    const { nonce: originalNonce, pkce } = extractAndParseCookies(cookies, COGNITO_CLIENT_ID);
    console.log('originalNonce', originalNonce, 'pkce', pkce);
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
    console.log('body', body);


    const headersToken = { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${Buffer.from(`${COGNITO_CLIENT_ID}:${COGNITO_CLIENT_SECRET}`).toString('base64')}` };
    console.log('headersToken', headersToken);


    // doc https://docs.aws.amazon.com/es_es/cognito/latest/developerguide/token-endpoint.html

    const res = await httpPostWithRetry(`https://${COGNITO_DOMAIN}.auth.eu-west-1.amazoncognito.com/oauth2/token`, body, { headers: headersToken });

    console.log('res', res);

    const cookieSettings = {
      idToken: 'Path=/; Secure; SameSite=Lax',
      accessToken: 'Path=/; Secure; SameSite=Lax',
      refreshToken: 'Path=/; Secure; SameSite=Lax',
      nonce: 'Path=/; Secure; HttpOnly; Max-Age=1800; SameSite=Lax',
    };

    const response = {
      status: '307',
      statusDescription: 'Temporary Redirect',
      headers: {
        location: [{
          key: 'location',
          value: redirectedFromUri,
        }],
        'set-cookie': getCookieHeaders(COGNITO_CLIENT_ID, COGNITO_SCOPE, res.data, domainName, cookieSettings),
        ...headersCloudfront,
      },
    };
    console.log(JSON.stringify(response));
    return response;
  } catch (err) {
    console.log(err);
    return {
      body: createErrorHtml('Bad Request', err.toString(), redirectedFromUri),
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

exports.handler = async (event) => {
  try {
    console.log(JSON.stringify(event));
    console.log('');
    const { request } = event.Records[0].cf;
    const { headers } = request;
    const cookies = getCookies(headers); // tokenUserName, idToken, refreshToken
    const domainName = headers.host[0].value;
    const requestedUri = `${request.uri}${request.querystring ? `?${request.querystring}` : ''}`;
    const nonce = nonceGenerator(10);

    console.log('cookies', cookies);
    console.log('');
    console.log(Object.keys(cookies));
    console.log(!!cookies, !cookies.idTokenKey);
    console.log('');

    if (request.uri === '/parseauth') {
      console.log('PARSEAUTH');
      return await parseauth(event);
    }

    if (!cookies || !cookies.idTokenKey) {
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
    const { exp } = decodeToken(cookies.idTokenKey);
    console.log('exp', exp);
    if ((Date.now() / 1000) - 60 > exp && cookies.refreshTokenKey) {
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
      // TODO
    }

    // TODO
    console.log('estas autenticado TODO');

    const tokenIssuer = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`;
    const tokenJwksUri = `${tokenIssuer}/.well-known/jwks.json`;

    try {
      const isValid = await validate(cookies.idTokenKey, tokenJwksUri, tokenIssuer, COGNITO_CLIENT_ID);
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
  } catch (E) {
    console.log('Lambda execution error', E);
  }
};
