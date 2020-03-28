const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const controller = require('../controllers/auth');

router.use(bodyParser.json());

router.post('/login', async (req, res) => {
    (await controller.login(req))(res);
});

module.exports = router;
