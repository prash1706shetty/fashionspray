var path = require('path');

let reqPath = path.join(__dirname, '../');

async function checkCookie(req, res, cookieValue, next){
    console.log("cookieValue->"+cookieValue);
    if(cookieValue == undefined){
        res.render(reqPath + "/views/" + "login.ejs");
    } else {
        //res.render(reqPath + "/views/" + "login.ejs");
        next();
    }
}

module.exports.checkCookie = checkCookie;