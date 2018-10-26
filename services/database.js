const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const postsTable = process.env.AWS_POST_TABLE;

const createPost = (post) => {
    //save a new post database entry and return success
};

const getPost = (id) => {
    //return single post entry from database
};

const getMultiplePosts = (ids) => {
    //return list of post entries from database
};

const getUser = (id) => {
    //return a user entry from database
};

module.exports = {
    posts: {
        create: createPost,
        get: getPost,
        getMultiple: getMultiplePosts
    },
    users: {
        get: getUser
    }
};
