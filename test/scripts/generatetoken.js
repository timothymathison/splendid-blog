
const envLoader = require('dotenv-json');
envLoader({ path: ".env.development.json"});

const mockDatabase = 'test/services/database';
process.env['DATABASE'] = mockDatabase; // use mock database
const testPass = Math.random().toString(36).substring(2); // generate random test password

console.log(`Setting database to ${process.env.DATABASE}`);
const db = require(`../../${mockDatabase}`);

const auth = require('../../services/auth');

const user = {
    ID: 'mock_tim',
    Role: db.user.getRoles().admin,
    FirstName: 'Timothy',
    LastName: 'Mock',
    Email: 'timothy@mock.co',
    HashedPassword: auth.hash(testPass)
};
db.user.saveNew(user).then( () => {
    let body = {
        id: 'mock_tim',
        password: process.env.TEST_PASSWORD
    }
    
    auth.login({ body: body }, { send: obj => {
        console.log(obj);
    }});
});

