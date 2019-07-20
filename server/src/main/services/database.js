const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const DynamoDBUser = require('../models/DynamoDBUser');
const DynamoDBPost = require('../models/DynamoDBPost');

const postsTable = process.env.AWS_POST_TABLE || 'SplendidBlogPosts'; //define from env otherwise default
const usersTable = process.env.AWS_USER_TABLE || 'SplendidBlogUsers';

// save post to database and return if successfull
const savePost = canExist => post => {
    return new Promise((resolve, reject) => {
        try {
            const Post = new DynamoDBPost(post);
            const dbParams = {
                Item: Post,
                TableName: postsTable,
            };
            if (!canExist) {
                dbParams.ConditionExpression = 'attribute_not_exists(ID)'
            }
            // save in database
            dynamodb.putItem(dbParams, (err, _) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(Post);
                }
            });
        } catch(e) {
            reject(e);
        }
    });
}

//return single post entry from database
const getPost = id => {
    return new Promise((resolve, reject) => {
        const params = {
            Key: {
                "ID": {"S": id}
            },
            TableName: postsTable
        };
        dynamodb.getItem(params, (err, res) => {
            if(err) {
                reject(err); // TODO: return custom error
            } else {
                resolve(DynamoDBPost.prototype.getProperties(res.Item));
            }
        });
    });
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
            // save new user in database
            dynamodb.putItem(dbParams, (err, data) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            });
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
        create: savePost(false),
        save: savePost(true),
        get: getPost,
        getMultiple: getMultiplePosts
    },
    user: {
        saveNew: saveNewUser,
        get: getUser,
        getRoles: DynamoDBUser.prototype.getRoles
    }
};
