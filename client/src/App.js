import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'

import './styles/App.css';

import Home from './pages/home';
import About from './pages/about';
import Posts from './pages/posts'
import Header from './components/header'

const basePath = process.env.PUBLIC_URL;

const App = () => (
    <Router basename={basePath}>
        <div className="page">
            <Header />
            <Switch>
                <Route path='/home' component={Home} />
                <Route path='/about' component={About} />
                <Route exact path='/' render={() => (
                    <Redirect to="/home"/>
                )}/>
                <Route path='/posts' component={Posts}/>
            </Switch>
        </div>
    </Router>
);

export default App;
