const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const authService = require('../services/auth');
const roles = require('../models/DynamoDBUser').prototype.getRoles();

const controller = require('../controllers/media');

router.use(bodyParser.raw({ limit: '50mb', type: (req) => 
    req.get('Content-Type') && req.get('Content-Type').match(controller.mediaTypeRegex)
}));

// get image/media cooresponding to a particular post
router.get('/:postId/:filename', async (req, res) => {
    (await controller.get(req))(res);
});

// upload image, will overwrite, TOOD: support updating/copying to different path
router.post('/:postId/:filename', authService.require(roles.admin), async (req, res) => {
    (await controller.post(req))(res);
});

// upload image, overwrite prohibited
router.put('/:postId/:filename', authService.require(roles.admin), async (req, res) => {
    (await controller.put(req))(res);
});

// delete image
router.delete('/:postId/:filename', authService.require(roles.admin), async (req, res) => {
    (await controller.delete(req))(res);
});

module.exports = router;