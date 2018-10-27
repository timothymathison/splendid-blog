const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const authService = require('../services/auth');

router.use(bodyParser.json());

router.post('/login', authService.login, (req, res) => {
    //TODO: send back token
    res.send({ message: 'Logged in' });
});

module.exports = router;
