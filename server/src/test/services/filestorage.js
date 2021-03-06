const testPostId = 'abcd1234'
const testThumnail = 'mountain.jpg';
const testImage = 'flower.jpg';

const files = {};

const getFile = path => { // TODO: test with raw image files
    return new Promise((resolve, reject) => {
        let file = files[path];
        if (file) { // return buffer to mock aws s3 return  type
            resolve(path.endsWith('.html') ? Buffer.from(file, 'utf-8') : file);
        } else {
            reject(`File ${path} does not exist`)
        }
    });
};

const fileExists = path => {
    return new Promise((resolve, _) => {
        resolve(files.hasOwnProperty(path));
    });
};

const saveFile = (path, data) => { // TODO: test with raw image files
    return new Promise((resolve, reject) => {
        if (!path.match(new RegExp('^[A-Za-z0-9].*'))) {
            reject('Invalid file path specified'); //only allow numbers and letters to start path
        }

        files[path] = data;
        resolve(true);
    });
};

const deleteFile = path => {
    return new Promise((resolve, _) => {
        files[path] = null;
        resolve(true);
    });
}

// add default media files for testing
saveFile(`media/${testPostId}/mountain.jpg`, 'code');
saveFile(`media/${testPostId}/flower.jpg`, 'code');

module.exports = {
    get: getFile,
    save: saveFile,
    delete: deleteFile,
    exists: fileExists,
    testValues: {
        postId: testPostId,
        thumnail: testThumnail,
        image: testImage
    }
};