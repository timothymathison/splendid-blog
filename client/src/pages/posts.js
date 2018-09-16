import React from 'react';
import {Route, Switch} from 'react-router-dom';

// import api from '../utils/api';

import ListPosts from './listposts';
import EditPost from './editpost';

const Posts = (props) => (
    <Switch>
        <Route path={`${props.match.path}/create`} component={EditPost}/>
        <Route path={`${props.match.path}/`} component={ListPosts}/>
    </Switch>
)

export default Posts
