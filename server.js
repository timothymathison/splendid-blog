const path = require('path');
const express = require('express');
const server = express();

const api = require('./routes/api')

server.use('/api', api);

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    server.use(express.static(path.join(__dirname, 'client/build')));

    // Handle React routing, return all requests to React app
    server.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

//export so lambda handler can use
module.exports = server;
