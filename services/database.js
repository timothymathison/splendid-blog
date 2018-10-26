const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const postsTable = process.env.AWS_POST_TABLE;

module.exports = {};
