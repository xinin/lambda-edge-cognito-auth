const { parse } = require('cookie');
const { decode, verify } = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

exports.headersCloudfront = {
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


exports.getCookies = (headers) => {
  if (!headers.cookie) {
    return {};
  }
  return headers.cookie.reduce(
    (reduced, header) => Object.assign(reduced, parse(header.value)),
    {},
  );
};

exports.decodeToken = (jwt) => {
  const tokenBody = jwt.split('.')[1];
  const decodableTokenBody = tokenBody.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(Buffer.from(decodableTokenBody, 'base64').toString());
};

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
