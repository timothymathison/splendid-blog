
if(process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    const envLoader = require('dotenv-json');
    envLoader({ path: "server/config/.env.development.json"});

    process.env['DATABASE'] = 'test/services/database'; // use mock database
    console.log(`Setting database to ${process.env.DATABASE}`);
}

const dbService = process.env['DATABASE'];
const db = require(`../../${dbService}`);
const auth = require('../../main/controllers/auth');

const testPass = Math.random().toString(36).substring(2); // generate random test password

const createMockUser = () => {

    let user = {
        id: 'mock_tim',
        role: db.user.getRoles().admin,
        firstName: 'Timothy',
        lastName: 'Mock',
        email: 'timothy@mock.co',
        hashedPassword: auth.hash(testPass),
        plainPassword: testPass // included only for testing
    };

    return user;
};

const saveUser = async (u) => {
    let user = (u) ? u : createMockUser();
    let res = await db.user.saveNew(user);
    return res;
};

const login = (b) => {
    let body = b ? b : {
        id: 'mock_tim',
        password: testPass
    };

    let resObj = resolve => ({
        send: resolve, status: (num) => ({send: resolve})
    });

    return new Promise(async (resolve) => {
        (await auth.login({ body: body }))(resObj(resolve));
    });
};

if(process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    saveUser().then(() => {
        login().then(res => {
            console.log(res);
        })
    });
}

module.exports = {
    createMockUser,
    saveUser,
    login
};
