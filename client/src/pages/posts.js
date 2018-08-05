import React, {Component} from 'react';

class Posts extends Component {
    constructor(props) {
        super(props);

        this.callBackendAPI()
            .then(res => console.log({ data: res.msg, info: res.envValues }))
            .catch(err => console.error(err));
    }

    callBackendAPI = async () => {
        const response = await fetch('/api');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };

    render() {
        return(
            <h1>Posts page</h1>
        );
    }
}

export default Posts
