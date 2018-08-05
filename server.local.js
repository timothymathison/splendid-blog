const server = require('./server.js');

const port = process.env.PORT || 4000;

// load development environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

server.listen(port, () => console.log(`Listening on port ${port}`));
