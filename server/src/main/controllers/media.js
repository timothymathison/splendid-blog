const fileStorage = process.env.IN_MEMORY_FS ?
    require('../../test/services/filestorage') :
    require('../services/filestorage');
const sendError = require('../utils/errors');

// at least one of letters, numbers or hyphen/underscore followed by image extension
const mediaRegex = new RegExp('^[A-Za-z0-9_\-]+\.(jpg|jpeg|png|gif)$');
const mediaTypeRegex = new RegExp('image\/(jpg|jpeg|png|gif)');
const pathRegex = new RegExp('^[A-Za-z0-9]+$');

// get image/media cooresponding to a particular post
const getMedia = async req => {
    const {
        postId,
        filename
    } = req.params;
    const matchMedia = filename.match(mediaRegex);
    if (!postId.match(pathRegex) || !matchMedia) {
        return res => {
            console.error('Invalid post-id or media name');
            sendError.notFound(res, 'Invalid path or media name');
        }
    } else if (!req.accepts(`image/${matchMedia[1]}`)) {
        return sendError.notAcceptable;
    } else {
        const fullPath = `media/${postId}/${filename}`;
        try {
            const media = await fileStorage.get(fullPath);
            return res => {
                console.log(`Media retrieved: ${fullPath}`);
                res.setHeader('Content-Type', `image/${matchMedia[1]}`);
                res.send(media);
            };
        } catch (err) {
            return res => {
                console.error(err);
                sendError.badRequest(res);
            };
        }
    }
};

// upload media/image logic
const postPutCommon = overwrite => async req => {
    const {
        postId,
        filename
    } = req.params;
    const matchMedia = filename.match(mediaRegex);
    if (!postId.match(pathRegex) || !matchMedia) {
        return res => {
            console.error('Invalid post-id or media name');
            sendError.notFound(res, 'Invalid path or media name');
        };
    } else {
        const contentTypeHeader = req.get('Content-Type');
        const fullPath = `media/${postId}/${filename}`;
        try {
            if (!contentTypeHeader || !contentTypeHeader.match(new RegExp(`image\/${matchMedia[1]}`))) {
                let msg = 'Missing content-type or mis-matched content-type and filename'
                return res => {
                    console.error(msg);
                    sendError.unSupportedMedia(res, msg);
                };
            } else if (!req.body) {
                return res => {
                    console.error('empty body');
                    sendError.badRequest(res);
                };
            } else if (overwrite || !(await fileStorage.exists(fullPath))) {
                await fileStorage.save(fullPath, req.body);
                return res => {
                    console.log(`media uploaded: ${fullPath}`);
                    res.status(204).end();
                };
            } else {
                let msg = 'Specified media resource already exists'
                return res => {
                    console.error(msg);
                    sendError.badRequest(res, msg);
                };
            }
        } catch (err) {
            return res => {
                console.error(err);
                sendError.serverError(res);
            };
        }
    }
};

// delete image
const deleteMedia = async req => {
    const {
        postId,
        filename
    } = req.params;
    const fullPath = `media/${postId}/${filename}`;
    try {
        if (await fileStorage.exists(fullPath)) {
            await fileStorage.delete(fullPath);
            return res => {
                console.log(`media deleted: ${fullPath}`);
                res.status(204).end();
            };
        } else {
            return res => {
                console.error('can\'t delete media, not found');
                sendError.notFound(res);
            };
        }
    } catch (err) {
        return res => {
            console.error(err);
            sendError.serverError(res);
        };
    }
};

module.exports = {
    get: getMedia,
    post: postPutCommon(true),
    put: postPutCommon(false),
    delete: deleteMedia,
    mediaTypeRegex
};