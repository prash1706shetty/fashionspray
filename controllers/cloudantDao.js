var cloudant = require('../models/cloudant');
let db;
let orderScrudUsers;

// Initialize the DB when this module is loaded
(function getDbConnection() {
    console.log('Initializing Cloudant connection...');
    cloudant.dbCloudantConnect().then((database) => {
        console.log('Cloudant connection initialized.');
        db = database.db;
        orderScrudUsers = database.orderScrudUsers;
    }).catch((err) => {
        console.log('Error while initializing DB: ' + err.message);
        throw err;
    });
})();

function deleteOrder(doc) {
    return new Promise((resolve, reject) => {
        findById(doc.docId).then((response) => {
            let list = JSON.parse(response.data);
            list.orderStatus = doc.status;
            db.insert(list, (err, response) => {
                if (err) {
                    console.log('Error occurred: ' + err.message);
                    reject(err);
                } else {
                    resolve({ data: { updatedId: response.id, updatedRevId: response.rev }, statusCode: 200 });
                }
            });
        }).catch((err) => {
            console.log('Error occurred: ' + err.message);
            reject(err);
        });
    });
}

function deleteFabrics(doc) {
    return new Promise((resolve, reject) => {
        findById(doc.docId).then((response) => {
            let list = JSON.parse(response.data);
            delete list.fabrics;
            db.insert(list, (err, response) => {
                if (err) {
                    console.log('Error occurred: ' + err.message);
                    reject(err);
                } else {
                    resolve({ data: { updatedId: response.id, updatedRevId: response.rev }, statusCode: 200 });
                }
            });
        }).catch((err) => {
            console.log('Error occurred: ' + err.message);
            reject(err);
        });
    });
}


function addFabrics(doc) {
    return new Promise((resolve, reject) => {
        findById(doc.docId).then((response) => {
            let list = JSON.parse(response.data);
            list.fabrics = doc.fabrics;
            db.insert(list, (err, response) => {
                if (err) {
                    console.log('Error occurred: ' + err.message);
                    reject(err);
                } else {
                    resolve({ data: { updatedId: response.id, updatedRevId: response.rev }, statusCode: 200 });
                }
            });
        }).catch((err) => {
            console.log('Error occurred: ' + err.message);
            reject(err);
        });
    });
}

function updateOrder(doc) {
    return new Promise((resolve, reject) => {
        // Retrieve the list (need the rev)
        findById(doc.orderNumber).then((response) => {
            // Parse the stringified JSON
            let list = JSON.parse(response.data);

            list.orderStatus = doc.status;
            doc['_id'] = doc.orderNumber;
            doc['_rev'] = list._rev;
            // Update the document in Cloudant
            db.insert(doc, (err, response) => {
                if (err) {
                    console.log('Error occurred: ' + err.message);
                    reject(err);
                } else {
                    resolve({ data: { updatedId: response.id, updatedRevId: response.rev }, statusCode: 200 });
                }
            });
        }).catch((err) => {
            console.log('Error occurred: ' + err.message);
            reject(err);
        });
    });
}

function findById(id) {
    return new Promise((resolve, reject) => {
        db.get(id, (err, document) => {
            if (err) {
                if (err.message == 'missing') {
                    console.log(`Document id ${id} does not exist.`);
                    resolve({ data: JSON.stringify(err.message), statusCode: 404 });
                } else if (err.message == 'deleted') {
                    console.log(`Document id ${id} does not exist.`);
                    resolve({ data: JSON.stringify(err.message), statusCode: 404 });
                } else {
                    console.log('Error occurred: ' + err.message);
                    reject(err);
                }
            } else {
                resolve({ data: JSON.stringify(document), statusCode: 200 });
            }
        });
    });
}

