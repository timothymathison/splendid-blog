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
    return new Promise((resolve, reject) => {
        try {
            let User = new DynamoDBUser(user);
            let dbParams = {
                Item: User,
                TableName: usersTable,
                ConditionExpression: 'attribute_not_exists(ID)'
            };
            // save new user in database, TODO: check whether user already exists
            dynamodb.putItem(dbParams, (err, data) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            })
        } catch(e) {
            reject(e);
        }
    });
    // save new user in database
};

const getUser = (id) => {
    // return User from database, who's ID matches that given
    return new Promise( (resolve, reject) => {
        let params = {
            Key: {
                "ID": {"S": id}
            },
            TableName: usersTable
        };
        dynamodb.getItem(params, (err, res) => {
            if(err) {
                reject(err); // TODO: return custom error
            } else {
                resolve(DynamoDBUser.prototype.getProperties(res.Item));
            }
        });
    });
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
