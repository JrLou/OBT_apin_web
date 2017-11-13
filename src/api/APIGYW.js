/**
 * Created by apin on 2017/10/16.
 */
let APIGYW = {
    /**
     * 城市对搜索
     */
    flightapi_flight_query: "/ba/flightapi/v1.0/flight/query",

    /**
     * 根据城市对与出发日期结束日期查询航班详情
     */
    flightapi_flightDetail_query: "/ba/flightapi/v1.0/flightDetail/query",


    //左日历月份
    flightapi_flightDetail_month_query: "/ba/flightapi/v1.0/flightDetail/month/query",

    //右日历月份
    flightapi_retFlight_month_query: "/ba/flightapi/v1.0/retFlight/month/query",

    //左日期
    flightapi_flightDetail_day_query: "/ba/flightapi/v1.0/flightDetail/day/query",

    /**
     * 根据城市对与出发日期查询航班 右日期
     */
    flightapi_flights_query: "/ba/flightapi/v1.0/flights/query",

    /**
     * 订单详情页
     */
    flightapi_orderDetail_query: "/ba/flightapi/v1.0/orderDetail/query",

    /**
     * 新增订单
     */
    orderapi_orders_create: "/orderapi/v1.0/orders/create",

    /**
     * 提交需求
     */
    //demandapi_demands: "/demandapi/v1.0/demands"
    demandapi_demands: "/bo/demandapi/v1.0/demands/create",

    /**
     * 需求列表
     */
    demand_list:"/bo/demandapi/v1.0/demands/query",

    /**
     * 需求详情
     */
    demand_detail: "/bo/demandapi/v1.0/demands/find",
    /**
     * 需求取消
     */
    demand_cancel: "/bo/demandapi/v1.0/demands/cancel",
    /**
     * 需求删除
     */
    demand_remove: "/bo/demandapi/v1.0/demands/remove",
    /**
     * 需求确认
     */
    demand_confirm: "/bo/demandapi/v1.0/demands/confirm",
};
module.exports = APIGYW;