var caasRequest = require('request-promise');
const logger = require('../config/logger').logger;
const { Duplex } = require('stream');
var caasUrl = require('../config/caas');
var delimeter = "/"

async function documentListByBrief(language) {

    let url = process.env.CAAS_URL + process.env.CAAS_CATALOG_ID + delimeter + caasUrl.CAAS_DOCUMENT_BRIEF.replace('{language}', language)
    return await fetchCaasData(url);
}

async function fetchDocFileByIdAndLang(document) {

    let url = process.env.CAAS_URL + process.env.CAAS_CATALOG_ID + delimeter + caasUrl.CAAS_DOCUMENTFILE_BY_ID_LANG.replace('{language}', document.language).replace('{document_id}', document.document_id).replace('{file_name}', document.fileName);
    return await fetchCaasData(url);
}

async function fetchDocByIdAndLang(language, document_id) {

    let url = process.env.CAAS_URL + process.env.CAAS_CATALOG_ID + delimeter + caasUrl.CASS_DOCUMENT_BY_ID_LANG.replace('{language}', language).replace('{document_id}', document_id).replace('{file_name}', document_id);
    return await fetchCaasData(url);
}

async function fetchDocContentAll(document) {

    let url = process.env.CAAS_URL + process.env.CAAS_CATALOG_ID + delimeter + caasUrl.CAAS_DOCUMENT_CONTENT_ALL.replace('{language}', document.language).replace('{document_id}', document.document_id);
    return await fetchCaasData(url);
}

async function updateDocument(doc) {

    let url = process.env.CAAS_URL + process.env.CAAS_CATALOG_ID + delimeter + caasUrl.CAAS_MERGE_DOC.replace('{document_id}', doc.docId).replace('{language}', 'en');
    var resp = await caasUpdateDoc(url, doc.updateDoc);
    return resp;
}

async function updateDocumentFile(doc) {

    let url = process.env.CAAS_URL + process.env.CAAS_CATALOG_ID + delimeter + caasUrl.CAAS_DOCUMENT_FILE_UPDATE_URL.replace('{document_id}', doc.docId).replace('{file_name}', doc.fileName).replace('{language}', 'en');
    var resp = await caasUpdateDoc(url, doc.updateDoc);
    return resp;
}

async function deleteDocumentFile(doc) {

    let url = process.env.CAAS_URL + process.env.CAAS_CATALOG_ID + delimeter + caasUrl.CAAS_DOCUMENT_FILE_UPDATE_URL.replace('{document_id}', doc.docId).replace('{file_name}', doc.fileName).replace('{language}', 'en');
    var resp = await caasDeletDocFile(url);
    return resp;
}

async function createTocFile(doc) {

    let url = process.env.CAAS_URL + process.env.CAAS_CATALOG_ID + delimeter + caasUrl.CAAS_TOC_DOC_INDEX.replace('{document_id}', doc.docId).replace('{language}', 'en');
    var resp = await caasCreateToc(url);
    return resp;
}

async function deleteDocument(docId) {

    let url = process.env.CAAS_URL + process.env.CAAS_CATALOG_ID + delimeter + caasUrl.CAAS_DOCUMENT_URL.replace('{document_id}', docId).replace('{language}', 'en');
    var resp = await caasDeleteDoc(url);
    return resp;
}

async function createDocument(doc) {

    let url = process.env.CAAS_URL + process.env.CAAS_CATALOG_ID + delimeter + caasUrl.CAAS_DOCUMENT_URL.replace('{document_id}', doc.docId).replace('{language}', 'en');
    var resp = await caasCreateDoc(url, doc.updateDoc);
    return resp;
}

async function copyDocument(docId) {

    let url = process.env.CAAS_URL + process.env.CAAS_CATALOG_ID + delimeter + caasUrl.CAAS_COPY_CATALOG.replace('{copyFromdocId}', docId).replace('{copyToDocument}', process.env.CAAS_MASTER_CATALOG_ID).replace('{copyTodocId}', docId);
    var resp = await copyDocToNewCatalog(url);

    return resp;
}

async function masterDocListByBrief(language) {

    let url = process.env.CAAS_URL + process.env.CAAS_MASTER_CATALOG_ID + delimeter + caasUrl.CAAS_DOCUMENT_BRIEF.replace('{language}', language)
    return await fetchCaasData(url);
}

async function caasCreateToc(url) {
    var header = fetchHeaderDetails();
    header['Content-Type']='text/plain';

    var data = await caasRequest.put({
        url: url,
        headers: header,
        body: ' ',
        resolveWithFullResponse: true
    }).then(function (resp) {
        if (resp.statusCode == 200) {
            return resp;
        }
    }).catch(function (err) {
        logger.error('Error occurred: ' + err.message, 'fetchCaasData()');
        return err.message;
    });
    return data;
}

