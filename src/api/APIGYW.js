/**
 * Created by apin on 2017/10/16.
 */
let APIGYW = {
    /**
     * 城市对搜索
     */
    flightapi_flight_query:     "/ba/flightapi/v1.0/flight/query",
    manageapi_arrCity_list:     "/ba/manageapi/v1.0/arrCity/list",
    manageapi_bestList:         "/ba/manageapi/v1.0/bestList",
    manageapi_depCity_list:     "/ba/manageapi/v1.0/depCity/list",
    manageapi_list:             "/ba/manageapi/v1.0/list",
    /**
     * 根据城市对与出发日期结束日期查询航班详情
     */
    flightapi_flightDetail_query:       "/ba/flightapi/v1.0/flightDetail/query",
    flightapi_flightDetail_month_query: "/ba/flightapi/v1.0/flightDetail/month/query",  //左日历月份
    flightapi_retFlight_month_query:    "/ba/flightapi/v1.0/retFlight/month/query",     //右日历月份
    flightapi_flightDetail_day_query:   "/ba/flightapi/v1.0/flightDetail/day/query",    //左日期
    /**
     * 根据城市对与出发日期查询航班 右日期
     */
    flightapi_flights_query:            "/ba/flightapi/v1.0/flights/query",
    flightapi_orderDetail_query:        "/ba/flightapi/v1.0/orderDetail/query",         //订单详情页  
    orderapi_orders_create:             "/bo/orderapi/v1.0/orders/create",              //新增订单

    /**
     * 需求相关接口
     */
    demandapi_demands:  "/bo/demandapi/v1.0/demands/create",            //新增需求
    demand_list:        "/bo/demandapi/v1.0/demands/query",             //需求列表
    demand_detail:      "/bo/demandapi/v1.0/demands/find",              //需求详情
    demand_cancel:      "/bo/demandapi/v1.0/demands/cancel",            //需求取消
    demand_remove:      "/bo/demandapi/v1.0/demands/remove",            //需求删除
    demand_confirm:     "/bo/demandapi/v1.0/demands/plans/confirm",     //需求确认

    /**
     * 审核相关接口
     * 
    */
    pay_recordQuery:    "/bo/orderapi/v1.0/orders/recordQuery",         //凭证审核记录查询
    pay_offline:        "/bo/orderapi/v1.0/orders/pay/offline",         //首次  上传凭证
    pay_reOffine:       "/bo/orderapi/v1.0/orders/pay/reOffine",        //再次  上传修改凭证
    /**
     * 公共服务接口
    */
    lineapi_lines_new:  "/ba/lineapi/v1.0/lines/new",
    cities_list_key:    "/ba/baseapi/v1.0/cities/list/key",
        
};
module.exports = APIGYW;