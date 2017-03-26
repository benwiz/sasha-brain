'use strict';

// https://datasciencelab.wordpress.com/2013/12/12/clustering-with-k-means-in-python/
// https://keras.io/getting-started/sequential-model-guide/

// external libraries
const Promise = require('bluebird');
const Kmeans = require('node-kmeans');
const _ = require('lodash');

const start = () => {

    return new Promise((resolve, reject) => {

        trainKMeans()
            .then((res) => {

                console.log(JSON.stringify(res,null,2));
                resolve(res);
            })
            .catch(reject);
    });
};

const trainKMeans = () => {

    return new Promise((resolve, reject) => {

        const data = [
            {'company': 'Microsoft' , 'size': 1, 'revenue': 1},
            {'company': 'IBM' , 'size': 1, 'revenue': 1},
            {'company': 'Skype' , 'size': 1, 'revenue': 1},
            {'company': 'SAP' , 'size': 9, 'revenue': 9},
            {'company': 'Yahoo!' , 'size': 9 , 'revenue': 9 },
            {'company': 'eBay' , 'size': 9, 'revenue': 9},
        ];

        // Create the data 2D-array (vectors) describing the data
        const vectors = _.map(data, (datum) => {

            return [ datum.size, datum.revenue ];
        });


        // run k-means clustering
        Kmeans.clusterize(vectors, {k: 4}, (err, res) => {

            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

module.exports = { start };
