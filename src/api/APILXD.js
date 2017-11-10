/**
 * Created by louxudong on 2017/10/30.
 */
let APILXD = {
    //乘机人模块
    addPassenger:'/bo/orderapi/v1.0/orders/passengers/add',             //新增乘客
    deletePassenger:'/bo/orderapi/v1.0/orders/passengers/delete',       //删除乘客
    loadPassengerList:'/bo/orderapi/v1.0/orders/passengers/list',       //加载乘机人列表
    upDataPassenger:'/bo/orderapi/v1.0/orders/passengers/update',       //修改乘客
    confirmPassenger:'/bosj/orderapi/v1.0/orders/confirmpassenger',     //确认乘机人信息
    //订单列表页面
    loadOrderList:'/boclj/orderapi/v1.0/orders/query',
};
module.exports = APILXD;