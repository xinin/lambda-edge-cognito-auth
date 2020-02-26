const { stringify: stringifyQueryString } = require('querystring');

// const { decode, verify } = require('jsonwebtoken');
// const jwksClient = require('jwks-rsa');


// const { SigningKey, RsaSigningKey } = jwksClient;

const nonceGenerator = require('nonce-generator');
const pkceChallenge = require('pkce-challenge');

// const { parse } = require('cookie');

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

// const getCookies = (headers) => {
//  if (!headers.cookie) {
//    return {};
//  }
//  return headers.cookie.reduce(
//    (reduced, header) => Object.assign(reduced, parse(header.value)),
//    {},
//  );
// };

// const headersCloudfront = {
//  'content-security-policy': [
//    {
//      key: 'Content-Security-Policy',
//      value: "default-src 'none'; img-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; connect-src 'self' https://*.amazonaws.com https://*.amazoncognito.com",
//    },
//  ],
//  'strict-transport-security': [
//    {
//      key: 'Strict-Transport-Security',
//      value: 'max-age=31536000; includeSubdomains; preload',
//    },
//  ],
//  'referrer-policy': [
//    {
//      key: 'Referrer-Policy',
//      value: 'same-origin',
//    },
//  ],
//  'x-xss-protection': [
//    {
//      key: 'X-XSS-Protection',
//      value: '1; mode=block',
//    },
//  ],
//  'x-frame-options': [
//    {
//      key: 'X-Frame-Options',
//      value: 'DENY',
//    },
//  ],
//  'x-content-type-options': [
//    {
//      key: 'X-Content-Type-Options',
//      value: 'nosniff',
//    },
//  ],
// };

// const decodeToken = (jwt) => {
//  const tokenBody = jwt.split('.')[1];
//  const decodableTokenBody = tokenBody.replace(/-/g, '+').replace(/_/g, '/');
//  return JSON.parse(Buffer.from(decodableTokenBody, 'base64').toString());
// };

// const getSigningKey = async (jwksUri, kid) => {
//  const jwksRsa = jwksClient({ cache: true, rateLimit: true, jwksUri });
//
//  return new Promise((resolve, reject) => jwksRsa.getSigningKey(
//    kid,
//    (err, jwk) => (err ? reject(err) : resolve(jwk.rsaPublicKey ? jwk.rsaPublicKey : jwk.publicKey)),
//  ));
// };

// const validate = async (jwtToken, jwksUri, issuer, audience) => {
//  const decodedToken = decode(jwtToken, { complete: true });
//  if (!decodedToken) {
//    throw new Error('Cannot parse JWT token');
//  }
//
//  // The JWT contains a "kid" claim, key id, that tells which key was used to sign the token
//  const { kid } = decodedToken.header;
//  const jwk = await getSigningKey(jwksUri, kid);
//
//  // Verify the JWT
//  // This either rejects (JWT not valid), or resolves (JWT valid)
//  const verificationOptions = {
//    audience,
//    issuer,
//    ignoreExpiration: false,
//  };
//  return new Promise((resolve, reject) => verify(
//    jwtToken,
//    jwk,
//    verificationOptions,
//    err => (err ? reject(err) : resolve()),
//  ));
// };

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
      console.log('no validado');
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


    return request;
  } catch (E) {
    console.log('Lambda execution error', E);
  }
};
