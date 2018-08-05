const path = require('path');
const express = require('express');
const server = express();

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    server.use(express.static(path.join(__dirname, 'client/build')));

    // Handle React routing, return all requests to React app
    server.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

// create a GET route
server.get('/api', (req, res) => {
    res.send({ msg: "Hello from express app", envValues: process.env });
});

//export so lambda handler can use
module.exports = server;
