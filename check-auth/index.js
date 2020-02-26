const { stringify: stringifyQueryString } = require('querystring');

const nonceGenerator = require('nonce-generator');
const pkceChallenge = require('pkce-challenge');

const {
  headersCloudfront, getCookies, decodeToken, validate,
} = require('./utils');

const COGNITO_DOMAIN = 'gyp-code-test';
const COGNITO_CLIENT_ID = '3gc6acvtrh829d7pmq0qscidrr';
const COGNITO_REDIRECT_URI = 'https://d1sfiq4a2li36q.cloudfront.net/cognito_cb';
const COGNITO_RESPONSE_TYPE = 'code';
const COGNITO_SCOPE = ['email', 'openid'];
const COGNITO_REGION = 'eu-west-1';
const COGNITO_USER_POOL_ID = 'eu-west-1_WRRXNv7s5';

const COGNITO_IDP = 'COGNITO';

const APP_SIGNIN_URI = '/parseauth';

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
