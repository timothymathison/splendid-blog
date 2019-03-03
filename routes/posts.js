const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const authService = require('../controllers/auth')

router.use(bodyParser.json());

router.post('/create', authService.require('admin'), (req, res) => {
    res.send(req.body);
});

module.exports = router;
