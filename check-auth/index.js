const { parse: parseQueryString, stringify: stringifyQueryString } = require('querystring');

const nonceGenerator = require('nonce-generator');
const pkceChallenge = require('pkce-challenge');

const {
  getCookies, getCookieHeaders, extractAndParseCookies,
  decodeToken, validate,
  httpPostWithRetry,
  createErrorHtml,
  validateRefreshRequest,
} = require('./lib/utils');

const { headersCloudfront, cookieSettings } = require('./lib/constants');

const {
  COGNITO_DOMAIN, COGNITO_CLIENT_ID, APP_AUTH_REFRESH_URI, APP_SIGNOUT_URI,
  COGNITO_SCOPE, COGNITO_REGION, COGNITO_USER_POOL_ID, COGNITO_CLIENT_SECRET, APP_SIGNIN_URI,
} = require('./config.json');

exports.handler = async (event) => {
  try {
    console.info(JSON.stringify(event));

    const { request } = event.Records[0].cf;
    const { headers } = request;
    const cookies = getCookies(headers);
    const domainName = headers.host[0].value;

    // /////////////////////// ParseAuth ///////////////////////
    if (request.uri === APP_SIGNIN_URI) {
      console.info('Generating token after Cognito response');
      const { code, state } = parseQueryString(request.querystring);

      if (!code || !state || typeof code !== 'string' || typeof state !== 'string') {
        throw new Error('Invalid query string. Your query string should include parameters "state" and "code"');
      }
      const { nonce: currentNonce, requestedUri } = JSON.parse(state);
      const { nonce: originalNonce, pkce } = extractAndParseCookies(cookies, COGNITO_CLIENT_ID);

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

      const headersToken = { 'Content-Type': 'application/x-www-form-urlencoded' };
      // If Cognito is assigned to ALB it has to have a Client Secret
      if (COGNITO_CLIENT_SECRET) {
        console.info('Added Authorization header to Cognito token request');
        headersToken.Authorization = `Basic ${Buffer.from(`${COGNITO_CLIENT_ID}:${COGNITO_CLIENT_SECRET}`).toString('base64')}`;
      }

      const res = await httpPostWithRetry(`https://${COGNITO_DOMAIN}/oauth2/token`, body, { headers: headersToken });

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

    const {
      tokenUserName,
      idToken,
      refreshToken,
      nonce: originalNonce,
      accessToken,
    } = extractAndParseCookies(cookies, COGNITO_CLIENT_ID);

    // /////////////////////// Refresh Token ///////////////////////

    if (request.uri === APP_AUTH_REFRESH_URI) {
      console.info('Refreshing Token');
      const { requestedUri, nonce: currentNonce } = parseQueryString(request.querystring);
      validateRefreshRequest(currentNonce, originalNonce, idToken, accessToken, refreshToken);

      const tokens = { id_token: idToken, access_token: idToken, refresh_token: refreshToken };
      try {
        const body = stringifyQueryString({
          grant_type: 'refresh_token',
          client_id: COGNITO_CLIENT_ID,
          refresh_token: refreshToken,
        });
        const headersToken = { 'Content-Type': 'application/x-www-form-urlencoded' };
        // If Cognito is assigned to ALB it has to have a Client Secret
        if (COGNITO_CLIENT_SECRET) {
          console.info('Added Authorization header to Cognito token request');
          headersToken.Authorization = `Basic ${Buffer.from(`${COGNITO_CLIENT_ID}:${COGNITO_CLIENT_SECRET}`).toString('base64')}`;
        }
        const res = await httpPostWithRetry(`https://${COGNITO_DOMAIN}/oauth2/token`, body, { headers: headersToken });
        tokens.id_token = res.data.id_token;
        tokens.access_token = res.data.access_token;
      } catch (err) {
        tokens.refresh_token = '';
      }
      return {
        status: '307',
        statusDescription: 'Temporary Redirect',
        headers: {
          location: [{
            key: 'location',
            value: `https://${domainName}${requestedUri}`,
          }],
          'set-cookie': getCookieHeaders(COGNITO_CLIENT_ID, COGNITO_SCOPE, tokens, domainName, cookieSettings),
          ...headersCloudfront,
        },
      };
    }

    // /////////////////////// SignOut ///////////////////////
    if (request.uri === APP_SIGNOUT_URI) {
      console.info('Signing Out');

      if (!idToken) {
        return {
          body: 'Bad Request',
          status: '400', // Note: do not send 403 (!) as we have CloudFront send back index.html for 403's to enable SPA-routing
          statusDescription: 'Bad Request',
          headers: headersCloudfront,
        };
      }
      const tokens = { id_token: idToken, access_token: idToken, refresh_token: refreshToken };
      const qs = {
        logout_uri: `https://${domainName}`,
        client_id: COGNITO_CLIENT_ID,
      };

      return {
        status: '307',
        statusDescription: 'Temporary Redirect',
        headers: {
          location: [{
            key: 'location',
            value: `https://${COGNITO_DOMAIN}/logout?${stringifyQueryString(qs)}`,
          }],
          'set-cookie': getCookieHeaders(COGNITO_CLIENT_ID, COGNITO_SCOPE, tokens, domainName, cookieSettings, true),
          ...headersCloudfront,
        },
      };
    }

    // /////////////////////// Default behavior * ///////////////////////
    const nonce = nonceGenerator(10);
    const requestedUri = `${request.uri}${request.querystring ? `?${request.querystring}` : ''}`;

    if (!cookies || !idToken || !tokenUserName) {
      console.info('User is not authenticated');
      const { code_verifier: codeVerifier, code_challenge: codeChallenge } = pkceChallenge();

      const COGNITO_URL = `https://${COGNITO_DOMAIN}/oauth2/authorize?${stringifyQueryString(
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
      return response;
    }

    console.info('User is authenticated');
    const { exp } = decodeToken(idToken);
    if ((Date.now() / 1000) - 60 > exp && refreshToken) {
      console.info('Token has expired');
      return {
        status: '307',
        statusDescription: 'Temporary Redirect',
        headers: {
          location: [{
            key: 'location',
            value: `https://${domainName}${APP_AUTH_REFRESH_URI}?${stringifyQueryString({ requestedUri, nonce })}`,
          }],
          'set-cookie': [
            { key: 'set-cookie', value: `spa-auth-edge-nonce=${encodeURIComponent(nonce)}; ${cookieSettings.nonce}` },
          ],
          ...headersCloudfront,
        },
      };
    }

    const tokenIssuer = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`;
    const tokenJwksUri = `${tokenIssuer}/.well-known/jwks.json`;

    try {
      await validate(idToken, tokenJwksUri, tokenIssuer, COGNITO_CLIENT_ID);
      // Return the request unaltered to allow access to the resource:
      return request;
    } catch (e) {
      console.info(e.toString());
      console.log('Removing all cookies');
      const tokens = { id_token: '', access_token: '', refresh_token: '' };
      const response = {
        body: createErrorHtml('Bad Request', ''),
        status: '400',
        headers: {
          'set-cookie': getCookieHeaders(COGNITO_CLIENT_ID, COGNITO_SCOPE, tokens, domainName, cookieSettings, true),
          ...headersCloudfront,
        },
      };
      return response;
    }
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
