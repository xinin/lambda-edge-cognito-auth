const { parse } = require('cookie');
const { decode, verify } = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const axios = require('axios');
const { Agent } = require('https');

exports.getCookies = (headers) => {
  if (!headers.cookie) {
    return {};
  }
  return headers.cookie.reduce(
    (reduced, header) => Object.assign(reduced, parse(header.value)),
    {},
  );
};

const decodeToken = (jwt) => {
  const tokenBody = jwt.split('.')[1];
  const decodableTokenBody = tokenBody.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(Buffer.from(decodableTokenBody, 'base64').toString());
};
exports.decodeToken = decodeToken;

const getSigningKey = async (jwksUri, kid) => {
  const jwksRsa = jwksClient({ cache: true, rateLimit: true, jwksUri });

  return new Promise((resolve, reject) => jwksRsa.getSigningKey(
    kid,
    (err, jwk) => (err ? reject(err) : resolve(
      jwk.rsaPublicKey ? jwk.rsaPublicKey : jwk.publicKey,
    )),
  ));
};

exports.validate = async (jwtToken, jwksUri, issuer, audience) => {
  const decodedToken = decode(jwtToken, { complete: true });
  if (!decodedToken) {
    throw new Error('Cannot parse JWT token');
  }

  // The JWT contains a "kid" claim, key id, that tells which key was used to sign the token
  const { kid } = decodedToken.header;
  const jwk = await getSigningKey(jwksUri, kid);

  // Verify the JWT
  // This either rejects (JWT not valid), or resolves (JWT valid)
  const verificationOptions = {
    audience,
    issuer,
    ignoreExpiration: false,
  };
  return new Promise((resolve, reject) => verify(
    jwtToken,
    jwk,
    verificationOptions,
    err => (err ? reject(err) : resolve()),
  ));
};

exports.extractAndParseCookies = (cookies, clientId) => {
  const keyPrefix = `CognitoIdentityServiceProvider.${clientId}`;
  const lastUserKey = `${keyPrefix}.LastAuthUser`;
  const tokenUserName = cookies[lastUserKey];

  const scopeKey = `${keyPrefix}.${tokenUserName}.tokenScopesString`;
  const scopes = cookies[scopeKey];

  const idTokenKey = `${keyPrefix}.${tokenUserName}.idToken`;
  const idToken = cookies[idTokenKey];

  const accessTokenKey = `${keyPrefix}.${tokenUserName}.accessToken`;
  const accessToken = cookies[accessTokenKey];

  const refreshTokenKey = `${keyPrefix}.${tokenUserName}.refreshToken`;
  const refreshToken = cookies[refreshTokenKey];

  return {
    tokenUserName,
    idToken,
    accessToken,
    refreshToken,
    scopes,
    nonce: cookies['spa-auth-edge-nonce'],
    pkce: cookies['spa-auth-edge-pkce'],
  };
};

// TODO refactor a esta funcion ?¿ es necesario reintentos?
exports.httpPostWithRetry = async (url, data, config) => {
  const AXIOS_INSTANCE = axios.create({
    httpsAgent: new Agent({ keepAlive: true }),
  });
  AXIOS_INSTANCE.defaults.headers = {
    ...config.headers,
  };
  for (let attempts = 0; attempts < 5; attempts += 1) {
    try {
      console.log('AXIOS', url, data, config);
      return await AXIOS_INSTANCE.post(url, data, config);
    } catch (err) {
      console.error(`HTTP POST to ${url} failed (attempt ${attempts}):`);
      console.error((err.response && err.response.data) ? err.response.data : err);
      if (attempts >= 5) {
        // Try 5 times at most
        break;
      }
      if (attempts >= 2) {
        // After attempting twice immediately, do some exponential backoff with jitter
        await new Promise(resolve => setTimeout(resolve, 25 * (Math.pow(2, attempts) + Math.random() * attempts)));
      }
    }
  }
  throw new Error(`HTTP POST to ${url} failed`);
};

function withCookieDomain(distributionDomainName, cookieSettings) {
  if (cookieSettings.toLowerCase().indexOf('domain') === -1) {
    // Add leading dot for compatibility with Amplify (or js-cookie really)
    return `${cookieSettings}; Domain=.${distributionDomainName}`;
  }
  return cookieSettings;
}

