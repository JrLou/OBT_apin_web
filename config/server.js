var setting = require("./setting");
var {router,setIp} = require("../router.js");
var serviceIP =  setting.ip;
setIp(serviceIP);
module.exports = {
    port: setting.port,
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