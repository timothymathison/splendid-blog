const shortid = require('shortid');

const db = process.env.IN_MEMORY_DB ?
    require('../../test/services/database') :
    require('../services/database');
const fileStorage = process.env.IN_MEMORY_FS ?
    require('../../test/services/filestorage') :
    require('../services/filestorage');
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
    const {
        id,
        title,
        category,
        published,
        htmlBody,
        thumnail,
        media
    } = req.body;

    //basic validation
    if (!id) {
        const msg = 'Missing post id'
        console.error(msg)
        return res => {
            sendError.badRequest(res, msg);
        }
    }
    if (!htmlBody) {
        const msg = 'Missing post html body';
        console.error(msg);
        return res => {
            sendError.badRequest(res, msg);
        }
    }

    const mediaPaths = (media || []).filter(m => m).map(name => `media/${id}/${name}`);
    const thumnailPath = thumnail && `media/${id}/${thumnail}`;
    const bodyPath = `posts/${id}.html`;
    const createdTime = Date.now();
    const author = req.user.id;

    //TODO: check if post already exists

    //check that all media files exist
    try {
        const validMedia = (
                thumnailPath &&
                Array.isArray(mediaPaths)) &&
            (await Promise.all(
                [thumnailPath, ...mediaPaths]
                .map(path => fileStorage.exists(path))
            ))
            .every(exists => exists);
        if (!validMedia) {
            const msg = 'Invalid or missing media files';
            console.error(msg);
            return res => {
                sendError.badRequest(res, msg);
            };
        }
    } catch (err) {
        return res => {
            console.error('Failed media file check', err);
            sendError.serverError(res);
        }
    }

    //save the post body to s3
    try {
        await fileStorage.save(bodyPath, htmlBody);
    } catch (error) {
        console.error('Failed to save post body to S3', error);
        // TODO: delete post from db
        return res => {
            sendError.serverError(res);
        };
    }

    // create new post entry in database
    const post = {
        id,
        author,
        createdTime,
        title,
        category,
        published,
        bodyPath,
        thumnailPath,
        mediaPaths
    };
    try {
        await db.post.create(post);
    } catch (error) {
        console.error('Failed to create database post entry', error);
        return res => {
            sendError.badRequest(res);
        };
    }

    // success, new post created
    return res => {
        res.status(204).end();
    };
};

// edit an existing post
const editPost = async req => {

};

// get a complete post
const getPost = async req => {
    const {
        postId
    } = req.params;
    try {
        const post = await db.post.get(postId); //TODO: get this working
        return res => {
            console.log(`Post retrieved, id: ${postId}`);
            res.send(post);
        }
    } catch (error) {
        return res => {
            console.error(error);
            sendError.notFound(res, `Could not retrieve post id: ${postId}`);
        }
    }
};

// get a list containing the metadata for multiple posts
const getPreviews = async req => {

};

module.exports = {
    initPost,
    createPost,
    getPost
};