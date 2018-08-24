const express = require('express');
const router = express.Router()

router.get('/ping', (req, res) => {
    res.send({ message: "Hello from express app", body: process.env });
});

module.exports = router;
