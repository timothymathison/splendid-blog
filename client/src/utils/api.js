
const basePath = process.env.PUBLIC_URL;

let load = async (resource) => {
    let responce = await fetch(`${basePath}/api/${resource}`);
    let result = await responce.json()

    if (responce.status !== 200) {
        throw Error(result.message)
    }
    return result;
}

export default {load: load};
