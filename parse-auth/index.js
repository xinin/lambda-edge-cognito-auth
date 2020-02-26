const { parse } = require('cookie');
const { parse: parseQueryString, stringify: stringifyQueryString } = require('querystring');
const axios = require('axios');
const { Agent } = require('https');

const { AxiosRequestConfig, AxiosResponse } = axios;

const COGNITO_DOMAIN = 'gyp-code-test';
const COGNITO_CLIENT_ID = '3gc6acvtrh829d7pmq0qscidrr';
const COGNITO_CLIENT_SECRET = '9qqb7qe7fmr5i5j2i0i6r7hgqimhkk7m78vcmn28e860rruekd6';
const COGNITO_SCOPE = ['email', 'openid'];
const APP_SIGNIN_URI = '/parseauth';


/**

 */

const getCookies = (headers) => {
  if (!headers.cookie) {
    return {};
  }
  return headers.cookie.reduce(
    (reduced, header) => Object.assign(reduced, parse(header.value)),
    {},
  );
};

const headersCloudfront = {
  'content-security-policy': [
    {
      key: 'Content-Security-Policy',
      value: "default-src 'none'; img-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; connect-src 'self' https://*.amazonaws.com https://*.amazoncognito.com",
    },
  ],
  'strict-transport-security': [
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=31536000; includeSubdomains; preload',
    },
  ],
  'referrer-policy': [
    {
      key: 'Referrer-Policy',
      value: 'same-origin',
    },
  ],
  'x-xss-protection': [
    {
      key: 'X-XSS-Protection',
      value: '1; mode=block',
    },
  ],
  'x-frame-options': [
    {
      key: 'X-Frame-Options',
      value: 'DENY',
    },
  ],
  'x-content-type-options': [
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
    },
  ],
};

const createErrorHtml = (title, message, tryAgainHref) => `<!DOCTYPE html>
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


const extractAndParseCookies = (cookies, clientId) => {
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

// TODO esto es una mierda y hay que rehacerlo
const httpPostWithRetry = async (url, data, config) => {
  const AXIOS_INSTANCE = axios.create({
    httpsAgent: new Agent({ keepAlive: true }),
  });
  AXIOS_INSTANCE.defaults.headers = {
    ...config.headers,
  };
  let attempts = 0;
  while (++attempts) {
    try {
      console.log('AXIOS', url, data, config);
      return await AXIOS_INSTANCE.post(url, data, config);
    } catch (err) {
      console.error(`HTTP POST to ${url} failed (attempt ${attempts}):`);
      console.error(err.response && err.response.data || err);
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

const decodeToken = (jwt) => {
  const tokenBody = jwt.split('.')[1];
  const decodableTokenBody = tokenBody.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(Buffer.from(decodableTokenBody, 'base64').toString());
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

const getCookieHeaders = (
  clientId,
  oauthScopes,
  tokens,
  domainName,
  cookieSettings,
  expireAllTokens = false,
) => {
  // Set cookies with the exact names and values Amplify uses for seamless interoperability with Amplify
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
    idTokenKey: `${tokens.id_token}; ${withCookieDomain(domainName, cookieSettings.idToken)}`,
    accessTokenKey: `${tokens.access_token}; ${withCookieDomain(domainName, cookieSettings.accessToken)}`,
    refreshTokenKey: `${tokens.refresh_token}; ${withCookieDomain(domainName, cookieSettings.refreshToken)}`,
    lastUserKey: `${tokenUserName}; ${withCookieDomain(domainName, cookieSettings.idToken)}`,
    scopeKey: `${scopesString}; ${withCookieDomain(domainName, cookieSettings.accessToken)}`,
    userDataKey: `${encodeURIComponent(userData)}; ${withCookieDomain(domainName, cookieSettings.idToken)}`,
    'amplify-signin-with-hostedUI': `true; ${withCookieDomain(domainName, cookieSettings.accessToken)}`,
  };

  // Expire cookies if needed
  if (expireAllTokens) {
    Object.keys(cookies).forEach(key => cookies[key] = expireCookie(cookies[key]));
  } else if (!tokens.refresh_token) {
    cookies[refreshTokenKey] = expireCookie(cookies[refreshTokenKey]);
  }

  // Return object in format of CloudFront headers
  return Object.entries(cookies).map(([k, v]) => ({ key: 'set-cookie', value: `${k}=${v}` }));
};

exports.handler = async (event) => {
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
