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
          requestId: 'HaMgZVSUP6XYS3C9VFGtbwiTY9VmpjHF-UVkmZ9D395N8lIw5KYDHw==',
        },
        request: {
          clientIp: '193.148.246.23',
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
            pragma: [
              {
                key: 'pragma',
                value: 'no-cache',
              },
            ],
            'cache-control': [
              {
                key: 'cache-control',
                value: 'no-cache',
              },
            ],
            'sec-fetch-dest': [
              {
                key: 'sec-fetch-dest',
                value: 'image',
              },
            ],
            accept: [
              {
                key: 'accept',
                value: 'image/webp,image/apng,image/*,*/*;q=0.8',
              },
            ],
            'sec-fetch-site': [
              {
                key: 'sec-fetch-site',
                value: 'same-origin',
              },
            ],
            'sec-fetch-mode': [
              {
                key: 'sec-fetch-mode',
                value: 'no-cors',
              },
            ],
            referer: [
              {
                key: 'referer',
                value: 'https://d1sfiq4a2li36q.cloudfront.net/test',
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
                value: 'lastUserKey=3b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1; scopeKey=email openid; userDataKey=%7B%22UserAttributes%22%3A%5B%7B%22Name%22%3A%22sub%22%2C%22Value%22%3A%223b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1%22%7D%2C%7B%22Name%22%3A%22email%22%2C%22Value%22%3A%22diegoprueba%40mieamil.com%22%7D%5D%2C%22Username%22%3A%223b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1%22%7D; amplify-signin-with-hostedUI=true; idTokenKey=eyJraWQiOiJNczUreFg4Q3V0bFowaFdwcmxGV3E3RFpKK3o0UlwvS0hiTXlzU0poMVwvVVk9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoiRUNzdUhUQlJ4ZFh4c1BGd2MtVzBTUSIsInN1YiI6IjNiOGYyMmVlLWVmZDMtNGViYy1iNTNhLWUzYzEwY2NiMjljMSIsImF1ZCI6IjNnYzZhY3Z0cmg4MjlkN3BtcTBxc2NpZHJyIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTgyNjMwMjY1LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9XUlJYTnY3czUiLCJjb2duaXRvOnVzZXJuYW1lIjoiM2I4ZjIyZWUtZWZkMy00ZWJjLWI1M2EtZTNjMTBjY2IyOWMxIiwiZXhwIjoxNTgyNjMzODY1LCJpYXQiOjE1ODI2MzAyNjUsImVtYWlsIjoiZGllZ29wcnVlYmFAbWllYW1pbC5jb20ifQ.GWXdba6pOhExF-KMfar6ctWjnBozbc4Uco1ChU-ogzHkfmwo-wSe1NkLYg0C8MEccdQij4bfeXCRbPWWRCDnHgAtsXBVMozHmesEnFgbcDEGneceMxBySHisLdcQ0wtHgV-oT7eiQEZkmqHts2MEkLhogFktmUqn0ndkk9QSmxnAvjLZo3KGkUhJWnLY9ZhXh9iwnG5lcHPtG1IKBfDa8U-l7MOwMcfBLOhEG6oJO81SALbQ5SjquV6QRaBzF66AZ7Dum9YuRKdnEFtnFZIv0Y1FZ6Y7XMnX8CIVTUtW7pHCkc1gTfroKYep6JpFoM9aVLUzjgUf_3Zo-qG-ETK-qw; spa-auth-edge-nonce=kzGMO5x2GX; spa-auth-edge-pkce=8RWxDr9DJG~s0WtEkoZgh1YKav9Msq6d24-NnKra7fV; idTokenKey=eyJraWQiOiJNczUreFg4Q3V0bFowaFdwcmxGV3E3RFpKK3o0UlwvS0hiTXlzU0poMVwvVVk9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoiQTktdHE5cGRhODNqY0FEVGh3YlV3ZyIsInN1YiI6IjNiOGYyMmVlLWVmZDMtNGViYy1iNTNhLWUzYzEwY2NiMjljMSIsImF1ZCI6IjNnYzZhY3Z0cmg4MjlkN3BtcTBxc2NpZHJyIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTgyNjQyNjQyLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9XUlJYTnY3czUiLCJjb2duaXRvOnVzZXJuYW1lIjoiM2I4ZjIyZWUtZWZkMy00ZWJjLWI1M2EtZTNjMTBjY2IyOWMxIiwiZXhwIjoxNTgyNjQ2MjQyLCJpYXQiOjE1ODI2NDI2NDIsImVtYWlsIjoiZGllZ29wcnVlYmFAbWllYW1pbC5jb20ifQ.C7buZbK4ouWgVI8SEoBTUpMTN36goXqOUA_lH-mqNcksXUNbwXzqE57AGMFs65Nk2VCXf6mfZtHc_h9R9qI5LsBbnbymkRzwdhjY_7wEPqnUJc7T3tAkrIBB7qX3EFVgb9darDLOKXASFo5tmSsxHIWGYz6kU7BEXb9DmRYtO74g8PS1uG7hB_5q71IWhwysZRwUZ1aiJ1jkxjUNXU27wYmBySKW4OAHVqvi1WA-0menriMWUI9HYaWx2k6mdDhjnyn--RsNPeeUF1RbRSE_hHulapmDYtGA8yt_lkn6R87SdJnldvp8jwPSOXccu3NmmlnRd6tA_UBoNV0vRqpJ5Q; accessTokenKey=eyJraWQiOiJPZlpVSnF0UlI5UVJNazZranQ3NGRVSWZRVk5VRDF6eFhvTGNXU2p4TFRnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIzYjhmMjJlZS1lZmQzLTRlYmMtYjUzYS1lM2MxMGNjYjI5YzEiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCBlbWFpbCIsImF1dGhfdGltZSI6MTU4MjY0MjY0MiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTFfV1JSWE52N3M1IiwiZXhwIjoxNTgyNjQ2MjQyLCJpYXQiOjE1ODI2NDI2NDIsInZlcnNpb24iOjIsImp0aSI6IjIzOWVmZjg4LTIxOGEtNGM2NS04MDE5LTk4ODc5N2I3Y2ZhZiIsImNsaWVudF9pZCI6IjNnYzZhY3Z0cmg4MjlkN3BtcTBxc2NpZHJyIiwidXNlcm5hbWUiOiIzYjhmMjJlZS1lZmQzLTRlYmMtYjUzYS1lM2MxMGNjYjI5YzEifQ.MCdTJ3SZCopVz20Lg7xysvfY6SL5oKL30RDYLWQ2lu1ClZQ0C97u0eUTK_WjxK0YFJPtUAOy11EYFSdGSp6XTGQ6z9gCTDWFPzXaIB8hvt34MOrKZYPTH26l7gQg8p_ZjakUf3jXVGQbLiG5yZbkS6kIy-2UaQplGi8EzC-DqnIuQoGGhXwSnyBgio3I-pONx7xYtHGq3O5SVWVnc9GQtP8YLpPsoU-kx39uiKRijuBZxwSn1oqyu-Ww_HHnYshu1-CprvV0fqEd5avHMR8GcIfov226BD1B-TCSlAgvFSzjPmoMM3uGrpNYerobMatZ_oc7_M9v5kHsrTKhdQqLEQ; refreshTokenKey=eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.tvUi5U5Td95KGZC2r8sSiOQz_ytfFLFVuMv9j1iFCX1eahXYRnMD8gPVSR3J6Jj-yqQU6B8KwlE_LM32tecP7sbUs3LVgrI5-xH9A_C3AylPAvxY2wSofzHISJHjR3ZT8wy88CTdyUGVHk1MHSjqiS_FBvHO9pYpelJCN9kwuURoxfBrcCTPmxUWb-6cwLAFI837AvnxcvRKZn0073mowb2Qdf1QsoLKThMgr8Vn4-2Cx64Y8SMprNuktbQfSY4l89XFip8n5xVAcA_fhVlulAXjIYoKDtpyCVXbrWw_bMfruAnaIh_dZj9Tb7P6tsJy1aov21IwIoouzKYD7FOr_g.3nB2ByQjC9aPhgIl.o7NuDDcNlu59ND62F2tqsNLme5ruhVOpgpdJjBl7PnjVQF4pCs4OCLve1DHrcrpxu36ZV7ImkaqTUYL9v2T0_yDx2AT2SzyB1D-HkRLiPgzGxqe2ArPC3s6hDQoKyO78VPYYNRx_iczFnmerqS7tfUqFaNkq2w7M2ft5db_4SdM-HUwYcsYSWFUffoEkAImX4V5xh5TeVqETuvLBdCepz9Op1lfOcsOPmEtKDzjfYI_CAj7thMt7A26v2PYkANEQ1tBPYyWajnhAELmpH0gPESw851hZxXqhoFyxMU_JA9GUKfzT97BvNqNUyAJTXstRXUrPcJvJp-hvNjTQoqvy1FoUUdYfw0rsRXBIN4Zs1nZeK_D8qpG7t5fibL8bfz3z_5XZOhurW0KebH8KR3Mv38TU1ABj_Y4PzTDR1OKjSpboGdxpqFGjcOfHX-pKAkZhVw_SXwL0Ke_OrytZN_YagS0mrCQf2lufcDdKlFwlM0GEhcaFJCklHEDOBlYSJgXU8p8kBSfExQG0GeyISEAz4IdPndevJjkwjjQ6LMaOea7j7cCmUpUb0B-n2RCyADmDzDj0kvA8dLnxZ2SsEGQZtneyyFl92tOraxITYY8Qn-QOBKQDl27guAnbIr6LSA1pxn1A9sflush-GJ2UN74lLohYO4XczsW_3aUU0HLN_IlXgJvGYX4GYmLwToIxLeRt2sgno_AgBlG24wZQxIQZ0Nytl9EJc79oh42mTsPpQlx3SCstbjmHGfNiBtSUW5iy8F0NUephGbNBqDw-crhyWpIzzj_HF17rw_8jZpUW8qlndKu6d1Y5lLIxJKml7y5ak9408QTC3HuydVHZEzpaJOypZDDSGR9vn-H7Ua6QfM_FVDdjX8OKJAYKaOkTlOlTnuiod-BXOdYwczeST32z2i6MqVVPoy1fmd5_afXI-y-PG_RQ2FSLkQzGe1sM6qsU5mruayTJHp0QtXk4r8-QVbPJMhbZCBR8P8oq596CG60CMjOi2MNsoZsoMxynWF08WWkagZ6f8kgeQyoO-cDu-Ao4-erbFOaCDqtae14ay16rUTZxWTqa763fArAOb05L5MmEqFguVDGUwGheRuiXiLA7AUtAqi-noan0pT--5FgqgJJn-k0bc4a7ON5aNa-3zFv96s47S-FyQ5ynam0TrGSf4oJTJ71EHm3W6-m6NIG6yymN2VFLinU80X_y01RaeZfAXuXqK1-Uia_DWrdjxZFR.ITIHHtgpqwMBZLbKkYiQhA',
              },
            ],
          },
          method: 'GET',
          querystring: '',
          uri: '/favicon.ico',
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