function insertOrderData(data) {
    return new Promise((resolve, reject) => {
        db.insert(data, (err, response) => {
            if (err) {
                console.log('Error occurred: ' + err.message);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function getAllOrderData() {
    return new Promise((resolve, reject) => {
        db.view('order', 'allOrders', function(err, body) {
            if (err) {
                console.error('Error occurred: ' + err.message);
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

function getOrdersForFabrics() {
    return new Promise((resolve, reject) => {
        db.view('order', 'orderForFabrics', function(err, body) {
            if (err) {
                console.error('Error occurred: ' + err.message);
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

function getFabrics() {
    return new Promise((resolve, reject) => {
        db.view('order', 'getFabrics', function(err, body) {
            if (err) {
                console.error('Error occurred: ' + err.message);
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

function getNewOrders() {
    return new Promise((resolve, reject) => {
        db.view('order', 'newOrders', function(err, body) {
            if (err) {
                console.error('Error occurred: ' + err.message);
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

function getOnProcessOrders() {
    return new Promise((resolve, reject) => {
        db.view('order', 'onProcess', function(err, body) {
            if (err) {
                console.error('Error occurred: ' + err.message);
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

function getReadyOrders() {
    return new Promise((resolve, reject) => {
        db.view('order', 'ready', function(err, body) {
            if (err) {
                console.error('Error occurred: ' + err.message);
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

function getDeliveredOrders() {
    return new Promise((resolve, reject) => {
        db.view('order', 'deliveredOrders', function(err, body) {
            if (err) {
                console.error('Error occurred: ' + err.message);
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

function getOrderCount() {
    return new Promise((resolve, reject) => {
        db.view('order', 'numberOfOrder', function(err, body) {
            if (err) {
                console.error('Error occurred: ' + err.message);
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

function getDifferentOrderCounts() {
    return new Promise((resolve, reject) => {
        db.view('order', 'differentOrderCounts', function(err, body) {
            if (err) {
                console.error('Error occurred: ' + err.message);
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

function getOrderByMonth() {
    return new Promise((resolve, reject) => {
        db.view('order', 'orderByMonth', function(err, body) {
            if (err) {
                console.error('Error occurred: ' + err.message);
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

function getOrderByWomen() {
    return new Promise((resolve, reject) => {
        db.view('order', 'dressByWomen', function(err, body) {
            if (err) {
                console.error('Error occurred: ' + err.message);
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

function getYTTOrders(doc) {
    return new Promise((resolve, reject) => {
        db.find({
            'selector': {
                "$or": [{
                        'deliveryDate.date': {
                            "$in": [doc.todayDate, doc.yesterdayDate, doc.tomorrowDate]
                        },
                        'deliveryDate.month': {
                            "$in": [doc.todaymonth, doc.yesterdayMonth, doc.tomorrowMonth]
                        },
                        'deliveryDate.year': {
                            "$in": [doc.todayyear, doc.yesterdayYear, doc.tomorrowYear]
                        }
                    },
                    {
                        'orderDate.date': {
                            "$in": [doc.todayDate, doc.yesterdayDate]
                        },
                        'orderDate.month': {
                            "$in": [doc.todaymonth, doc.yesterdayMonth]
                        },
                        'orderDate.year': {
                            "$in": [doc.todayyear, doc.yesterdayYear]
                        }
                    }
                ]
            },
            'fields': [
                'orderNumber',
                'orderDate',
                'deliveryDate',
                'orderStatus'
            ]
        }, (err, documents) => {
            if (err) {
                reject(err);
            } else {
                resolve({ data: documents.docs });
            }
        });
    });
}

function getOrderById(doc) {
    return new Promise((resolve, reject) => {
        db.get(doc.docId, (err, document) => {
            if (err) {
                if (err.message == 'missing') {
                    console.log(`Document id ${id} does not exist.`);
                    resolve({ data: JSON.stringify(err.message), statusCode: 404 });
                } else if (err.message == 'deleted') {
                    console.log(`Document id ${id} does not exist.`);
                    resolve({ data: JSON.stringify(err.message), statusCode: 404 });
                } else {
                    console.log('Error occurred: ' + err.message);
                    reject(err);
                }
            } else {
                resolve({ data: document, statusCode: 200 });
            }
        });
    });
}

function validateUser(email) {
    return new Promise((resolve, reject) => {
        orderScrudUsers.get(email, (err, document) => {
            if (err) {
                if (err.message == 'missing') {
                    console.log(`Document id ${email} does not exist.`);
                    resolve({ data: err.message, statusCode: 404 });
                } else if (err.message == 'deleted') {
                    console.log(`Document id ${id} does not exist.`);
                    resolve({ data: JSON.stringify(err.message), statusCode: 404 });
                } else {
                    console.log('Error occurred: ' + err.message);
                    reject(err);
                }
            } else {
                resolve({ data: document, statusCode: 200 });
            }
        });
    });
}

module.exports.findById = findById;
module.exports.deleteOrder = deleteOrder;
module.exports.updateOrder = updateOrder;
module.exports.insertOrderData = insertOrderData;
module.exports.getAllOrderData = getAllOrderData;
module.exports.getOrderCount = getOrderCount;
module.exports.getOrderById = getOrderById;
module.exports.getNewOrders = getNewOrders;
module.exports.getDeliveredOrders = getDeliveredOrders;
module.exports.getDifferentOrderCounts = getDifferentOrderCounts;
module.exports.getOnProcessOrders = getOnProcessOrders;
module.exports.getReadyOrders = getReadyOrders;
module.exports.getYTTOrders = getYTTOrders;
module.exports.getOrderByMonth = getOrderByMonth;
module.exports.getOrdersForFabrics = getOrdersForFabrics;
module.exports.addFabrics = addFabrics;
module.exports.getFabrics = getFabrics;
module.exports.deleteFabrics = deleteFabrics;
module.exports.validateUser = validateUser;
module.exports.getOrderByWomen = getOrderByWomen;