const express = require('express');
const router = express.Router();

const errorUtil = require('../utils/errors');
const postRouter = require('./posts');
const mediaRouter = require('./media');
const categoryRouter = require('./categories');
const authRouter = require('./auth');

router.all('^\/((ping)?|(ping\/)?)$', (req, res) => { // list all get routes
    res.send({ 
        message: 'Hello from express api!',
        routes: [
            {path: '/ping'},
            {path: '/categories/list', method: 'GET'},
            {path: '/auth/login', method: 'POST'},
            {path: '/posts/create', method: "POST"}
        ]
    });
});

router.use('*', (req, res, next) => {
    console.log(`Request: ${req.method} -> ${req.baseUrl}`);
    next();
});

router.use('/posts', postRouter); //send post related requests to posts route

router.use('/media', mediaRouter);

router.use('/categories', categoryRouter); //send category related requests to categories route

router.use('/auth', authRouter); //send auth related requests to auth route

router.get('*', (_, res) => {
    errorUtil.notFound(res); //send 404 for get routes that don't exist
});

router.post('*', (_, res) => {
    errorUtil.notFound(res); //send 404 for post routes that don't exist
});

router.put('*', (_, res) => {
    errorUtil.notFound(res); //send 404 for put routes that don't exist
});

module.exports = router;
