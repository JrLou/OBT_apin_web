/**
 * Created by louxudong on 2017/10/30.
 */
import React, {Component} from 'react';
import css from './OrderFormDetail.less';
import { HttpTool } from '../../../../lib/utils/index.js';
import APILXD from "../../../api/APILXD.js";
import {hasKey,getFlightData} from '../tool/LXDHelp.js';
import {Spin,message} from 'antd';
import TitleBar from './TitleBar/index.js';
import Passengers from './Passengers/index.js';
import CellNewFlight from '../content/cell/CellNewFlight.js';
import OrderInfoView from '../component/OrderInfoView/index.js';
import PayBottom from '../content/detail/detailComp/PayBottomForDetail.js';

/**
 * 订单状态说明(页面)：
 * 0：订单取消 1：等待确认 2：待付订金 3：待付款 5：待付尾款 7：已出票 8：订单关闭
 * 12：已付款（未录乘机人） 13：等待出票 14：支付审核中 15：支付审核失败
 *
 * 接口可能返回的值：
 * 0：订单取消 1：等待确认 2：待付订金 3：待付全款 5：待付尾款 7：已出票 8：已关闭
 */



class OrderFormDetail extends Component{
    constructor(props){
        super(props);
        //模拟随机状态
        let random = Math.floor(Math.random()*11);
        let list = [0,1,2,3,5,7,8,12,13,14,15];

        this.state = {
            orderId:window.app_getPar(this).orderId,         //订单ID
            returnState:3,          //接口返回的订单状态  （接口返回的状态需要经过转换才赋值给状态机）
            orderState:list[random],       //页面订单状态
            isPassed:false,     //乘机人信息是否已经确认
            flightData:null,    //航班信息
            upDate:0,
            loading:false,      //加载状态
        };

        if(!this.state.orderId){
            //没有订单号，直接跳404页面
            window.app_open(this, "/None", {

            });
        }
    }

    componentDidMount(){
        //请求数据
        this.setLoading(true,this.loadFormDetail);

        //模拟航班数据
        // this.listData =  {
        //     "freeBag": 1,
        //     "weightLimit": 12,
        //     "voyages": [
        //         {
        //             "id": "55bee6dc4ba74392af585feb4f97edrft",
        //             "isStop": 0,
        //             "isTransit": 0,
        //             "tripIndex": 0,
        //             "flightIndex": 0,
        //             "week": 2,
        //             "compName": "杭州来自",
        //             "logo": "icollll",
        //             "arrTime": "08:30",
        //             "depTime": "06:30",
        //             "arrAirport": "顶替",
        //             "depAirport": "错位",
        //             "flightTime": "2小时 0分钟",
        //             "num": "DFE234",
        //             "depDate": "2017-11-06",
        //             "arrDate": "2017-11-06",
        //             "child": [
        //                 {
        //                     "id": "55bee6dc4ba74392af585feb4f97edrf1",
        //                     "isStop": 0,
        //                     "isTransit": 1,
        //                     "tripIndex": 0,
        //                     "flightIndex": 1,
        //                     "week": 2,
        //                     "compName": "杭州来自",
        //                     "logo": "icollll",
        //                     "arrTime": "08:30",
        //                     "depTime": "12:30",
        //                     "arrAirport": "枯井",
        //                     "depAirport": "顶替",
        //                     "flightTime": "20小时 0分钟",
        //                     "num": "WEE234",
        //                     "depDate": "2017-11-06",
        //                     "arrDate": "2017-11-06",
        //                     "child": []
        //                 },
        //                 {
        //                     "id": "55bee6dc4ba74392af585feb4f97edrf2",
        //                     "isStop": 0,
        //                     "isTransit": 1,
        //                     "tripIndex": 0,
        //                     "flightIndex": 2,
        //                     "week": 2,
        //                     "compName": "杭州来自",
        //                     "logo": "icollll",
        //                     "arrTime": "23:30",
        //                     "depTime": "21:30",
        //                     "arrAirport": "扶贫",
        //                     "depAirport": "枯井",
        //                     "flightTime": "2小时 0分钟",
        //                     "num": "ASD234",
        //                     "depDate": "2017-11-06",
        //                     "arrDate": "2017-11-06",
        //                     "child": []
        //                 }
        //             ]
        //         },
        //         {
        //             "id": "55bee6dc4ba74392af585feb4f97e120",
        //             "isStop": 0,
        //             "isTransit": 0,
        //             "tripIndex": 1,
        //             "flightIndex": 0,
        //             "week": 7,
        //             "compName": "杭州来自",
        //             "logo": "icollll",
        //             "arrTime": "08:30",
        //             "depTime": "06:30",
        //             "arrAirport": "枯井",
        //             "depAirport": "扶贫",
        //             "flightTime": "2小时 0分钟",
        //             "num": "DFE789",
        //             "depDate": "2017-11-06",
        //             "arrDate": "2017-11-06",
        //             "child": [
        //                 {
        //                     "id": "55bee6dc4ba74392af585feb4f97e121",
        //                     "isStop": 0,
        //                     "isTransit": 1,
        //                     "tripIndex": 1,
        //                     "flightIndex": 1,
        //                     "week": 7,
        //                     "compName": "杭州来自",
        //                     "logo": "icollll",
        //                     "arrTime": "08:30",
        //                     "depTime": "06:30",
        //                     "arrAirport": "顶替",
        //                     "depAirport": "枯井",
        //                     "flightTime": "2小时 0分钟",
        //                     "num": "RGT789",
        //                     "depDate": "2017-11-06",
        //                     "arrDate": "2017-11-06",
        //                     "child": []
        //                 },
        //                 {
        //                     "id": "55bee6dc4ba74392af585feb4f97e122",
        //                     "isStop": 0,
        //                     "isTransit": 1,
        //                     "tripIndex": 1,
        //                     "flightIndex": 2,
        //                     "week": 7,
        //                     "compName": "杭州来自",
        //                     "logo": "icollll",
        //                     "arrTime": "08:30",
        //                     "depTime": "06:30",
        //                     "arrAirport": "错位",
        //                     "depAirport": "顶替",
        //                     "flightTime": "2小时 0分钟",
        //                     "num": "FGB789",
        //                     "depDate": "2017-11-06",
        //                     "arrDate": "2017-11-06",
        //                     "child": []
        //                 }
        //             ]
        //         }
        //     ],
        //     "flightType": 1
        // };
        //
        // this.upView();

    }

