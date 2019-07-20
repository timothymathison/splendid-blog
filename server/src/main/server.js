const path = require('path');
const express = require('express');
const server = express();

const api = require('./routes/api')

server.use('/api', api);

// Serve any static files
server.use(express.static(path.join(__dirname, 'client/build')));

// Handle React routing, return all requests to React app
server.get('*', function(_, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

//export so lambda handler can use
module.exports = server;
