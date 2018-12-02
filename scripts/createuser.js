const envLoader = require('dotenv-json');
envLoader({ path: ".env.development.json"});

const db = require('../services/database');
const auth = require('../services/auth')

let args = process.argv;

let id = args[2];
let role = args[3];
let pass = args[4];

let user = {
    ID: id,
    Role: role,
    HashedPassword: auth.hash(pass)
};

db.user.create(user);
