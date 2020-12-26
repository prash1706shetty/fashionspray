var express = require("express");
var passport = require("passport");
var passport_ci_oidc = require("passport-ci-oidc");
var jwt = require("./jwt");
var authRouter = express.Router();

var oidcStrategyCallback = function (iss, sub, profile, accessToken, refreshToken, params, done) {
    process.nextTick(function () {
        var user = {
            firstName: profile.firstName,
            lastName: profile.lastName,
            emailAddress: profile.emailAddress,
            realmName: profile.realmName,
            blueGroups: profile.blueGroups,
            accessToken: accessToken,
            refreshToken: refreshToken,
            jwt: params.id_token
        };
        done(null, user);
    });
};

var oidcStrategy = new passport_ci_oidc.IDaaSOIDCStrategy({
    discoveryURL: process.env.OIDC_DISCOVERY_URL,
    clientID: process.env.OIDC_CLIENT_ID,
    clientSecret: process.env.OIDC_CLIENT_SECRET,
    callbackURL: process.env.OIDC_CALLBACK_URL,
    scope: process.env.OIDC_SCOPE,
    response_type: process.env.OIDC_RESPONSE_TYPE,
    skipUserProfile: true,
    addCACert: false,
}, oidcStrategyCallback);

//OIDC Middleware which handles the authentication
var oidcAuthenticate = passport.authenticate('openidconnect', {
    session: false
});

//GET /auth/sso/login - kick off the authentication process
authRouter.get('/login', oidcAuthenticate);

//GET /auth/sso/authenticateduser - gets the authenticated user
authRouter.get('/authenticateduser', function (req, res) {
    if (req.cookies && req.cookies[process.env.JWT_COOKIE_NAME]) {
        res.status(200).send(jwt.decodeReducedJWT(req.cookies[process.env.JWT_COOKIE_NAME]), res);
    } else {
        res.status(401).send('User not authonticated.');
    }
});

//GET /auth/sso/callback - OIDC Callback
authRouter.get('/callback', oidcAuthenticate, async function (req, res, next) {
    try {
        var jwtValue = req.user.jwt;
        var originalDecodedJWT = jwt.verifyOriginalJWT(jwtValue);
        var reducedJWT = jwt.reduceJWTBlueGroups(originalDecodedJWT);
        res.cookie(process.env.JWT_COOKIE_NAME, reducedJWT, { secure: true });
        var redirectURL = req.app.locals.redirectURL;        
        if(redirectURL== undefined) redirectURL ='/';
        req.app.locals.redirectURL = 'loggedin';        
        res.redirect(redirectURL);
    } catch (error) {
        console.error('Error in callback function, ' + error)
    }
});

module.exports.authRouter = authRouter;
module.exports.oidcStrategy = oidcStrategy;
module.exports.oidcAuthenticate = oidcAuthenticate;
