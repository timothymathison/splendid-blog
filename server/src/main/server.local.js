const envLoader = require('dotenv-json');

// load development environment variables
if (process.env.NODE_ENV !== 'production') {
    envLoader({ path: "server/config/.env.development.json" });
} else {
    envLoader({ path: "server/config/.env.production.json" });
}
process.env['AWS_S3_BUCKET'] = 'us-east-2'; // can't be included in files above for deployment reasons

const server = require('./server.js');
const port = process.env.PORT || 4000;

server.listen(port, () => console.log(`Listening on port ${port}`));
