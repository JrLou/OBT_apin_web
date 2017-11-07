require("../public/config.js");
var {router,setIp} = require("../router.js");
var serviceIP =  "http://10.0.0.62:9008";
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
    serviceIP:serviceIP
};