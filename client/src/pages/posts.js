import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';

import api from '../utils/api';

import ListPosts from './listposts';
import CreatePost from './createpost'

class Posts extends Component {
    constructor(props) {
        super(props);

        api.load("ping", (result) => console.log({ msg: result.message, info: result.body }));
    }

    render() {
        return(
            
            <Switch>
                <Route path={`${this.props.match.path}/create`} component={CreatePost}/>
                <Route path={`${this.props.match.path}/`} component={ListPosts}/>
            </Switch>
        );
    }
}

export default Posts
