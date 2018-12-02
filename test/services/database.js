
const testPass = process.env.TEST_PASSWORD || 'test_pass';

const roles = { user: 'user', admin: 'admin'};
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

const createUser = (user) => {
    // return user if valid
    let valid = user.id
        && (user.role === roles.user || user.role === roles.admin)
        && user.hashedPassword;
    if(valid) {
        users[user.id] = user;
        return user;
    } else {
        throw new Error('Trying to create invalid user');
    }
};

const getUser = (id) => {
    // return matching user from users object
    return users[id];
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
