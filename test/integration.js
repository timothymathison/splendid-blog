const newman = require('newman');

process.env['NODE_ENV'] = 'test';
process.env['DATABASE'] = 'test/services/database'; // use mock database
console.log(`Setting database to ${process.env.DATABASE}`);
require('../server.local'); // start local server

const port = process.env.PORT || 4000;
const address = `http://localhost:${port}`;

newman.run({
    environment: {'host': address}, // TODO change 'host' to 'address'
    collection: require('./postman.json'),
    reporters: 'cli'
}, function (err) {
	if (err) { throw err; }
    console.log('Postman collection run complete!');
});

// TODO: stop server
