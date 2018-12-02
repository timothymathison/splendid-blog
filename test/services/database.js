const auth = require('../../services/auth');

const testPass = process.env.TEST_PASSWORD || 'test_pass'
const user = {
    id: 'mock_tim',
    role: 'admin',
    firstName: 'Timothy',
    lastName: 'Mock',
    email: 'timothy@mock.co',
    hashedPassword: auth.hash(testPass)
};
const roles = { user: 'user', admin: 'admin'};

const createPost = (post) => {
    // TODO: save return sucess if the post is valid
};

const getPost = (id) => {
    // TODO: return single post entry
};

const getMultiplePosts = (ids) => {
    // TODO: return list of post entries
};

const createUser = (user) => {
    // return user if valid
    let valid = user.id
        && (user.role === roles.user || user.role === user.admin)
        && user.hashedPassword;
    if(valid) {
        return user;
    } else {
        throw new Error('Trying to create invalid user');
    }
};

const getUser = (id) => {
    // return test user
    return id == user.id ? user : null;
};

module.exports = {
    post: {
        create: createPost,
        get: getPost,
        getMultiple: getMultiplePosts
    },
    user: {
        create: createUser,
        get: getUser,
        roleOptions: roles
    }
};
