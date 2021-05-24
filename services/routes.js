var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();
var cloudant = require('../controllers/cloudantDao');

router.use(bodyParser.json({ limit: 104857600 }));
router.use(bodyParser.urlencoded({ limit: 104857600, extended: true }));

let reqPath = path.join(__dirname, '../');

router.get('/login', function (req, res) {
    const loginUrl = '/dashboard';
    const displayMessage = '';
    res.render(reqPath + "/views/" + "login.ejs",{loginUrl, displayMessage});
});

router.get('/expense', function (req, res) {
    res.sendFile(reqPath + "/views/" + "expense.html");
});

router.get('/orderlistforfabrics', function (req, res) {
    res.sendFile(reqPath + "/views/" + "fabricsList.html");
});

router.get('/fabricspurchase', function (req, res) {
    res.sendFile(reqPath + "/views/" + "fabricsPurchase.html");
});

router.get('/allorders', function (req, res) {
    res.sendFile(reqPath + "/views/" + "orderList.html");
});

router.get('/add/', function (req, res) {
    res.sendFile(reqPath + "/views/" + "newOrder.html");
});

router.get('/addfabrics', function (req, res) {
    res.sendFile(reqPath + "/views/" + "addFabrics.html");
});

router.get('/editfabrics', function (req, res) {
    res.sendFile(reqPath + "/views/" + "editFabrics.html");
});

router.get('/analysis/', function (req, res) {
    res.sendFile(reqPath + "/views/" + "analysis.html");
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
    res.sendFile(reqPath + "/views/" + "newOrdersList.html");
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

router.post('/fs/createDocument', async function (req, res) {
    await cloudant.insertOrderData(req.body);
    res.send('success');
});

router.get('/fs/getAllOrderData', async function (req, res) {
    var orderData = await cloudant.getAllOrderData();
    res.send(orderData);
});

router.get('/fs/getOrdersForFabrics', async function (req, res) {
    var orderData = await cloudant.getOrdersForFabrics();
    res.send(orderData);
});

router.get('/fs/getFabrics', async function (req, res) {
    var orderData = await cloudant.getFabrics();
    res.send(orderData);
});

router.get('/fs/getOrderCount', async function (req, res) {
    var orderData = await cloudant.getOrderCount();
    res.send(orderData);
});

router.post('/fs/deleteorder', async function (req, res) {
    var orderData = await cloudant.deleteOrder(req.body);
    res.send(orderData);
});

router.post('/fs/deletefabrics', async function (req, res) {
    var orderData = await cloudant.deleteFabrics(req.body);
    res.send(orderData);
});

router.post('/fs/addFabrics', async function (req, res) {
    var orderData = await cloudant.addFabrics(req.body);
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

router.get('/fs/getNewOrders', async function (req, res) {
    var orderData = await cloudant.getNewOrders();
    res.send(orderData);
});

router.get('/fs/getOnProcessOrders', async function (req, res) {
    var orderData = await cloudant.getOnProcessOrders();
    res.send(orderData);
});

router.get('/fs/getReadyOrders', async function (req, res) {
    var orderData = await cloudant.getReadyOrders();
    res.send(orderData);
});

router.get('/fs/getDeliveredOrders', async function (req, res) {
    var orderData = await cloudant.getDeliveredOrders();
    res.send(orderData);
});

router.get('/fs/getDifferentOrderCounts', async function (req, res) {
    var orderData = await cloudant.getDifferentOrderCounts();
    res.send(orderData);
});

router.get('/fs/getOrderByMonth', async function (req, res) {
    var orderData = await cloudant.getOrderByMonth();
    res.send(orderData);
});

router.post('/fs/getYTTOrders', async function (req, res) {
    var orderData = await cloudant.getYTTOrders(req.body);
    res.send(orderData);
});

router.post('/logincheck', async function (req, res) {
    var username = req.body.email;
    var password = req.body.password;
    console.log('username->'+username);
    console.log('password->'+password);
    res.sendFile(reqPath + "/views/" + "dashboard.html");
});

module.exports = router;
