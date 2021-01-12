var cloudant = require('../models/cloudant');
const logger = require('../config/logger').logger;
var cookie = require("../util/cookie");

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


async function create(description) {

	var usecases = description.useCases;
	var attachmentArray = [];
	var attachmentCount = 0;
	var mainBImageDatab64 = description.mainBImage;
	if (description.page != "single") {
		var mainBImageType = mainBImageDatab64.substring(mainBImageDatab64.indexOf('/') + 1, mainBImageDatab64.indexOf(';'));
		var base64Value = '';
		var imageContentType = '';
		if (mainBImageType == 'png') {
			base64Value = mainBImageDatab64.substring(22);
			imageContentType = 'image/png'
		} else {
			base64Value = mainBImageDatab64.substring(23);
			imageContentType = 'image/jpeg'
		}
		var mainBImage = {
			name: 'mainBImage',
			data: Buffer.from(base64Value, 'base64'),
			content_type: imageContentType
		}
		attachmentArray[attachmentCount] = mainBImage;
		attachmentCount++;
		delete description.mainBImage;
	}


	for (i = 0; i < usecases.length; i++) {

		var k = i + 1;
		var introImageDatab64 = usecases[i].introPage.image;
		var introImageType = introImageDatab64.substring(introImageDatab64.indexOf('/') + 1, introImageDatab64.indexOf(';'));
		var base64Value = '';
		var imageContentType = '';
		if (introImageType == 'png') {
			base64Value = introImageDatab64.substring(22);
			imageContentType = 'image/png'
		} else {
			base64Value = introImageDatab64.substring(23);
			imageContentType = 'image/jpeg'
		}

		var introPageImages = {
			name: 'usecase' + k + 'IntroImage',
			data: Buffer.from(base64Value, 'base64'),
			content_type: imageContentType
		}

		var exitImageDatab64 = usecases[i].exitPage.image;
		var exitImageType = exitImageDatab64.substring(exitImageDatab64.indexOf('/') + 1, exitImageDatab64.indexOf(';'));
		var base64Value = '';
		var imageContentType = '';
		if (exitImageType == 'png') {
			base64Value = exitImageDatab64.substring(22);
			imageContentType = 'image/png'
		} else {
			base64Value = exitImageDatab64.substring(23);
			imageContentType = 'image/jpeg'
		}

		var exitPageImages = {
			name: 'usecase' + k + 'ExitImage',
			data: Buffer.from(base64Value, 'base64'),
			content_type: imageContentType
		}

		for (j = 0; j < usecases[i].scene; j++) {
			m = j + 1;

			var sceneImageDatab64 = usecases[i]['scene' + m].image;
			var sceneImageType = sceneImageDatab64.substring(sceneImageDatab64.indexOf('/') + 1, sceneImageDatab64.indexOf(';'));
			var base64Value = '';
			var imageContentType = '';
			if (sceneImageType == 'png') {
				base64Value = sceneImageDatab64.substring(22);
				imageContentType = 'image/png'
			} else {
				base64Value = sceneImageDatab64.substring(23);
				imageContentType = 'image/jpeg'
			}

			var scenePageImages = {
				name: 'usecase' + k + 'Scene' + m + 'Image',
				data: Buffer.from(base64Value, 'base64'),
				content_type: imageContentType
			}

			attachmentArray[attachmentCount] = scenePageImages;
			attachmentCount++;
			delete usecases[i]['scene' + m].image;

		}
		var imageData = usecases[i].image == undefined ? '' : Buffer.from(usecases[i].image.substring(23), 'base64');

		var usecaseImageDatab64 = usecases[i].image;
		var usecaseImageType = usecaseImageDatab64.substring(usecaseImageDatab64.indexOf('/') + 1, usecaseImageDatab64.indexOf(';'));
		var base64Value = '';
		var imageContentType = '';
		if (usecaseImageType == 'png') {
			base64Value = usecaseImageDatab64.substring(22);
			imageContentType = 'image/png'
		} else {
			base64Value = usecaseImageDatab64.substring(23);
			imageContentType = 'image/jpeg'
		}


		if (description.page != "single") {
			var usecaseImages = {
				name: 'usecase' + k + 'Image',
				data: Buffer.from(base64Value, 'base64'),
				content_type: imageContentType
			}
			attachmentArray[attachmentCount] = usecaseImages;
			attachmentCount++;
			delete description.useCases[i].image;
		}

		attachmentArray[attachmentCount] = introPageImages;
		attachmentCount++;
		delete description.useCases[i].introPage.image;
		attachmentArray[attachmentCount] = exitPageImages;
		attachmentCount++;
		delete description.useCases[i].exitPage.image;
	}

	if (description.action == 'add') {

		return new Promise((resolve, reject) => {
			db.multipart.insert({ description }, attachmentArray, description.prdId, (err, result) => {
				if (err) {
					logger.error('Error occurred: ' + err.message, 'create()');
					reject(err);
				} else {
					resolve({ data: { createdId: result.id, createdRevId: result.rev }, statusCode: 201 });
					logger.info('Inserted to Cloudant database');
				}
			});
		}).catch((error) => {
			logger.error('Error occurred: ' + error.error + 'create()');
			return error;
		});
	} else {
		var data = await findById(description.prdId).then(function (result) {
			var docData = JSON.parse(result.data);

			return new Promise((resolve, reject) => {
				db.multipart.insert({ description, "_rev": docData._rev }, attachmentArray, description.prdId, (err, result) => {
					if (err) {
						logger.error('Error occurred: ' + err.message, 'create()');
						reject(err);
					} else {
						resolve({ data: { createdId: result.id, createdRevId: result.rev }, statusCode: 201 });
						logger.info('Cloudant doc updated.');
					}
				});
			}).catch((error) => {
				throw error;
			});

		}).catch((error) => {
			logger.error('Error occurred: ' + error.error + 'create()');
			return error;
		});
		return data;
	}
}

