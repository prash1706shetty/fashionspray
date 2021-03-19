var cloudant = require("@cloudant/cloudant");
const Cloudant = require('@cloudant/cloudant');
const appSettings = require('../config/app-settings');
const logger = require('../config/logger').logger;

/**
 * Connects to the Cloudant DB
 * @return {Promise} - when resolved, contains the db, ready to go
 */

var data = {
    "services": {
        "cloudantNoSQLDB": {
            "credentials": {

        }
    }
}

function dbCloudantConnect() {
    return new Promise((resolve, reject) => {
        Cloudant({  // eslint-disable-line
            url: data.services.cloudantNoSQLDB.credentials.url
        }, ((err, cloudant) => {
            if (err) {
                logger.error('Connect failure: ' + err.message + ' for Cloudant DB: ' +
                    appSettings.cloudant_db_name);
                reject(err);
            } else {
               console.log("sucees else");
                let db = cloudant.use(appSettings.cloudant_db_name);

    
                let access_control_db = cloudant.use(appSettings.access_control_db_name);
                logger.info('Connect success! Connected to DB: ' + appSettings.cloudant_db_name);
                resolve({ db: db, access_control_db: access_control_db });
            }
        }));
    });
}

module.exports = cloudant;
module.exports.dbCloudantConnect = dbCloudantConnect;
