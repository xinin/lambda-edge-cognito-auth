// const { handler } = require('./index');
const { handler } = require('../dist/index');

const event = {
  Records: [
    {
      cf: {
        config: {
          distributionDomainName: 'd1sfiq4a2li36q.cloudfront.net',
          distributionId: 'E3LXQHM5T3HE99',
          eventType: 'viewer-request',
          requestId: 'KJOykLWSFeBQHUw_yT463NlVwRNFrHDtvsDYa61alV5hp8OXYO9A8g==',
        },
        request: {
          clientIp: '77.228.101.230',
          headers: {
            host: [
              {
                key: 'Host',
                value: 'd1sfiq4a2li36q.cloudfront.net',
              },
            ],
            'user-agent': [
              {
                key: 'User-Agent',
                value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36',
              },
            ],
            'cache-control': [
              {
                key: 'cache-control',
                value: 'max-age=0',
              },
            ],
            'upgrade-insecure-requests': [
              {
                key: 'upgrade-insecure-requests',
                value: '1',
              },
            ],
            'sec-fetch-dest': [
              {
                key: 'sec-fetch-dest',
                value: 'document',
              },
            ],
            accept: [
              {
                key: 'accept',
                value: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
              },
            ],
            'sec-fetch-site': [
              {
                key: 'sec-fetch-site',
                value: 'cross-site',
              },
            ],
            'sec-fetch-mode': [
              {
                key: 'sec-fetch-mode',
                value: 'navigate',
              },
            ],
            'sec-fetch-user': [
              {
                key: 'sec-fetch-user',
                value: '?1',
              },
            ],
            referer: [
              {
                key: 'referer',
                value: 'https://gyp-code-test.auth.eu-west-1.amazoncognito.com/login?redirect_uri=https%3A%2F%2Fd1sfiq4a2li36q.cloudfront.net%2Fparseauth&response_type=code&client_id=3gc6acvtrh829d7pmq0qscidrr&state=%7B%22nonce%22%3A%22u3IYPZrXDW%22%2C%22requestedUri%22%3A%22%2F%22%7D&scope=email%20openid&code_challenge_method=S256&code_challenge=NQt2yRMm4dnXKqUNY_bc0ex9j7U7l-WOlm-BE99qih4',
              },
            ],
            'accept-encoding': [
              {
                key: 'accept-encoding',
                value: 'gzip, deflate, br',
              },
            ],
            'accept-language': [
              {
                key: 'accept-language',
                value: 'es-ES,es;q=0.9,en;q=0.8',
              },
            ],
            cookie: [
              {
                key: 'cookie',
                value: 'spa-auth-edge-nonce=u3IYPZrXDW; spa-auth-edge-pkce=732WAh86G2qaEg4yuNB7VMrWJ_ykb1Z69H2JiZ1-ZyX',
              },
            ],
          },
          method: 'GET',
          querystring: 'code=80e63c66-0bbe-4d4d-932c-128a7b7f21eb&state={%22nonce%22:%22u3IYPZrXDW%22,%22requestedUri%22:%22/%22}',
          uri: '/parseauth',
        },
      },
    },
  ],
};


const main = async () => {
  const output = await handler(event);
  console.log(JSON.stringify(output));
};

main();
