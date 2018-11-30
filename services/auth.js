const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const errorUtil = require('../utils/errors');
const db = require('./database');

//constants
const realm = 'april.blog';
const secret = process.env.SERVER_SECRET;
const expire = 60 * 60; // by default tokens expire in 1 hour

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
const login = (req, res) => {
    let u = db.user.get(req.body.id); //TODO: check that user exists
    let hashedPass = u.password;
    bcrypt.compare(req.body.password, hashedPass, (err, match) => {
        if(match) {
            let token = generateToken(u, secret);
            console.log(`User ${u.id} logged in`);
            res.send({
                message: 'Logged in',
                access_token: token,
                token_type: 'Bearer',
                expires_in: expire
            });
        } else {
            console.error(err);
            errorUtil.badRequest(res);
        }
    });
};

// checks incoming request for proper authorization
const requireLogin = (role) => (req, res, next) => {
    let token = req.get('Authorization');
    if(!token) { //request has no authorization whatsoever, assume taking the current route was a mistake
        errorUtil.notFound(res);
    } else if(!token.startsWith('Bearer ')) {
        sendInvalid(res);
    } else {
        //check token validity
        token = token.slice(7) //token after "Bearer "
        let auth = verifyToken(token, secret);
        if(!auth) {
            sendInvalid(res);
        } else if(auth.user.role != role) { //compare roles
            sendMissingScope(res);
        } else {
            //user has access!
            console.log('User was authorization');
            next();
        }
    }
};

module.exports = {
    require: requireLogin,
    login: login
};
