
const DynamoDBUser = require('../../models/dynamodbuser');

const testPass = process.env.TEST_PASSWORD || 'test_pass';

let users = {};

const createPost = (post) => {
    // TODO: save return sucess if the post is valid
};

const getPost = (id) => {
    // TODO: return single post entry
};

const getMultiplePosts = (ids) => {
    // TODO: return list of post entries
};

const saveNewUser = (user) => {
    // return user if valid
    try {
        let User = new DynamoDBUser(user);
        users[user.ID] = User;
        return new Promise(resolve => resolve(user));
    } catch(err) {
        return new Promise((resolve, reject) => reject(err));
    }
};

const getUser = (id) => {
    // return matching user from users object
    return users[id].getProperties();
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
