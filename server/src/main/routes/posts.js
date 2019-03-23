const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const authController = require('../controllers/auth');
const roles = require('../models/DynamoDBUser').prototype.getRoles();

router.post('/create', authController.require(roles.admin), (req, res) => {
    res.send(req.body);
});

module.exports = router;
