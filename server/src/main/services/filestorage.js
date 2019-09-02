const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const bucketName = process.env.AWS_S3_BUCKET || 'splendidblog';

const getFile = (path) => { // TODO: test with raw image files
    return new Promise((resolve, reject) => {
        let params = {
            Bucket: bucketName,
            Key: path
        };
        s3.getObject(params, (err, data) => {
            if(err) {
                reject(err);
            } else {
                resolve(data.Body); // must call .toString('utf-8') for text files
            }
        });
    });
};

const fileExists = (path) => {
    return new Promise((resolve, reject) => {
        let params = {
            Bucket: bucketName,
            Key: path
        };
        s3.headObject(params, err => {
            if(err) {
                if(err.code === 'NotFound') resolve(false);
                else reject(err);
            } else resolve(true);
        })
    });
}

const saveFile = (path, data) => { // TODO: test with raw image files
    return new Promise((resolve, reject) => {
        if(!path.match(new RegExp('^[A-Za-z0-9].*'))) {
            reject('Invalid file path specified'); //only allow numbers and letters to start path
        }
        let params = {
            ACL: "private",
            Body: data,
            Bucket: bucketName,
            Key: path
        };
        s3.putObject(params, err => {
            if(err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

const deleteFile = (path) => {
    return new Promise((resolve, reject) => {
        let params = {
            Bucket: bucketName,
            Key: path
        };
        s3.deleteObject(params, err => {
            if(err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

module.exports = {
    get: getFile,
    save: saveFile,
    delete: deleteFile,
    exists: fileExists
};
