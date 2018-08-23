import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';

import api from '../utils/api';

import ListPosts from './listposts';
import CreatePost from './createpost'

class Posts extends Component {
    constructor(props) {
        super(props);

        api.load("ping", (result) => console.log({ data: result.msg, info: result.envValues }));
    }

    render() {
        return(
            <div className={"body"}>
                <Route path="/create" component={CreatePost}/>
                <Route path="/" component={ListPosts}/>
            </div>
        );
    }
}

export default Posts
