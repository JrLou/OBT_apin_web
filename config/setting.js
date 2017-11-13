
var {router,setIp} = require("../router.js");
// var serviceIP = "http://10.0.0.62:9008";
var serviceIP = "http://10.0.0.182:9008";
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
   qiniu: {
      domain: 'http://voucher.apin.com/',
      accessKey: 'yFnb1L-yqxkEjfjOwiQzb5wsRcIQRoaZUbrhFupD',
      secretKey: 'vfmYoka7B74ikLzGcgeCqfqlytOskqwU7mMu3QgX',
      bucket: 'apin-voucher'
	},
    hlIP:serviceIP,
    serviceIP:serviceIP
};