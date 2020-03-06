# Authorization@Edge using cookies

This solution is inspired in this [AWS Blog post](https://aws.amazon.com/es/blogs/networking-and-content-delivery/authorizationedge-using-cookies-protect-your-amazon-cloudfront-content-from-being-downloaded-by-unauthenticated-users/)

---

## The sample solution, step by step
To understand how all the building blocks work together, let’s look at the scenario of a user who tries to access the SPA but hasn’t authenticated yet.

The following are the three main parts to the solution’s flow:

**Part 1**: The user attempts to access the SPA and a Lambda@Edge function is invoked that redirects to Cognito for authentication.

![Auth part 1](/docs/images/part-1.png)

**Part 2**: The user authenticates and is redirected back to CloudFront. CloudFront verifies authentication using a Lambda@Edge function, and then sets cookies with JWTs.

![Auth part 3](/docs/images/part-2.png)

**Part 3**: The user’s browser follows the redirect and reattempts to access the SPA. Lambda@Edge validates that access is now authorized, by checking the JWTs in the cookies.

![Auth part 3](/docs/images/part-3.png)

---

## How to deploy the solution

1. Clone Git Repository
    `git clone https://servidor0008.cepsacorp.com/platform/poc-lambda-edge-auth-cognito.git`
2. Copy file `example_config.json` and name it to `config.json`
    1. Complete `config.json` with all the necessary information
3. Execute `npm install`
4. Execute `npm run build`
5. Use the generated zip in `/dist/lambda_edge.zip` to create your Lambda@Edge
6. **Assign** this Lambda@Edge function to your Cloudfront distribution on the the **desired path**
    1. Use the Cloudfront Event `Viewer Request`
    1. It is **not necessary to include the body**
    1. Make sure that your Cloudfront behavior is **forwarding query string and headers**

