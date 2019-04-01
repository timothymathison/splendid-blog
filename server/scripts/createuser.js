const envLoader = require('dotenv-json');
envLoader({ path: "server/config/.env.development.json"});

const db = require('../src/main/services/database');
const auth = require('../src/main/controllers/auth');

let args = process.argv;

let id = args[2];
let role = args[3];
let pass = args[4];

let user = {
    id: id,
    role: role,
    hashedPassword: auth.hash(pass)
};

db.user.saveNew(user)
    .then(res => console.log(`User created: ${JSON.stringify(res)}`))
    .catch(err => console.error(`User is invalid: ${err} \nUser: ${JSON.stringify(user)}`));
