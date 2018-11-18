const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

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

const getUser = (id) => {
    user = {
        id: id,
        role: 'admin',
        firstName: null,
        lastName: null,
        email: null
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
        get: getUser
    }
};
