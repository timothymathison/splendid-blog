# Splendid-Blog

A dynamic blog built with ReactJS and ExpressJS for Node.

### Prerequisites

- [Node](https://nodejs.org/en/) (preferably `v9.5`+)
- [AWS CLI](https://aws.amazon.com/cli/)
- AWS account access with _DynamoDB_ and _S3_ configured (see [From Scratch Setup Instructions](#From-Scratch-Setup))

### Getting Started

**Install Server:**

```shell
$ npm install
```

**Install Client:**

```shell
$ npm run install:client
```

**Run Server and Client in dev mode:**

```shell
$ npm start
```

_Client_ will be exposed on `localhost:3000`, _Server_ on `localhost:4000` and `localhost:3000/api/`

**Run all tests (_unit_ and _acceptance_) on Server and Client:**

```shell
$ npm test
```

**Deploy to _lambda_(must be already created):**

```shell
$ npm run deploy
```

#### Server Commands

**Start (will serve client from client build folder):**

```shell
$ npm run start:server
```

**Build Client:**

```shell
$ npm run build:client
```

For more _Client_ commands see `client/README.md`

**Run unit tests:**

```shell
$ npm run test:server:unit
```

**Run acceptance tests (uses postman CLI `newman`):**

```shell
$ npm run test:server:api
```

**Run all tests:**

```shell
$ npm run test:server
```

### References

- [Configuring AWS Javascript SDK](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/configuring-the-jssdk.html)
- [ClaudiJS](https://www.claudiajs.com/tutorials/) (_lambda_ deployment tool)
- [DyanmoDB Javascript SDK Docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html)
- [S3 Javascript SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html)
- [Newman](https://learning.getpostman.com/docs/postman/collection_runs/command_line_integration_with_newman/) (Postman CLI)

### From Scratch Setup

1. Create AWS user with the following _permissions_ attached:

   - `AWSLambdaFullAccess`
   - `AmazonS3FullAccess`
   - `AmazonDynamoDBFullAccess`
   - `AWSCloudTrailFullAccess`
   - `AmazonAPIGatewayAdministrator`
   - `AWSCloudFormationFullAccess`

2. Add the AWS profile `splendid-blog` with the access keys for the above user to your `~/.aws/credentials` file (used by CLI)

3. Create the AWS _role_ `splendid-blog-lambda` (to be used by _lambda_) with the following _permissions_ attached:

   - `AWSLambdaFullAccess`
   - `AmazonS3FullAccess`
   - `AmazonDynamoDBFullAccess`
   - `AmazonAPIGatewayAdministrator`

4. Create the _S3_ and _DynamoDB_ infrastructure resources by running:
   ```shell
   $ npm run create:infrastructure
   ```
5. Create the _lambda_ instance with the _Server_ and _Client_ (`client/build` directory) deployed:

   ```
   $ npm run create:lambda-instance
   ```
