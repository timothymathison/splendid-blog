
const basePath = process.env.PUBLIC_URL;

const load = async (resource, send) => {
    let response = await fetch(`${basePath}/api/${resource}`);
    await response.json()
        .then(result => afterLoad(resource, response, result, send),
            () => {console.error("I was used (says load error function)")}) //send result back to application
        .catch(reason => console.error(`Failed to process response from ${resource}: ${reason}`));
}

const afterLoad = (resource, response, result, send) => {
    if (response.status !== 200) { //status other than OK
        console.error(`Bad status code: ${response.status} received when trying to load resource: ${resource}\n Reason: ${result.message}`);
    } else {
        send(result);
    }
}

export default {load: load};
