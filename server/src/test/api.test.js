const newman = require('newman');
const envLoader = require('dotenv-json');
envLoader({ path: "server/config/.env.development.json"}); // load development environment

console.log('Test API Routes, running Postman collection...');

// setup test environment
process.env['NODE_ENV'] = 'test';
process.env['IN_MEMORY_DB'] = true;
console.log('Using in memory database');

const server = require('../main/server');
const port = process.env.PORT || 4000;

const authUtil = require('./scripts/auth-utils'); // use authUtil to generate mock user
const mockUser = authUtil.createMockUser(); // see auth-utils.js for mock user details

// start server locally
const listener = server.listen(port, () => {
    console.log(`Listening on port ${port}`)

    //save mock user before running postman requests
    authUtil.saveUser(mockUser).then( () => {
    
        let postmanEnv = [ // define postman request parameters
            {
                "key": "address",
                "value": `http://localhost:${port}`,
                "description": "",
                "enabled": true
            },
            {
                "key": "user_id",
                "value": mockUser.id,
                "type": "text",
                "description": "",
                "enabled": true
            },
            {
                "key": "user_pass",
                "value": mockUser.plainPassword,
                "type": "text",
                "description": "",
                "enabled": true
            }
        ];
    
        // run postman requests
        newman.run({
            environment: postmanEnv,
            collection: require('./postman.json'),
            reporters: 'cli'
        }, (err) => {
            if (err) { throw err; }
            console.log('Postman collection run complete!');

            // stop server
            listener.close();
        });
    });
});
