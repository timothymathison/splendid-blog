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

router.use(bodyParser.raw({ limit: '50mb', type: (req) => req.get('Content-Type').match(mediaTypeRegex)}));

router.get('/:postId/:filename', async (req, res) => {
    const { postId, filename } = req.params;
    const matchMedia = filename.match(mediaRegex);
    if(!postId.match(pathRegex) || !matchMedia) {
        console.error('invalid post-id or media name');
        sendError.notFound(res, 'invalid path or media name');
    } else if(!req.accepts(`image/${matchMedia[1]}`)) {
        sendError.notAcceptable(res);
    } else {
        try {
            const media = await fileStorage.get(`media/${postId}/${filename}`);
            res.setHeader('Content-Type', `image/${matchMedia[1]}`);
            res.send(media);
        } catch(err) {
            console.error(err);
            sendError.badRequest(res);
        }
    }
});

router.post('/:postId/:filename', authService.require(roles.admin),
    async (req, res) => {
        const { postId, filename } = req.params;
        const matchMedia = filename.match(mediaRegex) ;
        if(!postId.match(pathRegex) || !matchMedia) {
            console.error('invalid post-id or media name');
            sendError.notFound(res, 'invalid path or media name');
        } else {
            const contentType = req.get('Content-Type');
            if(!contentType || !req.body || !contentType.match(new RegExp(`image\/${matchMedia[1]}`))) {
                console.error('invalid content type'); //TODO return 415 Unsupported media type ?
                sendError.badRequest(res);
            } else {
                try {
                    await fileStorage.save(`media/${postId}/${filename}`, req.body); // TODO: test this
                } catch(err) {
                    console.error(err);
                    sendError.badRequest(res);
                } 
            }
        }
})

module.exports = router;