async function createImageFile(req) {

    var base64Img = '';
    var imageType = '';

    if (req.imageType == 'png') {
        base64Img = req.base64Image.substring(22);
        imageType = 'png';
    } else if (req.imageType == 'gif') {
        base64Img = req.base64Image.substring(22);
        imageType = 'gif';
    } else if (req.imageType == 'jpg') {
        base64Img = req.base64Image.substring(22);
        imageType = 'jpg';
    } else {
        base64Img = req.base64Image.substring(23);
        imageType = 'jpeg';
    }

    let bufferImage = new Duplex();
    bufferImage.push(Buffer.from(base64Img, 'base64'));
    bufferImage.push(null);
    let url = process.env.CAAS_URL + process.env.CAAS_CATALOG_ID + delimeter + caasUrl.CAAS_DOCUMENT_FILE_UPDATE_URL.replace('{document_id}', req.docId).replace('{file_name}.json', '_attachments/' + req.imageName + '.' + imageType).replace('{language}', 'en');
    var resp = await caasUpdateDocImg(url, bufferImage);
    return resp;
}

async function fetchCaasData(url) {

    var data = await caasRequest.get({
        url: url,
        headers: fetchHeaderDetails(),
        resolveWithFullResponse: true
    }).then(function (resp) {
        if (resp.statusCode == 200) {
            return resp;
        }
    }).catch(function (err) {
        logger.error('Error occurred: ' + err.message, 'fetchCaasData()');
        return err.message;
    });
    return data;
}

async function caasUpdateDocImg(url, bodyData) {

    var data = await caasRequest.post({
        url: url,
        headers: {
            "Authorization": 'Basic ' + process.env.CASS_AUTHORIZATION_HEADER,
            'content-type': 'application/octet-stream',
        },
        body: bodyData,
        resolveWithFullResponse: true
    }).then(function (resp) {
        if (resp.statusCode == 200) {
            return resp;
        }
    }).catch(function (err) {
        logger.error('Error occurred: ' + err.message, 'fetchCaasData()');
        return err.message;
    });
    return data;
}

async function caasDeletDocFile(url) {

    var data = await caasRequest.delete({
        url: url,
        headers: {
            'Authorization': 'Basic ' + process.env.CASS_AUTHORIZATION_HEADER,
        },
        resolveWithFullResponse: true
    }).then(function (resp) {
        if (resp.statusCode == 200) {
            return resp;
        }
    }).catch(function (err) {
        logger.error('Error occurred: ' + err.message, 'fetchCaasData()');
        return err.message;
    });
    return data;
}

async function caasUpdateDoc(url, bodyData) {

    var data = await caasRequest.put({
        url: url,
        headers: fetchHeaderDetails(),
        body: bodyData,
        json: true,
        resolveWithFullResponse: true
    }).then(function (resp) {
        if (resp.statusCode == 200) {
            return resp;
        }
    }).catch(function (err) {
        logger.error('Error occurred: ' + err.message, 'fetchCaasData()');
        return err.message;
    });
    return data;
}

async function caasCreateDoc(url, bodyData) {

    var data = await caasRequest.post({
        url: url,
        headers: fetchHeaderDetails(),
        body: bodyData,
        json: true,
        resolveWithFullResponse: true
    }).then(function (resp) {
        if (resp.statusCode == 200) {
            return resp;
        }
    }).catch(function (err) {
        logger.error('Error occurred: ' + err.message, 'fetchCaasData()');
        return err.message;
    });
    return data;
}

async function copyDocToNewCatalog(url) {

    var data = await caasRequest.post({
        url: url,
        headers: fetchHeaderDetails(),
        json: true,
        resolveWithFullResponse: true
    }).then(function (resp) {
        if (resp.statusCode == 200) {
            return resp;
        }
    }).catch(function (err) {
        logger.error('Error occurred: ' + err.message, 'copyDocument()');
        return err.message;
    });
    return data;
}

async function caasDeleteDoc(url) {

    var data = await caasRequest.delete({
        url: url,
        headers: fetchHeaderDetails(),
        resolveWithFullResponse: true
    }).then(function (resp) {
        if (resp.statusCode == 200) {
            return resp;
        }
    }).catch(function (err) {
        logger.error('Error occurred: ' + err.message, 'fetchCaasData()');
        return err.message;
    });
    return data;
}

function fetchHeaderDetails() {

    var headerJson = {
        'Authorization': 'Basic ' + process.env.CASS_AUTHORIZATION_HEADER,
    }
    return headerJson;
}

module.exports.documentListByBrief = documentListByBrief;
module.exports.fetchDocFileByIdAndLang = fetchDocFileByIdAndLang;
module.exports.fetchDocByIdAndLang = fetchDocByIdAndLang;
module.exports.fetchDocContentAll = fetchDocContentAll;
module.exports.updateDocument = updateDocument;
module.exports.updateDocumentFile = updateDocumentFile;
module.exports.deleteDocument = deleteDocument;
module.exports.createDocument = createDocument;
module.exports.createImageFile = createImageFile;
module.exports.deleteDocumentFile = deleteDocumentFile;
module.exports.createTocFile = createTocFile;
module.exports.copyDocument = copyDocument;
module.exports.masterDocListByBrief = masterDocListByBrief;