function update(doc) {

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

function findByTitle(title) {

	let search = `.*${title}.*`;
	return new Promise((resolve, reject) => {
		db.find({
			'selector': {
				'testingTitle': {
					'$eq': title   //$regex
				}
			}
		}, (err, documents) => {
			if (err) {
				reject(err);
			} else {
				resolve({ data: JSON.stringify(documents.docs), statusCode: (documents.docs.length > 0) ? 200 : 404 });
			}
		});
	});
}

function fetchByView(allDoc, cookieValue) {

	return new Promise((resolve, reject) => {
		db.view('allDoc', 'all-doc', async function (err, body) {
			if (err) {
				if (err.message == 'missing') {
					logger.warn(`Document id ${id} does not exist.`, 'findById()');
					resolve({ data: {}, statusCode: 404 });
				} else {
					logger.error('Error occurred: ' + err.message, 'findById()');
					reject(err);
				}
			} else {
				var userBlueGroup = cookie.getBlueGroup(cookieValue);
				var privileges = '';
				if(userBlueGroup.blueGroups == 'showcase-editor-admin'){
					privileges = await getUserPrivileges('getAdminPrivileges');
				} else if (userBlueGroup.blueGroups == 'showcase-editor-author') {
					privileges = await getUserPrivileges('getAuthorPrivileges');
				} else if (userBlueGroup.blueGroups == 'showcase-editor-reviewer') {
					privileges = await getUserPrivileges('getReviewerPrivileges');
				} else {
					privileges = await getUserPrivileges('getPublisherPrivileges');
				}
				resolve({ data: body, userPrivileges: privileges, statusCode: 200 ,userEmailId:userBlueGroup.emailAddress});
			}
		});
	});
}

function getUserPrivileges(viewName) {
	return new Promise((resolve, reject) => {
		access_control_db.view('privileges', viewName, function (err, body) {
			if (err) {
				console.error('Error occurred: ' + err.message);
				reject(err);
			} else {
				resolve(body);
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

module.exports.create = create;
module.exports.findById = findById;
module.exports.deleteById = deleteById;
module.exports.update = update;
module.exports.findByTitle = findByTitle;
module.exports.fetchByView = fetchByView;
module.exports.insertOrderData = insertOrderData;
module.exports.getOrderData = getOrderData;
module.exports.getOrderCount = getOrderCount;

