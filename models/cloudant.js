var cloudant = require("@cloudant/cloudant");
const Cloudant = require('@cloudant/cloudant');
const logger = require('../config/logger').logger;

/**
 * Connects to the Cloudant DB
 * @return {Promise} - when resolved, contains the db, ready to go
 */

function dbCloudantConnect() {
    return new Promise((resolve, reject) => {
        Cloudant({  // eslint-disable-line
            url: process.env.CLOUDANT_URL,
        }, ((err, cloudant) => {
            if (err) {
                logger.error('Connect failure: ' + err.message + ' for Cloudant DB: order');
                reject(err);
            } else {
                let db = cloudant.use('order');
                let orderScrudUsers = cloudant.use('order-scrud-users');
                logger.info('Connect success! Connected to DB: order');
                resolve({ db: db , orderScrudUsers:orderScrudUsers});
            }
        }));
    });
}

module.exports = cloudant;
module.exports.dbCloudantConnect = dbCloudantConnect;
