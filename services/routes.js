var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
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

router.get('/dashboardold/', function (req, res) {
    res.sendFile(reqPath + "/views/" + "dashboardold.html");
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

router.get('/neworders', function (req, res) {
    res.sendFile(reqPath + "/views/" + "newOrders.html");
});

router.get('/onprocess', function (req, res) {
    res.sendFile(reqPath + "/views/" + "onprocess.html");
});

router.get('/readytodeliver', function (req, res) {
    res.sendFile(reqPath + "/views/" + "readytodeliver.html");
});

router.get('/delivered', function (req, res) {
    res.sendFile(reqPath + "/views/" + "delivered.html");
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

router.get('/useCases', function (req, res) {
    res.sendFile(reqPath + "/views/" + "useCaseList.html");
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

 router.post('/fs/getNewOrders', async function (req, res) {
    var orderData = await cloudant.getNewOrders();
    res.send(orderData);
 });

 router.post('/fs/getOnProcessOrders', async function (req, res) {
    var orderData = await cloudant.getOnProcessOrders();
    res.send(orderData);
 });

 router.post('/fs/getReadyOrders', async function (req, res) {
    var orderData = await cloudant.getReadyOrders();
    res.send(orderData);
 });

 
 router.post('/fs/getDeliveredOrders', async function (req, res) {
    var orderData = await cloudant.getDeliveredOrders();
    res.send(orderData);
 });

 router.post('/fs/getDifferentOrderCounts', async function (req, res) {
    var orderData = await cloudant.getDifferentOrderCounts();    
    res.send(orderData);
 });

 router.post('/fs/getYTTOrders', async function (req, res) {
    var orderData = await cloudant.getYTTOrders();    
    res.send(orderData);
 });

module.exports = router;