    //更新状态机
    upView(){
        this.setState({
            upDate:this.state.upDate+1,
        });
    }

    render(){
        //仅在此处做状态异常判断，如果状态不在此列，说明出现异常，页面不展示
        if(!(hasKey(this.state.orderState,[0,1,2,3,5,7,8,12,13,14,15]))){
            return(
                <div className={css.noMessage}>订单查询中，请稍后...</div>
            );
        }
        return(
            <div className={css.mainPage}>
                <Spin
                    size={'large'}
                    spinning={this.state.loading}
                >
                <TitleBar
                    orderState={this.state.orderState}
                    deadLine={'2017-11-27'}
                    reason={'审核失败的原因'}
                    orderId={this.state.orderId}
                    onDelete={()=>{this.deleteOrderCB();}}
                />
                 <div className={css.itemContainer}>
                    <div className={css.itemTitle}>航班信息</div>
                    <div className={css.itemContent}>
                        <CellNewFlight
                            dataSource = {this.state.flightData}
                        />
                    </div>
                </div>
                    {
                        (hasKey(this.state.orderState,[0,3,5,7,8,12,13])||hasKey(this.state.returnState,[3,5]))
                        ?   <div className={css.itemContainer}>
                                <Passengers
                                    orderState={this.state.orderState}
                                    returnState={this.returnState}
                                    isPassed={this.state.isPassed}
                                    orderId={this.state.orderId}
                                    defaultData={[]}
                                />
                            </div>
                        :   <div></div>
                    }
                <div className={css.itemContainer}>
                    <div className={css.orderInfoBox}>
                        <OrderInfoView
                            type={9}
                            data={{
                                orderNo:'12312312313',
                                message:'请在XXXX之前支付',
                                createTime:'2017-03-02',
                            }}
                        />
                    </div>
                </div>
                {
                    (hasKey(this.state.orderState,[2,3,5]))
                    ?<PayBottom
                        param={{
                            orderPrice:"2333",
                            adultPrice:"2333",
                            childPrice:"2000",
                            childNum:2,
                            adultNum:1,
                            totalPrice:'33333',
                        }}
                        payType={this.state.orderState}
                        timer={3888}
                    />
                    :''
                }
                </Spin>
            </div>
        );
    }

    /**
     * 订单删除以后的回调
     */
    deleteOrderCB(){
        let parames = {};
        let successCB = (code, msg, json, option)=>{
            this.setLoading(false);
        };
        let failureCB = (code, msg, option)=>{
            this.setLoading(false);
        };
        // this.setLoading(true,()=>{
        //     HttpTool.request(HttpTool.typeEnum.GET,APILXD.XXXXXXXX, successCB, failureCB, parames,
        //         {
        //             ipKey: "hlIP"
        //         });
        // });

        //模拟接口
        this.setLoading(true,()=>{
            log(parames);
            setTimeout(()=>{
                let num = Math.random();
                if(num<0.5){
                    successCB();
                }else{
                    failureCB();
                }
            },1000);
        });
    }

    /**
     * 请求订单详情信息
     */
    loadFormDetail(){
        let parames = {
            orderId:this.state.orderId,
        };
        let successCB = (code, msg, json, option)=>{
            log('===========请求结果=========>>>>>>>>');
            log(json);
            this.setLoading(false);
            message.success(msg);
            let resultData = getFlightData(json.voyages,json.flightType,json.freeBag,json.weightLimit);
            this.setState({
                flightData:resultData,
            });
        };
        let failureCB = (code, msg, option)=>{
            this.setLoading(false);
            message.error(msg);
        };
        this.setLoading(true,()=>{
            HttpTool.request(HttpTool.typeEnum.POST,APILXD.lordOrderDetail, successCB, failureCB, parames,
                {
                    ipKey: "hlIP"
                });
        });
    }

    /**
     * 更改请求数据的状态并回调
     * @param loading
     * @param cb
     */
    setLoading(loading, cb) {
        this.setState({
            loading: loading
        }, cb);
    }

    /**
     * 返回加载的状态
     * @returns {boolean}
     */
    isLoading() {
        return this.state.loading;
    }
}

OrderFormDetail.contextTypes = {
    router: React.PropTypes.object
};
module.exports = OrderFormDetail;