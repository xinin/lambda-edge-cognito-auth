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

exports.cookieSettings = {
  idToken: 'Path=/; Secure; SameSite=Lax',
  accessToken: 'Path=/; Secure; SameSite=Lax',
  refreshToken: 'Path=/; Secure; SameSite=Lax',
  nonce: 'Path=/; Secure; HttpOnly; Max-Age=1800; SameSite=Lax',
  'spa-auth-edge-nonce': 'Path=/; Secure; HttpOnly; Max-Age=1800; SameSite=Lax',
  'spa-auth-edge-pkce': 'Path=/; Secure; HttpOnly; Max-Age=1800; SameSite=Lax',
};
