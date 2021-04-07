var cloudant = require('../models/cloudant');
const logger = require('../config/logger').logger;
let db;
let access_control_db;

// Initialize the DB when this module is loaded
(function getDbConnection() {
	logger.info('Initializing Cloudant connection...', 'lists-dao-cloudant.getDbConnection()');
	cloudant.dbCloudantConnect().then((database) => {
		logger.info('Cloudant connection initialized.', 'lists-dao-cloudant.getDbConnection()');
		db = database.db;
		access_control_db = database.access_control_db;
	}).catch((err) => {
		logger.error('Error while initializing DB: ' + err.message, 'lists-dao-cloudant.getDbConnection()');
		throw err;
	});
})();

function deleteOrder(doc) {
	return new Promise((resolve, reject) => {
		// Retrieve the list (need the rev)
		findById(doc.docId).then((response) => {
			// Parse the stringified JSON
			let list = JSON.parse(response.data);
			list.orderStatus = doc.status;
			// Update the document in Cloudant
			db.insert(list, (err, response) => {
				if (err) {
					logger.error('Error occurred: ' + err.message, 'update()');
					reject(err);
				} else {
					resolve({ data: { updatedId: response.id, updatedRevId: response.rev }, statusCode: 200 });
				}
			});
		}).catch((err) => {
			logger.error('Error occurred: ' + err.message, 'update()');
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
					logger.error('Error occurred: ' + err.message, 'update()');
					reject(err);
				} else {
					resolve({ data: { updatedId: response.id, updatedRevId: response.rev }, statusCode: 200 });
				}
			});
		}).catch((err) => {
			logger.error('Error occurred: ' + err.message, 'update()');
			reject(err);
		});
	});
}



function findById(id) {

	return new Promise((resolve, reject) => {
		db.get(id, { attachments: true }, (err, document) => {
			if (err) {
				if (err.message == 'missing') {
					logger.warn(`Document id ${id} does not exist.`, 'findById()');
					resolve({ data: JSON.stringify(err.message), statusCode: 404 });
				} else if (err.message == 'deleted') {
					logger.warn(`Document id ${id} does not exist.`, 'findById()');
					resolve({ data: JSON.stringify(err.message), statusCode: 404 });
				} else {
					logger.error('Error occurred: ' + err.message, 'findById()');
					reject(err);
				}
			} else {
				resolve({ data: JSON.stringify(document), statusCode: 200 });
			}
		});
	});
}

function deleteById(id, rev) {

	return new Promise((resolve, reject) => {

		db.destroy(id, rev, (err, document) => {
			if (err) {
				if (err.message == 'missing') {
					logger.warn(`Document id ${id} does not exist.`, 'deleteById()');
					resolve({ data: JSON.stringify(err.message), statusCode: 404 });
				} else {
					logger.error('Error occurred: ' + err.message, 'deleteByid()');
					reject(err);
				}
			} else {
				resolve({ data: JSON.stringify(document), statusCode: 200 });
			}
		});

	}).catch((err) => {
		logger.error('Error occurred: ' + err.message, 'update()');
		reject(err);
	});

}

function insertOrderData(data) {
	return new Promise((resolve, reject) => {
		db.insert(data, (err, response) => {
			if (err) {
				logger.error('Error occurred: ' + err.message, 'update()');
				reject(err);
			} else {
				resolve();
			}
		});

	});
}

function getOrderData() {
	return new Promise((resolve, reject) => {
		db.view('order', 'newOrder', function (err, body) {
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
		db.view('order', 'newOrders', function (err, body) {
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
		db.view('order', 'onProcess', function (err, body) {
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
		db.view('order', 'ready', function (err, body) {
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
		db.view('order', 'deliveredOrders', function (err, body) {
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
		db.view('order', 'numberOfOrder', function (err, body) {
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
		db.view('order', 'differentOrderCounts', function (err, body) {
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
		db.view('order', 'orderByMonth', function (err, body) {
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
				"$or": [
					{
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
					logger.warn(`Document id ${id} does not exist.`, 'findById()');
					resolve({ data: JSON.stringify(err.message), statusCode: 404 });
				} else if (err.message == 'deleted') {
					logger.warn(`Document id ${id} does not exist.`, 'findById()');
					resolve({ data: JSON.stringify(err.message), statusCode: 404 });
				} else {
					logger.error('Error occurred: ' + err.message, 'findById()');
					reject(err);
				}
			} else {
				resolve({ data: document, statusCode: 200 });
			}
		});
	});
}

module.exports.findById = findById;
module.exports.deleteById = deleteById;
module.exports.deleteOrder = deleteOrder;
module.exports.updateOrder = updateOrder;
module.exports.insertOrderData = insertOrderData;
module.exports.getOrderData = getOrderData;
module.exports.getOrderCount = getOrderCount;
module.exports.getOrderById = getOrderById;
module.exports.getNewOrders = getNewOrders;
module.exports.getDeliveredOrders = getDeliveredOrders;
module.exports.getDifferentOrderCounts = getDifferentOrderCounts;
module.exports.getOnProcessOrders = getOnProcessOrders;
module.exports.getReadyOrders = getReadyOrders;
module.exports.getYTTOrders = getYTTOrders;
module.exports.getOrderByMonth = getOrderByMonth;

