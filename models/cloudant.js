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
                //credentials
                "apikey": "vDA8DBVCP-r3aTu5e7rlizOIyO6zMgBdyFV7HitZlutq",
                "host": "90ea8a86-a890-4beb-8c1a-4b6e6ed167c9-bluemix.cloudantnosqldb.appdomain.cloud",
                "iam_apikey_description": "Auto-generated for key 1ae267af-8a43-4c26-b7b2-55981bd60b8b",
                "iam_apikey_name": "fashionspray-connection",
                "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",
                "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/4f76577546644bfcae24bd93313bb1ab::serviceid:ServiceId-e9d1c2a8-0ec9-4bb5-88c6-2709c2372106",
                "password": "4e31bf1c16ee4d536cdfc16f7ce66e7dbc5afa714ab9f593d30595678ed19db9",
                "port": 443,
                "url": "https://90ea8a86-a890-4beb-8c1a-4b6e6ed167c9-bluemix:4e31bf1c16ee4d536cdfc16f7ce66e7dbc5afa714ab9f593d30595678ed19db9@90ea8a86-a890-4beb-8c1a-4b6e6ed167c9-bluemix.cloudantnosqldb.appdomain.cloud",
                "username": "90ea8a86-a890-4beb-8c1a-4b6e6ed167c9-bluemix"
              },
            "label": "cloudantNoSQLDB"
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
