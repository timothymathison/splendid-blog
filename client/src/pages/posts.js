import React, {Component} from 'react';

import Header from '../components/header.js'

const basePath = process.env.PUBLIC_URL;

class Posts extends Component {
    constructor(props) {
        super(props);

        this.callBackendAPI()
            .then(res => console.log({ data: res.msg, info: res.envValues }))
            .catch(err => console.error(err));
    }

    callBackendAPI = async () => {
        const response = await fetch(`${basePath}/api`);
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };

    render() {
        return(
            <div className={"body"}>
                <Header />
                <h1>Posts page</h1>
            </div>
        );
    }
}

export default Posts
