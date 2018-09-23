import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'

import './styles/App.css';

import Home from './pages/home';
import About from './pages/about';
import Posts from './pages/posts';
import NotFound from './pages/notfound'
import Header from './components/header';

import './styles/icon.css'
import {IconData} from './components/icons';

const basePath = process.env.PUBLIC_URL;

const App = () => (
    <Router basename={basePath}>
        <div className="page">
            <Header />
            <Switch>
                <Route exact path='/' render={() => (
                    <Redirect to="/home"/>
                )}/>
                <Route path='/home' component={Home} />
                <Route path='/about' component={About} />
                <Route path='/posts' component={Posts} />
                <Route component={NotFound} />
            </Switch>
            <IconData />
        </div>
    </Router>
);

export default App;
