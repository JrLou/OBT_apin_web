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
import OrderInfoView from './OrderInfoView/index.js';
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
            // orderState:list[random],       //页面订单状态
            orderState:8,       //页面订单状态
            isPassed:false,     //乘机人信息是否已经确认
            flightData:null,    //航班信息
            orderMsg:null,      //订单信息
            payMsg:null,        //支付明细
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

        //模拟数据
        let orderMsg = {
            orderNo:'123123123123132',
            adultCount:3,
            adultPrice:3450,
            childCount:7,
            childPrice:1200,
            createdTime:'2017-03-24 14:29',
            expiredTime:'2017-04-10 18:00',
            orderAmount:'12333',
        };
        let payMsg = [
            {
                amount:783,
                expiredTime:'2017-04-10',
                payStatus:1,
                payment:1,
                records:[
                    {
                        auditStatus:1,
                        payAmount:3333,
                        payTime:'2017-03-230',
                        payType:0,
                        remark:'',
                        voucherUrl:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1510342176710&di=9f2237f38d03b8d8e1fa31f69093d35f&imgtype=0&src=http%3A%2F%2Fwww.myexception.cn%2Fimg%2F2015%2F07%2F07%2F210245743.png,https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1510342176710&di=20c575c39bd83ef538b99bd64e72d2c5&imgtype=0&src=http%3A%2F%2Fimages.cnitblog.com%2Fblog%2F685350%2F201411%2F011904149566976.jpg',
                    }
                ],
            },
            {
                amount:4783,
                expiredTime:'2017-04-10',
                payStatus:1,
                payment:2,
                records:[
                    {
                        auditStatus:1,
                        payAmount:3333,
                        payTime:'2017-03-230',
                        payType:1,
                        remark:'',
                        voucherUrl:'',
                    },
                    {
                        auditStatus:1,
                        payAmount:33,
                        payTime:'2017-03-230',
                        payType:4,
                        remark:'',
                        voucherUrl:'',
                    }
                ],
            }
        ];
        this.setState({
            orderMsg:orderMsg,
            payMsg:payMsg,
        });


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
                    <div className={css.itemTitle}>订单信息</div>
                        <OrderInfoView
                            orderState={this.state.orderState}
                            orderMsg={this.state.orderMsg}
                            payMsg={this.state.payMsg}
                        />
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