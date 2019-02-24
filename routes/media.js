const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const authService = require('../services/auth');
const fileStorage = require(`../${process.env.FILE_STORAGE || 'services/filestorage'}`);
const sendError = require('../utils/errors');

const roles = require('../models/dynamodbuser').prototype.getRoles();

// at least one of letters, numbers or hyphen/underscore followed by image extension
const mediaRegex = new RegExp('^[A-Za-z0-9_\-]+\.(jpg|jpeg|png|gif)$');
const mediaTypeRegex = new RegExp('image\/(jpg|jpeg|png|gif)');
const pathRegex = new RegExp('^[A-Za-z0-9]+$');

router.use(bodyParser.raw({ limit: '50mb', type: (req) => 
    req.get('Content-Type') && req.get('Content-Type').match(mediaTypeRegex)
}));

router.get('/:postId/:filename', async (req, res) => {
    const { postId, filename } = req.params;
    const matchMedia = filename.match(mediaRegex);
    if(!postId.match(pathRegex) || !matchMedia) {
        console.error('Invalid post-id or media name');
        sendError.notFound(res, 'Invalid path or media name');
    } else if(!req.accepts(`image/${matchMedia[1]}`)) {
        sendError.notAcceptable(res);
    } else {
        const fullPath = `media/${postId}/${filename}`;
        try {
            const media = await fileStorage.get(fullPath);
            console.log(`media retrieved: ${fullPath}`);
            res.setHeader('Content-Type', `image/${matchMedia[1]}`);
            res.send(media);
        } catch(err) {
            console.error(err);
            sendError.badRequest(res);
        }
    }
});

const postPutCommon = overwrite => async (req, res) => {
    const { postId, filename } = req.params;
    const matchMedia = filename.match(mediaRegex);
    if(!postId.match(pathRegex) || !matchMedia) {
        console.error('Invalid post-id or media name');
        sendError.notFound(res, 'Invalid path or media name');
    } else {
        const contentTypeHeader = req.get('Content-Type');
        const fullPath = `media/${postId}/${filename}`;
        if(!contentTypeHeader || !contentTypeHeader.match(new RegExp(`image\/${matchMedia[1]}`))) {
            let msg = 'Missing content-type or mis-matched content-type and filename'
            console.error(msg);
            sendError.unSupportedMedia(res, msg);
        } else if(!req.body) {
            console.error('empty body');
            sendError.badRequest(res);
        } else if(overwrite || !(await fileStorage.exists(fullPath))) {
            try {
                await fileStorage.save(fullPath, req.body);
                console.log(`media uploaded: ${fullPath}`);
                res.status(204).end();
            } catch(err) {
                console.error(err);
                sendError.serverError(res);
            } 
        } else {
            let msg = 'Specified media resource already exists'
            console.error(msg);
            sendError.badRequest(res, msg);
        }
    }
}

router.post('/:postId/:filename', authService.require(roles.admin), postPutCommon(true));

router.put('/:postId/:filename', authService.require(roles.admin), postPutCommon(false));

router.delete('/:postId/:filename', authService.require(roles.admin), async (req, res) => {
    const { postId, filename } = req.params;
    const fullPath = `media/${postId}/${filename}`;
    if(await fileStorage.exists(fullPath)) {
        try {
            await fileStorage.delete(fullPath);
            console.log(`media deleted: ${fullPath}`);
            res.status(204).end();
        } catch(err) {
            console.error(err);
            sendError.serverError(res);
        }
    } else {
        console.error('can\'t delete media, not found');
        sendError.notFound(res);
    }
});

module.exports = router;