const envLoader = require('dotenv-json');

// load development environment variables
if (process.env.NODE_ENV !== 'production') {
    envLoader({
        path: "server/config/.env.development.json"
    });
} else {
    envLoader({
        path: "server/config/.env.production.json"
    });
}
// can't be included in files above for deployment reason
process.env['AWS_REGION'] = 'us-east-2';
process.env['AWS_PROFILE'] = 'splendid-blog';

const server = require('./server.js');
const port = process.env.PORT || 4000;

server.listen(port, () => console.log(`Listening on port ${port}`));