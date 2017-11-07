var express = require("express");
var router = express.Router();
var request = require("request");

function setIp(ip) {
    this.ip = ip;
}
router.get("/apin/*", function (req, res, next) {
    console.log("serviceIP:"+this.ip);
    let originalUrl = req.headers.referer || "";
    let ip1 = global.getMappedAddr(originalUrl);
    if(ip1){
        this.ip = ip1;
    }
    var url = this.ip+""+req.originalUrl.slice("/apin".length);
    res.redirect(url);
});


module.exports = {router,setIp};
