const { handler } = require('../index');
// const { handler } = require('../dist/index');

const event = {
  Records: [
    {
      cf: {
        config: {
          distributionDomainName: 'd1sfiq4a2li36q.cloudfront.net',
          distributionId: 'E3LXQHM5T3HE99',
          eventType: 'viewer-request',
          requestId: 'vgbxAsYlxljDz8X7HfTyljG4UPReIIMdR1-Ik30UdYpCtQB0GRMUsw==',
        },
        request: {
          clientIp: '109.49.168.166',
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
            'if-none-match': [
              {
                key: 'if-none-match',
                value: '"d64149ba079062b96374c411ccbd4d52"',
              },
            ],
            'if-modified-since': [
              {
                key: 'if-modified-since',
                value: 'Thu, 27 Feb 2020 12:08:10 GMT',
              },
            ],
            cookie: [
              {
                key: 'cookie',
                value: 'idTokenKey=eyJraWQiOiJNczUreFg4Q3V0bFowaFdwcmxGV3E3RFpKK3o0UlwvS0hiTXlzU0poMVwvVVk9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoiOXlHbkw5VGJMVnVneUE4VHVCYUFXZyIsInN1YiI6IjNiOGYyMmVlLWVmZDMtNGViYy1iNTNhLWUzYzEwY2NiMjljMSIsImF1ZCI6IjNnYzZhY3Z0cmg4MjlkN3BtcTBxc2NpZHJyIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTgyNzEzODA4LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9XUlJYTnY3czUiLCJjb2duaXRvOnVzZXJuYW1lIjoiM2I4ZjIyZWUtZWZkMy00ZWJjLWI1M2EtZTNjMTBjY2IyOWMxIiwiZXhwIjoxNTgyNzE3NDA4LCJpYXQiOjE1ODI3MTM4MDgsImVtYWlsIjoiZGllZ29wcnVlYmFAbWllYW1pbC5jb20ifQ.QRs3h2tO43nr7sOUCPTzO2StEAvFGLe6yLJWNnLqNYNhjz6tO2krEZaLLZO5ybicvdZozWStbKxnX4KfbwF9vK39RqYqlrOXZBwXIMSQVA5wAx1vcL_YI4sZ3H0CQqan76sEz699F-FX0_fHMX8ZQLl72L-FXUQXr4PBylZDyNyEfA85bueHRG3GWnprYtI_ejOogLojE70lpXE5dYbLle592mjRWEHG3ZDk4zs9ii0e7_p0o_f-3nwOg4hawqtFgZ2VlLTPaVy1W1MwCTugXu2S3FT8sbNZDpo-JZwe2m4_RDKUdpYLyduv1-WI4CgGSXDZqydKhK2SHVsMiczyHQ; accessTokenKey=eyJraWQiOiJPZlpVSnF0UlI5UVJNazZranQ3NGRVSWZRVk5VRDF6eFhvTGNXU2p4TFRnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIzYjhmMjJlZS1lZmQzLTRlYmMtYjUzYS1lM2MxMGNjYjI5YzEiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCBlbWFpbCIsImF1dGhfdGltZSI6MTU4MjcxMzgwOCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTFfV1JSWE52N3M1IiwiZXhwIjoxNTgyNzE3NDA4LCJpYXQiOjE1ODI3MTM4MDgsInZlcnNpb24iOjIsImp0aSI6ImFmYTk4MzlhLWUwZDgtNDE0NS05N2ZhLTM2Y2M5Mjc1MWEyMSIsImNsaWVudF9pZCI6IjNnYzZhY3Z0cmg4MjlkN3BtcTBxc2NpZHJyIiwidXNlcm5hbWUiOiIzYjhmMjJlZS1lZmQzLTRlYmMtYjUzYS1lM2MxMGNjYjI5YzEifQ.HtoNS2x_x2YT5WntBtl5i5bvd01PyoCq1r-tbHMHOs6-zMrAJmq1Q2oj7LuVDH2ANQqxmsIYb3tzbZItp3dk6QT0X8uvhgKKIt1GzeB_spj_s6pmb29rowSG5hRAI0eAgG3yE56s62ztWLwFl8pV4vTHktA34aSxw_D6OHZq8hHHUU7hTCHj30mZp5-V-1vIDcCh0bkw7nOXWXItfVzA_NBclkVeAxEnraemPp8_GgX9bXl9nUsPeJRlLKuTtsHoepf8OIKMkKQXyV7pMTzdgpPdforMQ4hjpwonLV0JbPg43WOt5QHjc1-xasj8IjjZaOyB4FSN0cNBAMK_vmwhcw; refreshTokenKey=eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.LzEYRMsKV5T7_lOuYxQs7AcgmBKkb_khyCIfA-NaMm01VyW7KKfYjyX_R074Gbup4NWmFSLgWe4Rvsa2q1RaG9D3GV5docGYkUgDb5wvSeSdEgepTGz0fiQ19QIDBxLrQWoNZkXPjC-FtX6uO9SfxKmZlSo3Hb_toJDG4j3wNpCFOkcml02qyKJk4kp8fzpiYXh2Ay-2I_AqxG2CVGhFu4oXCoZ5VZ26m7OBXevECrl2WE1jr147sEA2tQudw9mUAYviY1zOK48T-hGGzQe2nKhcKJnl9jmyzKGJupmpkfsyIOJpuvlbk2diA7TGCFLTIy5oYdUq13TPU6hd_jZfuQ.wPX9Wb85a01e1gw4.tqJh0H1lMEn7c6oRj6WUuV8IaJUR-5YqF1zcs5JIF3xVpZf5-cNs4kRz-50tSBQvUmChQuxuKSBxtuBpMr8tM-1jr66YtCBMJC-jeA_5z3Y3xA2zE4OOGKnXW7f_FSeJYBMuuQlBwQ3yJy65FEuo3K9dpaedFaRoWXU-cGL5YayypTnddu1yVtPEE6S8pZ6vCggBzL5TD4fnxvSxLzP2xN1-QZP_JG0wo2yv0XVzhBTLSHoequmJGEQ6FYAzbNea6PMXlYhLG1Z3BuFg1c7sreBmoUH9e9lscOh2fd2XJxjceGJFjGGhX_MXQmCCf_LzTCVAf9DcUrq-oJaDiYVbWJuwVDDEIm3CV1S6fcEo0sBKZmaeO4AWodauiibM0ar8pbNiTJm2x9eZzYA_4VD4qovVaTd5pzqKYHJ315-nM1DTH9aNj8unLUJjfDd0mjl1sF_g0V84IJBOrInClclt2bGTrZkdW7tnrXODPNoZPA2JDyO1E6Ci0UU28LZNF_ylk0ejePCGgt93ntP6oLy8CtklZFJv_pRSQD1jIT6_EkwObYQrVZDFUe22RJsDD1PASxbr1h1YXLWZV9c5-SbRFyCP7Cd-UPNpwl7Fh-uwn_rt4YXUQ8AoaNZK26PFpxPYGSFeFSen8bNHiDChWYfS2AoLOFz0-aLMCqpON1iKvawPCdNJYLwOrHe-YF4gjhRct8ulynVHL9CaXV4XZSFuXJvmjGwnhI56lfbAuF0u4m6BbN2_Q699LGXcxhTFgR0_or3vkqaA5LgyCZNVIGl8gpmjsXSvwXCj_1pXekEGF8vuGYMcsSNCfxf9MJ1zpncB5wgDiDjz9jpSRBBC16nmfnfsWZKHUWPBJDs2XJ6nrn3hyOusCAsPEDBpVGt97p2GORH_iXXu7DbALCWo7X_8d4MzyDoW9BDt0I_t7kNqQoj1LxhK5yeUPlDlsHf_o4MmI1IAhcw-TN0t3JcxhyFEG-wZmuuSIeUNG2S_SehiycnyiwIz6lHF4ZTgLj3dx_2XXNcfxFzDB82dDh1KavQZ9Bl3HgRyOdpLO_nmaNGST4YF_wOTxSCPUd6LSXod-te9jXtK9o-vGhRP9Kkfb2vghMAeWxOl0anuweQr0L3oS-Yj4d70MGJovoFl5zLKGU8HW3vApZ8aOsx-Dc_9NbQNdO2SNGXKBJXA7Hqu9huj-gUxjPXG8ab7xqlmAQ5wg-FAkKEvTVChm0kvFEsnOULlvkow.GmKagZO7IkecptOZ92iyyw; lastUserKey=3b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1; scopeKey=email openid; userDataKey=%7B%22UserAttributes%22%3A%5B%7B%22Name%22%3A%22sub%22%2C%22Value%22%3A%223b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1%22%7D%2C%7B%22Name%22%3A%22email%22%2C%22Value%22%3A%22diegoprueba%40mieamil.com%22%7D%5D%2C%22Username%22%3A%223b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1%22%7D; amplify-signin-with-hostedUI=true; CognitoIdentityServiceProvider.3gc6acvtrh829d7pmq0qscidrr.LastAuthUser=3b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1; CognitoIdentityServiceProvider.3gc6acvtrh829d7pmq0qscidrr.3b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1.tokenScopesString=email openid; CognitoIdentityServiceProvider.3gc6acvtrh829d7pmq0qscidrr.3b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1.userData=%7B%22UserAttributes%22%3A%5B%7B%22Name%22%3A%22sub%22%2C%22Value%22%3A%223b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1%22%7D%2C%7B%22Name%22%3A%22email%22%2C%22Value%22%3A%22diegoprueba%40mieamil.com%22%7D%5D%2C%22Username%22%3A%223b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1%22%7D; CognitoIdentityServiceProvider.3gc6acvtrh829d7pmq0qscidrr.3b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1.idToken=eyJraWQiOiJNczUreFg4Q3V0bFowaFdwcmxGV3E3RFpKK3o0UlwvS0hiTXlzU0poMVwvVVk9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoiMnlhVVJNNzhWVlZlODF2Y1NkeHFfdyIsInN1YiI6IjNiOGYyMmVlLWVmZDMtNGViYy1iNTNhLWUzYzEwY2NiMjljMSIsImF1ZCI6IjNnYzZhY3Z0cmg4MjlkN3BtcTBxc2NpZHJyIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTgyODE3NzYzLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9XUlJYTnY3czUiLCJjb2duaXRvOnVzZXJuYW1lIjoiM2I4ZjIyZWUtZWZkMy00ZWJjLWI1M2EtZTNjMTBjY2IyOWMxIiwiZXhwIjoxNTgyODk4MTc4LCJpYXQiOjE1ODI4OTQ1NzgsImVtYWlsIjoiZGllZ29wcnVlYmFAbWllYW1pbC5jb20ifQ.kQzy82Lrg1gQsx9WzLpt6fRWkVKkHQw5g7-wSNY10VdLN1qSn6oWW7oocJQu-nlkaUeSymdILcT_Rl5JBcPbm_HdbxQOG_COeHQqD25juFSXHbyAICoohv7LeebOnp-H8mV-DeEPSeFsYcP2Rs9hRZM8ihtsviJWUEBGW2xmIDOLkyWyeARo2DIOC_MmTylbs6nMMr12XDFekZyBrPH5h316ZyacF7rS5-o-Y4OL_56W6r-jutI_JnJFsNf08K-0c9bj3WK0MzdfHATOtF9fyG64_NWu5BnWIQKjMmbeqAEzwBcIJCwAx1LyIvzc6KIFS5pm7PO-6vwsUL0xKd4hug; CognitoIdentityServiceProvider.3gc6acvtrh829d7pmq0qscidrr.3b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1.accessToken=eyJraWQiOiJPZlpVSnF0UlI5UVJNazZranQ3NGRVSWZRVk5VRDF6eFhvTGNXU2p4TFRnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIzYjhmMjJlZS1lZmQzLTRlYmMtYjUzYS1lM2MxMGNjYjI5YzEiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCBlbWFpbCIsImF1dGhfdGltZSI6MTU4MjgxNzc2MywiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTFfV1JSWE52N3M1IiwiZXhwIjoxNTgyODk4MTc4LCJpYXQiOjE1ODI4OTQ1NzgsInZlcnNpb24iOjIsImp0aSI6IjI5N2FiNjQ3LWJiNWYtNGE4Yi1hZTQwLTAxNDQwYjVjZWFiYSIsImNsaWVudF9pZCI6IjNnYzZhY3Z0cmg4MjlkN3BtcTBxc2NpZHJyIiwidXNlcm5hbWUiOiIzYjhmMjJlZS1lZmQzLTRlYmMtYjUzYS1lM2MxMGNjYjI5YzEifQ.Xh3YqyO56r3XT0LyqXTiYHDNAqgWpkeCILk_6NmJAWEFiAdMWZdvBgzuX_-A6ZSdqj7cIBHIxLmQ34yuH_j9AmwF7F34OlhNbdMA0E8corRYx_6qpk8AAWPK3KVfGGCQu0JFS6A0N1M_Tmdp8aOWT37jvQBIIRe8wmbiEduVHZRY9uzDg2nOJmzqnJoeoFeFDVS_bb-mKsHkEdQ4Pds0gKhc1IR1vFGfQN9eOKUySBHpSWEcABcKH2QLi80S0xSgOSZSATyx5KKKB_GeuYAWcQ9G2KhvYe_KaXdK7BQ7vRC2qTBdQi1xktvnO1QfJY91DKkQbr8y3_DWV0cwV9DGnQ',
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