const expireCookie = (cookie) => {
  const cookieParts = cookie
    .split(';')
    .map(part => part.trim())
    .filter(part => !part.toLowerCase().startsWith('max-age'))
    .filter(part => !part.toLowerCase().startsWith('expires'));
  const expires = `Expires=${new Date(0).toUTCString()}`;
  const [, ...settings] = cookieParts; // first part is the cookie value, which we'll clear
  return ['', ...settings, expires].join('; ');
};

exports.getCookieHeaders = (
  clientId,
  oauthScopes,
  tokens,
  domainName,
  cookieSettings,
  expireAllTokens = false,
) => {
  // Set cookies with the exact names and values Amplify uses for seamless interoperability with it
  const decodedIdToken = decodeToken(tokens.id_token);
  const tokenUserName = decodedIdToken['cognito:username'];
  const keyPrefix = `CognitoIdentityServiceProvider.${clientId}`;
  const idTokenKey = `${keyPrefix}.${tokenUserName}.idToken`;
  const accessTokenKey = `${keyPrefix}.${tokenUserName}.accessToken`;
  const refreshTokenKey = `${keyPrefix}.${tokenUserName}.refreshToken`;
  const lastUserKey = `${keyPrefix}.LastAuthUser`;
  const scopeKey = `${keyPrefix}.${tokenUserName}.tokenScopesString`;
  const scopesString = oauthScopes.join(' ');
  const userDataKey = `${keyPrefix}.${tokenUserName}.userData`;
  const userData = JSON.stringify({
    UserAttributes: [
      {
        Name: 'sub',
        Value: decodedIdToken.sub,
      },
      {
        Name: 'email',
        Value: decodedIdToken.email,
      },
    ],
    Username: tokenUserName,
  });

  const cookies = {
    [idTokenKey]: `${tokens.id_token}; ${withCookieDomain(domainName, cookieSettings.idToken)}`,
    [accessTokenKey]: `${tokens.access_token}; ${withCookieDomain(domainName, cookieSettings.accessToken)}`,
    [refreshTokenKey]: `${tokens.refresh_token}; ${withCookieDomain(domainName, cookieSettings.refreshToken)}`,
    [lastUserKey]: `${tokenUserName}; ${withCookieDomain(domainName, cookieSettings.idToken)}`,
    [scopeKey]: `${scopesString}; ${withCookieDomain(domainName, cookieSettings.accessToken)}`,
    [userDataKey]: `${encodeURIComponent(userData)}; ${withCookieDomain(domainName, cookieSettings.idToken)}`,
    'amplify-signin-with-hostedUI': `true; ${withCookieDomain(domainName, cookieSettings.accessToken)}`,
  };

  // Expire cookies if needed
  if (expireAllTokens) {
    Object.keys(cookies).forEach((key) => {
      cookies[key] = expireCookie(cookies[key]);
    });
  } else if (!tokens.refresh_token) {
    cookies[refreshTokenKey] = expireCookie(cookies[refreshTokenKey]);
  }

  // Return object in format of CloudFront headers
  return Object.entries(cookies).map(([k, v]) => ({ key: 'set-cookie', value: `${k}=${v}` }));
};

exports.createErrorHtml = (title, message, tryAgainHref) => `<!DOCTYPE html>
    <html lang="en">
      <head>
          <meta charset="utf-8">
          <title>${title}</title>
      </head>
      <body>
          <h1>${title}</h1>
          <p><b>ERROR:</b> ${message}</p>
          <a href="${tryAgainHref}">Try again</a>
      </body>
    </html>`;

exports.validateRefreshRequest = (
  currentNonce, originalNonce, idToken, accessToken, refreshToken,
) => {
  if (!originalNonce) {
    throw new Error('Your browser didn\'t send the nonce cookie along, but it is required for security (prevent CSRF).');
  } else if (currentNonce !== originalNonce) {
    throw new Error('Nonce mismatch');
  }
  Object.entries({ idToken, accessToken, refreshToken }).forEach(([tokenType, token]) => {
    if (!token) {
      throw new Error(`Missing ${tokenType}`);
    }
  });
};
