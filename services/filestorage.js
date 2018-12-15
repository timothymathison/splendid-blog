const envLoader = require('dotenv-json');
envLoader({ path: ".env.development.json"});

const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const bucketName = process.env.AWS_S3_BUCKET || 'splendidblog';

const getFile = (path) => {

};

const saveFile = (path, data) => {
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

module.exports = {
    get: getFile,
    save: saveFile
};
