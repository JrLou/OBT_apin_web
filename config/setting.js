
var router = require("../router.js");
module.exports = {
    port: 3000,
    assetPath: "./public",
    viewPath:"./view",
    custom: {
        serverRoutes:router
    },
    hlIP:"http://10.0.0.72:9008"
};