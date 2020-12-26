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

const server = process.env.HTTPS === 'true' ? https.createServer({ key: fs.readFileSync(process.env.SSL_KEY_FILE), cert: fs.readFileSync(process.env.SSL_CRT_FILE) }, app) : http.createServer(app);
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: 104857600 }));
app.use(bodyParser.urlencoded({ limit: 104857600, extended: true }));
app.use(cookieParser());
app.use(session({ resave: 'true', saveUninitialized: 'true', secret: process.env.SESSION_SECRET }));

//Passport configuration
passport.use(routerAuth.oidcStrategy);
app.use(passport.initialize());
app.use(passport.session());

//To point to static files 
app.use(express.static(__dirname + '/views'));

//Middleware to check cookie and to perform redirect 
app.use(function (req, res, next) {
   req.originalUrl.includes('/auth/sso/') || req.originalUrl.includes('/caas/') || req.originalUrl.includes('/cloudant/') ? next() : cookie.checkCookie(req, res, next, req.cookies[process.env.JWT_COOKIE_NAME]);
});

// To route the application api and ui request 
app.use('/', router);

//Authontication route
app.use('/auth/sso/', routerAuth.authRouter)

server.listen(port);
