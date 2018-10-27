const jwt = require('jsonwebtoken');

const db = require('./database');

const secret = process.env.SERVER_SECRET; //TODO pass this in
const expire = 60 * 60; // by default tokens expire in 1 hour

//generate a new token with user info as the payload
const generateToken = (user, secret) => {
    return jwt.sign(user, secret, {expiresIn: expire});
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

//TODO: consider using somthing like passport.js
//TODO: create password login method
const login = (req, res, next) => {
    let u = db.user.get(req.body.username);
    //TODO: check hash of password
    let token = generateToken(u, secret);
    console.log(`User ${u.id} logged in`);
    res.send({
        message: 'Logged in',
        access_token: token,
        token_type: 'Bearer',
        expires_in: expire
    });
};

// checks incoming request for proper authorization
const requireLogin = (role) => (req, res, next) => {
    let token = req.get('Authorization');
    if(!token) { //request has no authorization whatsoever, assume taking the current route was a mistake
        res.status(404).send({ message: 'Perhaps you\'ve taken a wrong turn, route not found!' });
    } else if(!token.startsWith('Bearer ')) {
        res.status(401).send({ message: 'Invalid Authorization token' });
    } else {
        //check token validity
        token = token.slice(7) //token after "Bearer "
        let user = verifyToken(token, secret);
        if(!user) {
            res.status(401).send({ message: 'Invalid Authorization token' });
        } else if(user.role != role) { //compare roles
            res.status(403).send({ message: 'Authorization token has insufficient scope' });
        }

        //user has access!
        console.log('User was authorization');
        next();
    }
};

module.exports = {
    require: requireLogin,
    login: login
};
