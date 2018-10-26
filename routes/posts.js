const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());

router.post('/create', (req, res) => {
    res.send(req.body);
});

module.exports = router;
