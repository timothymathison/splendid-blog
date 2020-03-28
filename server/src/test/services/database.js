
const DynamoDBPost = require('../../main/models/dynamodbpost');
const DynamoDBUser = require('../../main/models/dynamodbuser');

let users = {};
let posts = {};

const savePost = canExist => post => {
    return new Promise((resolve, reject) => {
        try {
            const Post = new DynamoDBPost(post);
            if (!canExist && posts[Post.ID.S]) {
                reject('Post already exists');
            } else {
                posts[Post.ID.S] = Post;
                resolve(Post);
            }
        } catch(err) {
            reject(err);
        }
    });
};

const getPost = id => {
    return new Promise((resolve, _) => {
        resolve(posts[id]);
    });
};

const getMultiplePosts = ids => {
    return new Promise((resolve, _) => {
        resolve(ids.map(id => posts[id]).filter(p => p));
    });
};

const saveNewUser = (user) => {
    // return user if valid
    return new Promise((resolve, reject) => {
        try {
            let User = new DynamoDBUser(user);
            users[user.id] = User;
            resolve(user);
        } catch(err) {
           reject(err);
        }
    });
};

const getUser = (id) => {
    // return matching user from users object
    return new Promise( (resolve, reject) => {
        let user = users[id];
        if(user) {
            resolve(users[id].getProperties())
        } else {
            reject(`User '${id}' does not exist`)
        }  
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
