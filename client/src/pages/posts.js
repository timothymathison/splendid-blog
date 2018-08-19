import React, {Component} from 'react';

import api from '../utils/api'

class Posts extends Component {
    constructor(props) {
        super(props);

        api.load("ping") //for api testing
            .then(result => console.log({ data: result.msg, info: result.envValues }))
            .catch(err => console.error(err));
    }

    render() {
        return(
            <div className={"body"}>
                <h1>Posts page</h1>
            </div>
        );
    }
}

export default Posts
