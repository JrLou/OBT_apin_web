/**
 * Created by louxudong on 2017/10/30.
 */
let APILXD = {
    //乘机人模块
    addPassenger:'/bo/orderapi/v1.0/orders/passengers/add',             //新增乘客
    deletePassenger:'/bo/orderapi/v1.0/orders/passengers/delete',       //删除乘客
    loadPassengerList:'/bo/orderapi/v1.0/orders/passengers/list',       //加载乘机人列表
    upDataPassenger:'/bo/orderapi/v1.0/orders/passengers/update',       //修改乘客
    confirmPassenger:'/bo/orderapi/v1.0/orders/confirmpassenger',     //确认乘机人信息
    importPassenger:'/bo/orderapi/v1.0/orders/passengers/import/qiniu',       //导入乘客
    exportPassenger:'/bo/orderapi/v1.0/orders/passengers/export',       //导出乘客
    //订单列表页面
    loadOrderList:'/boclj/orderapi/v1.0/orders/query',                  //加载订单列表
    lordOrderDetail:'/boclj/orderapi/v1.0/orders/find',                 //加载订单详情
    cancelOrder:'/bo/orderapi/v1.0/orders/cancel',                        //取消订单
    deleteOrder:'/bo/orderapi/v1.0/orders/delete',                        //删除订单
};
module.exports = APILXD;