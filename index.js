require('./config/envValidation');
var express = require('express');
var cookieParser = require('cookie-parser');
var http = require('http');
var router = require('./services/routes');
var bodyParser = require('body-parser');
var cookie = require('./services/cookie');
var app = express();

const server = http.createServer(app);
const port = process.env.PORT || 3001;

// To support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

//To point to static files 
app.use(express.static(__dirname + '/views'));

//Middleware to check cookie and to perform redirect 
app.use(function (req, res, next) {
   req.originalUrl.includes('/logincheck') ? next() : router.checkCookie(req, res, req.cookies['fs_at'], next);
});

// To route the application api and ui request 
app.use('/', router);

server.listen(port);
