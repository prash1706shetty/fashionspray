var jwt = require('jsonwebtoken');
var path = require('path');
var constants = require("../util/constants");
var listUtils = require('../util/listUtils');
var buffer = Buffer.from(process.env.OIDC_JWT_CERT, 'base64');
var jwtCert = buffer.toString('ascii');
var verifyOptions = { algorithms: ['RS256', 'HS256'] };

//Jwt Authentication Middleware
var authenticateJWT = function (req, res, next) {
    var token = req.headers.authorization;
    try {
        if (!token) {
            return res.status(401).send(constants.UNAUTHENTICATED_USER_ERROR_MESSAGE);
        }
        verifyAppJWT(token.replace(/^Bearer\s/, ''));
        next();
    } catch (err) {
        console.error("Could not verify the JWT: " + err);
        return res.status(401).send({ error: err });
    }
};

var decodeReducedJWT = function (token, res) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SIGN_SECRET, function (err, userData) {
            if (err) {
                const ssoLogin = process.env.SSO_LOGIN_URL;
                if (err.name == 'TokenExpiredError') {
                    var displayMessage = '';
                    res.render(path.join(__dirname, '../views/login.ejs'), { ssoLogin, displayMessage })
                } else {
                    var displayMessage = err;
                    res.render(path.join(__dirname, '../views/login.ejs'), { ssoLogin, displayMessage })
                }
            } else {
                resolve({ data: userData });
            }
        });
    });
};

var verifyOriginalJWT = function (token) {
    return jwt.verify(token, jwtCert, verifyOptions);
};

var verifyAppJWT = function (token) {
    return jwt.verify(token, process.env.JWT_SIGN_SECRET);
};

var reduceJWTBlueGroups = function (decoded) {
    decoded.blueGroups = decoded.blueGroups.filter(function (group) {
        return listUtils.stringToList(process.env.BLUE_GROUPS_LIST).includes(group);
    });
    return jwt.sign(decoded, process.env.JWT_SIGN_SECRET);
};

module.exports.verifyOriginalJWT = verifyOriginalJWT;
module.exports.authenticateJWT = authenticateJWT;
module.exports.reduceJWTBlueGroups = reduceJWTBlueGroups;
module.exports.decodeReducedJWT = decodeReducedJWT;
module.exports.verifyAppJWT = verifyAppJWT;
