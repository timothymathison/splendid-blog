const express = require('express');
const server = express();
const port = process.env.PORT || 4000;

// create a GET route
server.get('/api', (req, res) => {
    res.send({ msg: "Hello from express" });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
