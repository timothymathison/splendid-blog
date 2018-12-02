
const envLoader = require('dotenv-json');
envLoader({ path: ".env.development.json"});

const mockDatabase = 'test/services/database';
process.env['DATABASE'] = mockDatabase; // use mock database
const testPass = Math.random().toString(36).substring(2); // generate random test password
process.env['TEST_PASSWORD'] = testPass;
console.log(`Setting database to ${process.env.DATABASE}`);
const db = require(`../../${mockDatabase}`);

const auth = require('../../services/auth');

const user = {
    id: 'mock_tim',
    role: db.user.roleOptions.admin,
    firstName: 'Timothy',
    lastName: 'Mock',
    email: 'timothy@mock.co',
    hashedPassword: auth.hash(testPass)
};
db.user.create(user);

let body = {
    id: 'mock_tim',
    password: process.env.TEST_PASSWORD
}

auth.login({ body: body }, { send: obj => {
    console.log(obj);
}});
