
var {router,setIp} = require("../router.js");
var serviceIP = "http://192.168.0.58:6300";
setIp(serviceIP);
module.exports = {
    port: 3000,
    browserSupport:9,
    blockPageName:"hintPage.html",
    assetPath: "./public",
    viewPath:"./view",
    custom: {
        serverRoutes:router
    },
    hlIP:serviceIP,
    serviceIP:serviceIP
};