require('./config/envValidation');
var express = require('express');
var cookieParser = require('cookie-parser');
var https = require('https');
var http = require('http');
var bodyParser = require('body-parser');
var router = require('./services/routes');
var routerAuth = require('./services/oidc');
var cookie = require('./util/cookie');
var passport = require("passport");
var fs = require('fs');
var session = require('express-session');
var app = express();

const server =  http.createServer(app);
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: 104857600 }));
app.use(bodyParser.urlencoded({ limit: 104857600, extended: true }));
app.use(cookieParser());

//To point to static files 
app.use(express.static(__dirname + '/views'));

//Middleware to check cookie and to perform redirect 
app.use(function (req, res, next) {
   next();
});

// To route the application api and ui request 
app.use('/', router);

//Authontication route
app.use('/auth/sso/', routerAuth.authRouter)

server.listen(port);
