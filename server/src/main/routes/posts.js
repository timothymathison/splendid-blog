const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const authController = require('../controllers/auth');
const roles = require('../models/DynamoDBUser').prototype.getRoles();

const controller = require('../controllers/posts');

router.use(bodyParser.json());

router.get('/init', authController.require(roles.admin), async (_, res) => {
    (await controller.initPost())(res);
});

router.post('/create', authController.require(roles.admin), async (req, res) => {
    (await controller.createPost(req))(res);
});

router.get('/:postId', authController.require(roles.admin), async (req, res) => {
    (await controller.getPost(req))(res);
});

module.exports = router;
