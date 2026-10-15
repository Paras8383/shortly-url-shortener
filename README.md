# Shortly - Serverless URL Shortener

Shortly is a URL shortener built with React, TypeScript, and AWS serverless services.

## Features

- Generate short codes for long URLs
- Store URL mappings in Amazon DynamoDB
- Redirect short links to their original destinations
- Serverless API powered by AWS Lambda and API Gateway

## Architecture

- **Frontend:** React, TypeScript, Vite
- **API:** Amazon API Gateway HTTP API
- **Compute:** AWS Lambda (Node.js)
- **Database:** Amazon DynamoDB

### How it works

**Creating a short URL**

1. The user submits a URL through the frontend.
2. API Gateway routes the POST request to the `shorten-url` Lambda function.
3. Lambda generates a short code and stores the mapping in DynamoDB.
4. The API returns the generated short URL.

**Opening a short URL**

1. A visitor opens the short link.
2. API Gateway routes the request to the `redirect-url` Lambda function.
3. Lambda looks up the original URL in DynamoDB.
4. The browser is redirected using an HTTP 302 response.

## Future improvements

- Custom domain
- Improved URL validation and abuse prevention
- Collision retry logic
- Infrastructure as Code and automated deployment

## Cost considerations

AWS services use usage-based pricing and may incur charges. Monitor AWS billing and usage when running this project.

## Author

Paras Mehra
