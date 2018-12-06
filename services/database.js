const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const DynamoDBUser = require('../models/dynamodbuser');

const postsTable = process.env.AWS_POST_TABLE || 'SplendidBlogPosts'; //define from env otherwise default
const usersTable = process.env.AWS_USER_TABLE || 'SplendidBlogUsers';

const createPost = (post) => {
    //save a new post database entry and return success
};

const getPost = (id) => {
    //return single post entry from database
};

const getMultiplePosts = (ids) => {
    //return list of post entries from database
};

const saveNewUser = (user) => {
    let User = new DynamoDBUser(user);
    let dbParams = {
        Item: User,
        TableName: usersTable
    };
    return new Promise((resolve, reject) => {
        dynamodb.putItem(dbParams, (err, data) => {
            if(err) {
                reject(err); //TODO: log some error information
            } else {
                resolve(user);
            }
        })
    });
    // save new user in database
};

const getUser = (id) => {
    user = {
        ID: id,
        Role: 'admin',
        FirstName: null,
        LastName: null,
        Email: null
    };
    //TODO: return a user entry from database
    return user;
};

module.exports = {
    post: {
        create: createPost,
        get: getPost,
        getMultiple: getMultiplePosts
    },
    user: {
        saveNew: saveNewUser,
        get: getUser,
        getRoles: DynamoDBUser.prototype.getRoles
    }
};
