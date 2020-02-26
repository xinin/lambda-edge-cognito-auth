// const { handler } = require('./index');
const { handler } = require('./dist/bundle');

const event = {
  Records: [
    {
      cf: {
        config: {
          distributionDomainName: 'd1sfiq4a2li36q.cloudfront.net',
          distributionId: 'E3LXQHM5T3HE99',
          eventType: 'viewer-request',
          requestId: 'vkZRGd3i6bJJRk_N-CcW_3mEz3jhnUbsmnte9A7noAixVgoH-VVuAw==',
        },
        request: {
          clientIp: '79.148.239.115',
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
            'upgrade-insecure-requests': [
              {
                key: 'upgrade-insecure-requests',
                value: '1',
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
                value: 'none',
              },
            ],
            'sec-fetch-mode': [
              {
                key: 'sec-fetch-mode',
                value: 'navigate',
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
          },
          method: 'GET',
          querystring: '',
          uri: '/',
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
