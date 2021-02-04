var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var jwt = require("./jwt");
var events = require('./events');
var router = express.Router();
var cloudant = require('../controllers/cloudantDao');

router.use(bodyParser.json({ limit: 104857600 }));
router.use(bodyParser.urlencoded({ limit: 104857600, extended: true }));

let reqPath = path.join(__dirname, '../');
router.get('/', function (req, res) {
    res.sendFile(reqPath + "/views/" + "orderList.html");
});

router.get('/add/', function (req, res) {
    res.sendFile(reqPath + "/views/" + "newOrder.html");
});

router.get('/dashboard/', function (req, res) {
    res.sendFile(reqPath + "/views/" + "dashboard.html");
});

router.get('/editorder', function (req, res) {
    res.sendFile(reqPath + "/views/" + "editOrder.html");   
});

router.get('/orderList/', function (req, res) {
    res.sendFile(reqPath + "/views/" + "orderList.html");
});

router.get('/add/useCases', function (req, res) {
    res.sendFile(reqPath + "/views/" + "useCaseList.html");
});

router.get('/edit/useCases', function (req, res) {
    res.sendFile(reqPath + "/views/" + "useCaseList.html");
});

router.get('/edit', function (req, res) {
    res.sendFile(reqPath + "/views/" + "productList.html");
});

router.get('/view', function (req, res) {
    res.sendFile(reqPath + "/views/captivate-pages/" + "index.html");
});

router.get('/useCases', function (req, res) {
    res.sendFile(reqPath + "/views/" + "useCaseList.html");
});

router.post('/cloudant/add', jwt.authenticateJWT, function (req, res) {
    events.insertData(req.body).then(function (v) {
        res.send(v);
    });
});

router.post('/cloudant/delete', jwt.authenticateJWT, function (req, res) {
    events.deleteData(req.body);
    res.send('Data deleted successfully');
});

router.post('/cloudant/view', jwt.authenticateJWT, function (req, res) {
    var data = events.fetchByView(req.body.view, req.cookies[process.env.JWT_COOKIE_NAME]);
    data.then(function (v) {
        res.send(v);
    });
});

router.post('/cloudant/fetchById', jwt.authenticateJWT, function (req, res) {
    var data = events.fetchById(req.body.productId);
    data.then(function (v) {
        res.send(v);
    });
});

router.post('/caas/documentListByBrief', jwt.authenticateJWT, function (req, res) {
    var data = events.documentListByBrief(req.body.language);
    data.then(function (resp) {
        res.send(resp);
    });
});

router.post('/caas/fetchDocByIdAndLang', jwt.authenticateJWT, function (req, res) {

    var data = events.fetchDocByIdAndLang(req.body.language, req.body.document_id);
    data.then(function (v) {
        res.send(v);
    });
});

router.post('/caas/fetchDocFileByIdAndLang', jwt.authenticateJWT, function (req, res) {
    var data = events.fetchDocFileByIdAndLang(req.body);
    data.then(function (v) {
        res.send(v);
    });
});

router.post('/caas/fetchDocContentAll', jwt.authenticateJWT, function (req, res) {
    var data = events.fetchDocContentAll(req.body);
    data.then(function (v) {
        res.send(v);
    });
});

router.post('/caas/createDocument', async function (req, res) {
   await cloudant.insertOrderData(req.body);
   res.send('success');
});

router.post('/caas/getDocuments', async function (req, res) {
   var orderData = await cloudant.getOrderData();
   res.send(orderData);
});

router.post('/caas/getOrderCount', async function (req, res) {
    var orderData = await cloudant.getOrderCount();    
    res.send(orderData);
 });

 router.post('/fs/deleteorder', async function (req, res) {
    var orderData = await cloudant.deleteOrder(req.body);    
    res.send(orderData);
 });

 router.post('/fs/updateorder', async function (req, res) {     
    var orderData = await cloudant.updateOrder(req.body);    
    res.send(orderData);
 });


router.post('/getOrder', async function (req, res) {
    var orderData = await cloudant.getOrderById(req.body);    
    res.send(orderData);
 });

router.post('/caas/updateDocument1', jwt.authenticateJWT, function (req, res) {
    var data = events.updateDocument(req.body);
    data.then(function (resp) {
        res.send(resp);
    });
});

router.post('/caas/updateDocumentFile', jwt.authenticateJWT, function (req, res) {
    var data = events.updateDocumentFile(req.body);
    data.then(function (resp) {
        res.send(resp);
    });
});

router.post('/caas/createImageFile', jwt.authenticateJWT, function (req, res) {
    var datas = events.createImageFile(req.body);
    datas.then(function (resp) {
        res.send(resp);
    });
});

router.post('/caas/deleteDocument', jwt.authenticateJWT, function (req, res) {
    var data = events.deleteDocument(req.body);
    data.then(function (resp) {
        res.send(resp);
    });
});

router.post('/caas/deleteDocumentFile', jwt.authenticateJWT, function (req, res) {
    var data = events.deleteDocumentFile(req.body);
    data.then(function (resp) {
        res.send(resp);
    });
});

router.post('/caas/createTocFile', jwt.authenticateJWT, function (req, res) {
    var data = events.createTocFile(req.body);
    data.then(function (resp) {
        res.send(resp);
    });
});

router.post('/caas/masterDocListByBrief', jwt.authenticateJWT, function (req, res) {
    var data = events.masterDocListByBrief(req.body.language);
    data.then(function (resp) {
        res.send(resp);
    });
});

router.get('/caas/fetchCatalogDetails', jwt.authenticateJWT, function (req, res) {

    var data = {
         publishedCatalogId: process.env.CAAS_MASTER_CATALOG_ID,
         draftCatalogId : process.env.CAAS_CATALOG_ID
     };
     res.send(data);
});

module.exports = router;
