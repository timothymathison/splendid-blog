const newman = require('newman');
const envLoader = require('dotenv-json');
envLoader({ path: ".env.development.json"}); // load development environment

console.log('Test API Routes, running Postman collection...');

// setup test environment
process.env['NODE_ENV'] = 'test';
process.env['DATABASE'] = 'test/services/database'; // use mock database
console.log(`Setting database to ${process.env.DATABASE}`);

const server = require('../server');
const port = process.env.PORT || 4000;
const listener = server.listen(port, () => console.log(`Listening on port ${port}`)); // start server locally

const address = `http://localhost:${port}`;

newman.run({
    environment: {'host': address}, // TODO change 'host' to 'address'
    collection: require('./postman.json'),
    reporters: 'cli'
}, (err) => {
	if (err) { throw err; }
    console.log('Postman collection run complete!');
});

// stop server
listener.close();
