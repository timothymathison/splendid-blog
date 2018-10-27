const express = require('express');
const router = express.Router();

const defaults = [
    { id: 'life', label: 'Life' },
    { id: 'food', label: 'Food' },
    { id: 'inspiration', label: 'Inspiration' }
];

router.get('/list', (req, res) => {
    res.send(defaults); //send hardcoded defaults
});

module.exports = router;
