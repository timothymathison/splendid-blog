const express = require('express');
const router = express.Router();

const categories = require('../models/DynamoDBPost')
    .prototype.getCategories();

router.get('/list', (req, res) => {
    res.send(categories); //send hardcoded defaults
});

module.exports = router;
