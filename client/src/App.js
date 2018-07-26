import React, { Component } from 'react';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router'

import './styles/App.css';

import home from './pages/home'
import about from './pages/about'

const app = () => (
    <Router history={browserHistory}>
        <Route path='/' component={home} />
        <Route path='/about' component={about} />
    </Router>
);

export default app;
