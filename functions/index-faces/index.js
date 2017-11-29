const Promise = require('bluebird');
const AWS = require('aws-sdk');

const rekognition = new AWS.Rekognition();

const indexFaces = records => Promise.map(records, record => new Promise((resolve, reject) => {
  // TODO: Determine if this will work if `records.length > 1`
  const params = {
    CollectionId: 'faces',
    DetectionAttributes: [
    ],
    ExternalImageId: record.s3.object.key.split('.')[0],
    Image: {
      S3Object: {
        Bucket: record.s3.bucket.name,
        Name: record.s3.object.key,
      },
    },
  };
  rekognition.indexFaces(params, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
}));

exports.handle = (event, context, callback) => {
  console.log('EVENT:', JSON.stringify(event));

  indexFaces(event.Records)
    .then((res) => {
      console.log('Result:', res);
      callback(null, res);
    })
    .catch((err) => {
      console.log('Error:', err);
      callback(null, err);
    });
};
