import React, {Component} from 'react';

import api from '../utils/api'

class Posts extends Component {
    constructor(props) {
        super(props);

        api.load("ping", (result) => console.log({ data: result.msg, info: result.envValues }));
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
