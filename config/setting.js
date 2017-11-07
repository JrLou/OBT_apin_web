
var router = require("../router.js");
module.exports = {
    port: 3000,
    browserSupport:9,
    blockPageName:"hintPage.html",
    assetPath: "./public",
    viewPath:"./view",
    custom: {
        serverRoutes:router
    },
    hlIP:"http://192.168.0.58:6300",
    serviceIP:"http://192.168.0.58:6300"
};