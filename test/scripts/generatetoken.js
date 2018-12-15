
if(process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    const envLoader = require('dotenv-json');
    envLoader({ path: ".env.development.json"});

    process.env['DATABASE'] = 'test/services/database'; // use mock database
    console.log(`Setting database to ${process.env.DATABASE}`);
}

const mockDatabase = process.env['DATABASE'];
const db = require(`../../${mockDatabase}`);
const auth = require('../../services/auth');

const createMockUser = () => {
    let testPass = Math.random().toString(36).substring(2); // generate random test password
    process.env['TEST_PASSWORD'] = testPass;

    let user = {
        ID: 'mock_tim',
        Role: db.user.getRoles().admin,
        FirstName: 'Timothy',
        LastName: 'Mock',
        Email: 'timothy@mock.co',
        HashedPassword: auth.hash(testPass)
    };

    return user;
};

const saveUser = async (u) => {
    let user = (u) ? u : createMockUser();
    let res = await db.user.saveNew(user);
    return res;
};

const testLogin = () => {
    let body = {
        id: 'mock_tim',
        password: process.env.TEST_PASSWORD
    };

    return new Promise((resolve) => {
        auth.login({ body: body }, { send: resolve, status: (num) => ({send: resolve}) });
    });
};

if(process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    saveUser().then(() => {
        testLogin().then(res => {
            console.log(res);
        })
    });
}

module.exports = {
    createMockUser,
    saveUser,
    testLogin
};
