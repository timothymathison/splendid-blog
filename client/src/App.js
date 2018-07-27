import React from 'react';
import { BrowserRouter as Router, Route, Redirect} from 'react-router-dom'

import './styles/App.css';

import Home from './pages/home';
import About from './pages/about';
import Posts from './pages/posts'

const App = () => (
    <Router>
        <div>
            <Route path='/home' component={Home} />
            <Route path='/about' component={About} />
            <Route exact path='/' render={() => (
                <Redirect to="/home"/>
            )}/>
            <Route path='/posts' component={Posts}/>
        </div>
    </Router>
);

export default App;
