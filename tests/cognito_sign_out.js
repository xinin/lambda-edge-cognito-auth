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
          requestId: 'MbqIBLYSAm9FhsE9pVfn-PsKAkIhYAAODbhHb0eGvSKXUWdxIp9K7g==',
        },
        request: {
          clientIp: '109.49.168.166',
          headers: {
            host: [
              {
                key: 'Host',
                value: 'cloudfront.adfsprueba123.com',
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
            purpose: [
              {
                key: 'purpose',
                value: 'prefetch',
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
            'sec-fetch-user': [
              {
                key: 'sec-fetch-user',
                value: '?1',
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
                value: 'spa-auth-edge-nonce=uK9bP4mPSp; spa-auth-edge-pkce=uu5MHWH0rr1-k_GVUZnzZcM~A.W2-QHmEdVr4wkyMhl; CognitoIdentityServiceProvider.3gc6acvtrh829d7pmq0qscidrr.3b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1.idToken=eyJraWQiOiJNczUreFg4Q3V0bFowaFdwcmxGV3E3RFpKK3o0UlwvS0hiTXlzU0poMVwvVVk9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoiclhlSjhCQ0tmSjFPQ1o0elJyUEE5ZyIsInN1YiI6IjNiOGYyMmVlLWVmZDMtNGViYy1iNTNhLWUzYzEwY2NiMjljMSIsImF1ZCI6IjNnYzZhY3Z0cmg4MjlkN3BtcTBxc2NpZHJyIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTg0MDE3MjUxLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV9XUlJYTnY3czUiLCJjb2duaXRvOnVzZXJuYW1lIjoiM2I4ZjIyZWUtZWZkMy00ZWJjLWI1M2EtZTNjMTBjY2IyOWMxIiwiZXhwIjoxNTg0MDIwODUxLCJpYXQiOjE1ODQwMTcyNTEsImVtYWlsIjoiZGllZ29wcnVlYmFAbWllYW1pbC5jb20ifQ.PpGpUj3aQyg0Dib6zt5IkMKswmbRvTwkrIhMONjTTXQoEODKKc3rYsNK5NP-b9fjJT3-NLwZS7ZYOMCPQH_fazxwbMPWT1ts5u3X7A59V4FjroUXuj6K9HLBCyFjTMXeRgWv4Empg1w-C9UJ4QLIQ3QCQwgaX2cNZ_ZAJs9IP_eCF_Tg1_YKxME9EKJQ_bp5FcF9uDcumYULzgVn9D2VjwaQSXGImOJzWqtEi01pk8xqyWNs8WvBNZSoZTEueaEFTjjphOl-AbwP0zu-4hIy_c5IX483PkXaF4Aadmj7aEd0Q246Iwp3K9ER3SVgzElExIhMe67HIBldHvei6e1Ovg; CognitoIdentityServiceProvider.3gc6acvtrh829d7pmq0qscidrr.3b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1.accessToken=eyJraWQiOiJPZlpVSnF0UlI5UVJNazZranQ3NGRVSWZRVk5VRDF6eFhvTGNXU2p4TFRnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIzYjhmMjJlZS1lZmQzLTRlYmMtYjUzYS1lM2MxMGNjYjI5YzEiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCBlbWFpbCIsImF1dGhfdGltZSI6MTU4NDAxNzI1MSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTFfV1JSWE52N3M1IiwiZXhwIjoxNTg0MDIwODUxLCJpYXQiOjE1ODQwMTcyNTEsInZlcnNpb24iOjIsImp0aSI6ImI1YTViMTlkLTEzMjUtNGVmZi04NGZmLTkxOTkxYzFhNzBlYSIsImNsaWVudF9pZCI6IjNnYzZhY3Z0cmg4MjlkN3BtcTBxc2NpZHJyIiwidXNlcm5hbWUiOiIzYjhmMjJlZS1lZmQzLTRlYmMtYjUzYS1lM2MxMGNjYjI5YzEifQ.pRHDyVlibP007BS--_1epmRp3LuwItlx3gd577TZ8kCajTLiVrXsobJGGYjSQZEvbDs9DLGrn-cKqlWCejWu2Guf0dIuR8wPahzwQR8yV8fHHPamNFVCx1QOe5Cr0-mFsnOE7YbFPiLtmgVVKAmaJahriWX5aJAuI_GTY9j8SEt_7SArJjso5jbmWdxx2dwBuOvdWMyrzm6UXIqj56kPe-Ark2gGht4vKLiybKrP04No1kf7j2J30A19OC1ZXfQLW6XmK4iFCfWV9HA0jCdbNHRBd50V7PPYNmbG8NUD-5HzjKpGSZoijwLA7gEasApSm_22YFTdB1DVmpaEBKqC-w; CognitoIdentityServiceProvider.3gc6acvtrh829d7pmq0qscidrr.3b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1.refreshToken=eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.qYpB4E0DJGY3-l-N27Xlpp64lyFujy3KsCpq620Bxo13qqUsQKoSFim8ogmfrcbjJsveVuQdKJmsa7hJO_N9pDePAMGU2OwJNJteBKrcEH5xnt1rwxOKi6A2r7JAwUOO3Hc3RleN2Nr72JjZnwEAa9bBQlvMLDJsbT2PNJi_3jUPc0Or3Vahww9BohU_nueMaYXddOEk2Etw_hSd0_O9Gbvus37qTFZAjPaFmxPGlhRQGfHbQuOBmJ0SurgYdGhycl6mdSv-nF6APH7kmOjn-lC5SrHhLmsq-0ma5NeO0wkBAxbf1HRXhwj_exG4yreiJdhWmGV6e7mG2meIv49GUg.cxLDHRKzw2SntfLI.7elSmau-gp2cChtFpLGqP7qzZojGBQvxA0nvPWB9EdqqLWIprq2L1ZIBWFZVpGaA19dYUFU2Wzx1N2-Ub695iw6F0v5oU8K67gqZUj3VmmGnT-QNvskCq2KMkzNxOzWjsq8WyG04NN5c0rVOhudALEb199ihsAt_We__puKupXRY05j2wW5X1Q1cGjRQmvmRB6d3Tk2zSuGKp5Z_3m_tPsaEPSap7xS2_ElF7DSENGP8RizPlKSDh00E6Cr7Pe_ohhBsJYoUu3sYl4uLH6VVScP_DbdUMeV_PDPWCjDqHbkQLK2WUuJg5GoCSLO5R-x_fE8tABgJ3nzdVMXGo9wexFyOgVlBjfEWDbE3RM3HiuuKm3-_KgZzgIf6lT3UL66e5NCJns9gg0qxAQCSEps1rVFWt5q_vAz7Vbg9RMAXczD3LtVkvW2j1SUxaXRHDcEdErPoIq7-q5xlDfUgtLIcU9ClDu3nPJ6bpiNiXsr8sxZmU6kJcZPxT6NQn5XSvzYsbLKtiKEO-0eUX1FAW7tCDQ9yTx_IsPfLYf5RaWtEwyHc9Ik7RoLNoHgukE83vuPkqmr0Oi8Jp0Mc4kfZszSc_ZYcH3OXI3gpz7SoaVCvX_eDu0ViauvnempaR6oo_frp5DzKLjOy7gJT4-bYGvAY4vCh0quIP8lkd4ivoOyGvLLbR3_nfNZkLzDb-87FkNBciBXrvGAB-3jfTKOw3fs4Vr9Ewz8FO7gbFqInpbSTnOxDuXD8ZoX72s-olcQIU0MOJC0b2ByXufVM--JqwZw42eRHIEeGrLVextba8cHFNhV-juEwKnmWP8ZvGSITaTX1ke6_ehQ3VfM7aNnv2Q7r4yoEpCH68nOxqB1Kq6ZeAN202_EfhI3u_noRZfhH0TNlHwe8iWpLPc9RhcSvorO230a6LuuXP9wq_5gmbv7OAJwQBrNqxYuY_XUlNfpnt9H8ENClYMc1oxHiwLVWDYq0B9GLJXUXteMprzj7RfNQqSwmmuqaoK-Deynk7_r-qT0RqbRVMo4web9B7Mn5aTTf8hQaGpivZdl9MNErcwHZpCdPZTrTh0RVWn19ekdSV-ejOkGPl4MRthUDR-NMLKSziaCZXlAO-tNFw1XDMd8nODt_UEO4Io4XNyYHRVzZDVRu2iFHMUtjOLBWZymGjy7EYBUK6LLE-ZhitHFlf-asT409xHZ71rJltHSQL7ooy_cp97ozN50YRULYvtePpsbxJ0ol.rZsOamKRFVf9YwV7rFGfbw; CognitoIdentityServiceProvider.3gc6acvtrh829d7pmq0qscidrr.LastAuthUser=3b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1; CognitoIdentityServiceProvider.3gc6acvtrh829d7pmq0qscidrr.3b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1.tokenScopesString=email openid; CognitoIdentityServiceProvider.3gc6acvtrh829d7pmq0qscidrr.3b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1.userData=%7B%22UserAttributes%22%3A%5B%7B%22Name%22%3A%22sub%22%2C%22Value%22%3A%223b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1%22%7D%2C%7B%22Name%22%3A%22email%22%2C%22Value%22%3A%22diegoprueba%40mieamil.com%22%7D%5D%2C%22Username%22%3A%223b8f22ee-efd3-4ebc-b53a-e3c10ccb29c1%22%7D; amplify-signin-with-hostedUI=true',
              },
            ],
          },
          method: 'GET',
          querystring: '',
          uri: '/signout',
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
