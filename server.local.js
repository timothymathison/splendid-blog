const envLoader = require('dotenv-json');

const server = require('./server.js');
const port = process.env.PORT || 4000;

// load development environment variables
if (process.env.NODE_ENV !== 'production') {
    envLoader({ path: ".env.development.json"});
} else {
    envLoader({ path: ".env.production.local.json"})
}

server.listen(port, () => console.log(`Listening on port ${port}`));
