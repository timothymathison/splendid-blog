const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const errorUtil = require('../utils/errors');
const useDB = process.env.DATABASE || 'services/database'
const db = require(`../${useDB}`);

//constants
const realm = 'april.blog';
const secret = process.env.SERVER_SECRET;
const expire = parseInt(process.env.TOKEN_EXPIRE_TIME || 60 * 60); // by default tokens expire in 1 hour
const saltNum = 13; // number of rounds used to generage salt for hashing passwords

//generate a password hash which can be safely stored
const hashPassword = (pass) => {
    let salt = bcrypt.genSaltSync(saltNum);
    return bcrypt.hashSync(pass, salt);
};

//generate a new token with user info as the payload
const generateToken = (user, secret) => {
    return jwt.sign({ user: user }, secret, {expiresIn: expire});
};

//verify token is valid and return the payload
const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret, {maxAge: "10h"}) //tokens more than 10 hours old are never valid
    } catch(e) {
        console.error(e);
        return null;
    }
};

const sendInvalid = (res) => {
    res.setHeader('WWW-Authenticate', `Bearer realm=${realm}, error="invalid_token"`); //TODO: include error_description
    res.status(401).send({ message: 'Invalid Authorization token' });
};

const sendMissingScope = (res) => {
    res.setHeader('WWW-Authenticate', `Bearer realm=${realm}, error="insufficient_scope"`); //TODO: include error_description
    res.status(403).send({ message: 'User identified by authorization token has incorrect role' });
}

//TODO: consider using somthing like passport.js
const login = async (req, res) => {
    try {
        let u = await db.user.get(req.body.id); // retrieve user from database
        let hashedPass = u.HashedPassword;
        bcrypt.compare(req.body.password, hashedPass, (err, match) => {
            if(match === true) {
                let user = {
                    ID: u.ID,
                    Role: u.Role,
                    Email: u.Email,
                    FirstName: u.FirstName,
                    LastName: u.LastName
                }; // user info excluding hashed password
                let token = generateToken(user, secret);
                console.log(`User ${u.ID} logged in`);
                res.send({
                    message: 'Logged in',
                    access_token: token,
                    token_type: 'Bearer',
                    expires_in: expire
                });
            } else {
                console.error('Password does not match user');
                errorUtil.badRequest(res);
            }
        });
    } catch(err) { // error retrieving the user
        console.error(err);
        errorUtil.badRequest(res);
    }
};

// checks incoming request for proper authorization
const requireLogin = (role) => (req, res, next) => {
    let token = req.get('Authorization');
    if(!token) { //request has no authorization whatsoever, assume taking the current route was a mistake
        console.error('Authorization missing');
        errorUtil.notFound(res);
    } else if(!token.startsWith('Bearer ')) {
        console.error('Invalid authorization type');
        sendInvalid(res);
    } else {
        //check token validity
        token = token.slice(7) //token after "Bearer "
        let auth = verifyToken(token, secret);
        if(!auth) {
            sendInvalid(res);
        } else if(auth.user.Role != role) { //compare roles
            sendMissingScope(res);
        } else {
            //user has access!
            console.log(`User ${auth.user.ID} was authorization`);
            req.user = auth.user; // place user in request body
            next();
        }
    }
};

module.exports = {
    require: requireLogin,
    login: login,
    hash: hashPassword
};
