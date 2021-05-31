var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();
var cloudant = require('../controllers/cloudantDao');
const crypto = require('crypto');
const authTokens = {};

router.use(bodyParser.json({ limit: 104857600 }));
router.use(bodyParser.urlencoded({ limit: 104857600, extended: true }));

let reqPath = path.join(__dirname, '../');

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

async function checkCookie(req, res, cookieValue, next){
    req.user =  authTokens[cookieValue];
    if(cookieValue == undefined){
        res.render(reqPath + "/views/" + "login.ejs");
    } else if (!req.user){
        var loginUrl = '/logincheck'
        var displayMessage = "Your authentication failed, please try to login again.";
        res.render(reqPath + "/views/" + "loginFailure.ejs", { loginUrl, displayMessage }); 
    } else{
        next();
    }
}

const requireAuth = (req, res, next) => {
    req.user = authTokens[req.headers.authorization];
    
    if (req.user) {
        next();
    } else {
        var loginUrl = '/logincheck'
        var displayMessage = "Your authentication failed, please try to login again.";
        res.render(reqPath + "/views/" + "loginFailure.ejs", { loginUrl, displayMessage }); 
    }
};

router.post('/logincheck', async function (req, res) {

    if(req.body.password == '' || req.body.email == '') {
        displayMessage = "Please enter both email and password.";
        res.render(reqPath + "/views/" + "loginFailure.ejs", { displayMessage });
    } else {

    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(req.body.password).digest('base64');
    var userLoginStatus = await cloudant.validateUser(req.body);
    var displayMessage = 'Please enter correct user name and password.';
    if (userLoginStatus.statusCode === 200 && hash === userLoginStatus.data.password) {
        displayMessage = "Login success";
        const authToken = generateAuthToken();
        authTokens[authToken] = userLoginStatus.data;
        res.cookie('fs_at', authToken, { maxAge: 7200000});
        res.redirect('/dashboard');
    } else if (userLoginStatus.statusCode === 200 && hash !== userLoginStatus.data.password) {
        displayMessage = "The password that you've entered is incorrect.";
        res.render(reqPath + "/views/" + "loginFailure.ejs", { displayMessage });
    } else if (userLoginStatus.statusCode !== 200) {
        displayMessage = "The email that you've entered is incorrect.";
        res.render(reqPath + "/views/" + "loginFailure.ejs", { displayMessage });
    }
}
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

router.post('/fs/createDocument', requireAuth, async function (req, res) {
    await cloudant.insertOrderData(req.body);
    res.send('success');
});

router.get('/fs/getAllOrderData', requireAuth, async function (req, res) {
    var orderData = await cloudant.getAllOrderData();
    res.send(orderData);
});

router.get('/fs/getOrdersForFabrics', requireAuth, async function (req, res) {
    var orderData = await cloudant.getOrdersForFabrics();
    res.send(orderData);
});

router.get('/fs/getFabrics', requireAuth, async function (req, res) {
    var orderData = await cloudant.getFabrics();
    res.send(orderData);
});

router.get('/fs/getOrderCount', requireAuth, async function (req, res) {
    var orderData = await cloudant.getOrderCount();
    res.send(orderData);
});

router.post('/fs/deleteorder',requireAuth,  async function (req, res) {
    var orderData = await cloudant.deleteOrder(req.body);
    res.send(orderData);
});

router.post('/fs/deletefabrics', requireAuth, async function (req, res) {
    var orderData = await cloudant.deleteFabrics(req.body);
    res.send(orderData);
});

router.post('/fs/addFabrics', requireAuth, async function (req, res) {
    var orderData = await cloudant.addFabrics(req.body);
    res.send(orderData);
});

router.post('/fs/updateorder', requireAuth, async function (req, res) {
    var orderData = await cloudant.updateOrder(req.body);
    res.send(orderData);
});

router.post('/getOrder', requireAuth, async function (req, res) {
    var orderData = await cloudant.getOrderById(req.body);
    res.send(orderData);
});

router.get('/fs/getNewOrders', requireAuth, async function (req, res) {
    var orderData = await cloudant.getNewOrders();
    res.send(orderData);
});

router.get('/fs/getOnProcessOrders', requireAuth, async function (req, res) {
    var orderData = await cloudant.getOnProcessOrders();
    res.send(orderData);
});

router.get('/fs/getReadyOrders', requireAuth, async function (req, res) {
    var orderData = await cloudant.getReadyOrders();
    res.send(orderData);
});

router.get('/fs/getDeliveredOrders', requireAuth, async function (req, res) {
    var orderData = await cloudant.getDeliveredOrders();
    res.send(orderData);
});

router.get('/fs/getDifferentOrderCounts', requireAuth, async function (req, res) {
    var orderData = await cloudant.getDifferentOrderCounts();
    res.send(orderData);
});

router.get('/fs/getOrderByMonth', requireAuth, async function (req, res) {
    var orderData = await cloudant.getOrderByMonth();
    res.send(orderData);
});

router.post('/fs/getYTTOrders', requireAuth, async function (req, res) {
    var orderData = await cloudant.getYTTOrders(req.body);
    res.send(orderData);
});

module.exports = router;
module.exports.checkCookie = checkCookie;
