var cloudant = require('../controllers/cloudantDao');
var caas = require('../controllers/caasApiDao');

async function insertData(productData) {

  return  await cloudant.create(productData);
}

function deleteData(req) {
  cloudant.deleteById(req.productId, req.rev);
}

async function fetchByView(view, cookieValue) {
  var doc = await cloudant.fetchByView(view, cookieValue);
  return doc;
}

async function documentListByBrief(language) {
  return await caas.documentListByBrief(language);
}

async function fetchDocFileByIdAndLang(document) {

  return await caas.fetchDocFileByIdAndLang(document);
}

async function fetchDocByIdAndLang(language, document_id) {

  return await caas.fetchDocByIdAndLang(language, document_id);
}

async function fetchDocContentAll(document) {

  return await caas.fetchDocContentAll(document);
}

async function updateDocument(doc) {
  return await caas.updateDocument(doc);
}

async function updateDocumentFile(doc) {
  return await caas.updateDocumentFile(doc);
}

async function createImageFile(doc) {
  return await caas.createImageFile(doc);
}

async function deleteDocument(doc) {
  return await caas.deleteDocument(doc);
}

async function deleteDocumentFile(doc) {
  var resp = await caas.deleteDocumentFile(doc);
  return resp;
}

async function createTocFile(doc) {
  return await caas.createTocFile(doc);
}

async function copyDocument(docId){
  return await caas.copyDocument(docId);
}

async function masterDocListByBrief(language) {
  return await caas.masterDocListByBrief(language);
}

async function createDocument(docId){
  return await caas.createDocument(docId);
}

module.exports.fetchByView = fetchByView;
module.exports.insertData = insertData;
module.exports.deleteData = deleteData;
module.exports.fetchDocFileByIdAndLang = fetchDocFileByIdAndLang;
module.exports.fetchDocByIdAndLang = fetchDocByIdAndLang;
module.exports.fetchDocContentAll = fetchDocContentAll;
module.exports.documentListByBrief = documentListByBrief;
module.exports.updateDocument = updateDocument;
module.exports.updateDocumentFile = updateDocumentFile;
module.exports.deleteDocument = deleteDocument;
module.exports.createImageFile = createImageFile;
module.exports.deleteDocumentFile = deleteDocumentFile;
module.exports.createTocFile = createTocFile;
module.exports.copyDocument = copyDocument;
module.exports.masterDocListByBrief = masterDocListByBrief;
module.exports.createDocument = createDocument;
