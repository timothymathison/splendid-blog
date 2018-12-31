const express = require('express');
const router = express.Router();

const errorUtil = require('../utils/errors');
const postRouter = require('./posts');
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

router.use('/posts', postRouter); //send post related requests to posts route

router.use('/categories', categoryRouter); //send category related requests to categories route

router.use('/auth', authRouter); //send auth related requests to auth route

router.get('*', (req, res) => {
    errorUtil.notFound(res); //send 404 for get routes that don't exist
});

router.post('*', (req, res) => {
    errorUtil.notFound(res); //send 404 for post routes that don't exist
});


module.exports = router;
