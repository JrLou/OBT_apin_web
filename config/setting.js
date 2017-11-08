
var {router,setIp} = require("../router.js");
// var serviceIP = "http://10.0.0.62:9008";
var serviceIP = "http://10.0.0.182:9008/bohl";
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