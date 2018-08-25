import React from 'react';
import {Route, Switch} from 'react-router-dom';

// import api from '../utils/api';

import ListPosts from './listposts';
import CreatePost from './createpost';

const Posts = (props) => (
    <Switch>
        <Route path={`${props.match.path}/create`} component={CreatePost}/>
        <Route path={`${props.match.path}/`} component={ListPosts}/>
    </Switch>
)

export default Posts
