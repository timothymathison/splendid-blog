
const basePath = process.env.PUBLIC_URL;

let load = async (resource, send) => {
    let responce = await fetch(`${basePath}/api/${resource}`);
    let result = await responce.json()
        .then(result => send(result), () => {}) //send result back to application
        .catch(reason => console.error(`Failed to load response from ${resource}: ${reason}`))

    if (responce.status !== 200) { //status other than OK
        console.error(result.message)
    }
}

export default {load: load};
