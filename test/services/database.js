
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
    return new Promise((resolve, reject) => {
        try {
            let User = new DynamoDBUser(user);
            users[user.ID] = User;
            resolve(user);
        } catch(err) {
           reject(err);
        }
    });
};

const getUser = (id) => {
    // return matching user from users object
    return new Promise( resolve => resolve(users[id].getProperties()));
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
