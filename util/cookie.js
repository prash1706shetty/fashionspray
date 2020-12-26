var path = require('path');
var jwt = require("../services/jwt");
var listUtils = require("./listUtils");
var constants = require("./constants");
var jwt = require("../services/jwt");

async function checkCookie(req, res, next, cookieValue) {
    try {
        const ssoLogin = process.env.SSO_LOGIN_URL;
        if (cookieValue == undefined) {            
            var displayMessage = '';
            res.render(path.join(__dirname, '../views/login.ejs'), { ssoLogin, displayMessage });
        } else if (req.app.locals.redirectURL == 'loggedin') {
            var decodedJWT = await jwt.decodeReducedJWT(cookieValue, res);
            var adminBlueGroupList = listUtils.stringToList(process.env.BLUE_GROUPS_LIST);
            var displayMessage = constants.UNAUTHORIZED_USER_ERROR_MESSAGE.error.message;
            listUtils.containsAtLeastOne(decodedJWT.data.blueGroups, adminBlueGroupList) ? next() : res.render(path.join(__dirname, '../views/login.ejs'), { ssoLogin, displayMessage });
            req.app.locals.redirectURL = null;
        } else {
            await jwt.decodeReducedJWT(cookieValue, res);
            req.app.locals.redirectURL = req.originalUrl;
            res.redirect(process.env.SSO_LOGIN_URL);
        }

    } catch (error) {
        console.error(error)
    }
}

function getBlueGroup(cookieValue) {
    var decodedCookieValue = jwt.verifyAppJWT(cookieValue);
    decodedCookieValue.blueGroups = decodedCookieValue.blueGroups.filter(function (group) {
        return listUtils.stringToList(process.env.BLUE_GROUPS_LIST).includes(group);
    });
    return decodedCookieValue;
}

module.exports.checkCookie = checkCookie;
module.exports.getBlueGroup = getBlueGroup;
