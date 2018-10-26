const express = require('express');
const router = express.Router();

const defaults = [
    { id: 'wedding', label: 'Wedding' },
    { id: 'cooking', label: 'Cooking' },
    { id: 'decorating', label: 'Decorating' } //change theses
];

router.get('/list', (req, res) => {
    res.send(defaults); //send hardcoded defaults
});

module.exports = router;
