const express = require('express');
const router = express.Router();

const postRouter = require('./posts');
const categoryRouter = require('./categories');
const authRouter = require('./auth');

router.get('/ping', (req, res) => {
    res.send({ message: 'Hello from express api!',
        routes: ['/ping', '/posts/create', '/categories/list', '/auth/login'],
        body: process.env });
});

router.use('/posts', postRouter); //send post related requests to posts route

router.use('/categories', categoryRouter); //send category related requests to categories route

router.use('/auth', authRouter); //send auth related requests to auth route

router.get('*', (req, res) => {
    res.status(404).send({message: 'Perhaps you\'ve taken a wrong turn, route not found!'}); //send 404 for get routes that don't exist
});

router.post('*', (req, res) => {
    res.status(404).send({message: 'Perhaps you\'ve taken a wrong turn, route not found!'}); //send 404 for post routes that don't exist
});


module.exports = router;
