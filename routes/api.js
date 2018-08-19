const express = require('express');
const router = express.Router()

router.get('/ping', (req, res) => {
    res.send({ msg: "Hello from express app", envValues: process.env });
});

module.exports = router;
