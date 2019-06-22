
const shortid = require('shortid');

const db = process.env.IN_MEMORY_DB
    ? require('../../test/services/database')
    : require('../services/database');
const fileStorage = process.env.IN_MEMORY_FS
    ? require('../../test/services/filestorage')
    : require('../services/filestorage');
const sendError = require('../utils/errors');

// generate post id and media storage path
const initPost = async () => {
    const postId = shortid.generate(); // FUTURE: may need to check database for this id
    return res => {
        res.send({
            id: postId,
            mediaPath: `media/${postId}`
        });
    };
}

// create and save a post
const createPost = async req => {
    const { id, title, category, htmlBody, thumnailPath } = req.body;
    const mediaPaths = req.body.mediaPaths || []; // empty if not provided
    const createdTime = new Date().toISOString();
    const author = req.user.id;
    const published = false; // don't publish until all saves are successfull
    const bodyPath = `posts/${id}.html`;

    if(!htmlBody) {
        console.error('Missing post html body');
        return res => {
            sendError.badRequest(res);
        }
    }

    
    //check that all media files exist
    const validMedia = (Array.isArray(mediaPaths))
        && (await Promise.all(mediaPaths.push(thumnailPath).map( async path => fileStorage.fileExists(path))))
            .every(exists => exists);
    if(!validMedia) {
        console.error('Invalid or missing media files');
        return res => {
            sendError.badRequest(res);
        };
    }

    // create new post entry in database
    try {
        db.post.create({
            id,
            author,
            createdTime,
            title,
            category,
            published,
            bodyPath,
            thumnailPath,
            mediaPaths
        });
    } catch(error) {
        console.error(error);
        return res => {
            sendError.badRequest(res);
        };
    }

    //save the post body to s3
    try {
        fileStorage.saveFile(bodyPath, htmlBody);
    } catch(error) {
        console.error(error);
        return res => {
            sendError.serverError(res);
        };
    }

    //mark post as published if specified in request
    if(req.body.published) {
        // TODO: update database
    }

    // success, new post created
    return res =>{
        res.status(204).end();
    };
};

// edit an existing post
const editPost = async req => {

};

// get a complete post
const getPost = async req => {

};

// get a list containing the metadata for multiple posts
const getPreviews = async req => {

};

module.exports = {
    initPost,
    createPost
};
