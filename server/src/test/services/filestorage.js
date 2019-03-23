
const files = {};

const getFile = (path) => { // TODO: test with raw image files
    return new Promise((resolve, reject) => {
        let file = files[path];
        if(file) { // return buffer to mock aws s3 return  type
            resolve(path.endsWith('.html') ? Buffer.from(file, 'utf-8') : file);
        } else {
            reject(`File ${path} does not exist`)
        }
    });
};

const saveFile = (path, data) => { // TODO: test with raw image files
    return new Promise((resolve, reject) => {
        if(!path.match(new RegExp('^[A-Za-z0-9].*'))) {
            reject('Invalid file path specified'); //only allow numbers and letters to start path
        }

        files[path] = data;
        resolve(true);
    });
};

module.exports = {
    get: getFile,
    save: saveFile
};