/**
 * Created by louxudong on 2017/10/30.
 */
import React, {Component} from 'react';
import css from './OrderFormDetail.less';
import { HttpTool,CookieHelp } from '../../../../lib/utils/index.js';
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
 * 0：订单取消 1：等待确认 2：待付押金 3：待付款 5：待付尾款 7：已出票 8：订单关闭
 * 12：已付款（未录乘机人） 13：等待出票 14：支付审核中 15：支付审核失败
 *
 * 接口可能返回的值：
 * 0：订单取消 1：等待确认 2：待付押金 3：待付全款 5：待付尾款 7：已出票 8：已关闭
 */



class OrderFormDetail extends Component{
    constructor(props){
        super(props);
        CookieHelp.saveUserInfo({
            Authorization:"eyJpZCI6IjAzN2E2MmI1M2M5ZjQ0MDZhZTQzMjA3NTVmNGY2ZmZiIiwiYXBwSWQiOiIyZWY4ZDkwMmMxMmY0NTRmOWFjZGJiMDQ4NGY4YzA1YSIsImFjY291bnRJZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsInVzZXJJZCI6IjY2ZTUzZTFkMmFjMDQwMGNiMTFjYjc5ZTFlOTU5YWU3IiwiZGVwdElkIjpudWxsLCJ1c2VyTmFtZSI6Iui2hee6p+euoeeQhuWRmCIsInNlY3JldCI6IjU0MDBiYjQ3NDBmZjNjOWEyYWI1ZWNiN2UxOWJkZTY4In0=",
        });
        //模拟随机状态
        // let random = Math.floor(Math.random()*11);
        // let list = [0,1,2,3,5,7,8,12,13,14,15];

        this.state = {
            // orderId:window.app_getPar(this).id,         //订单ID
            orderId:'16b3639900f54a86b9116af77b088d75',         //订单ID
            returnState:'',          //接口返回的订单状态  （接口返回的状态需要经过转换才赋值给状态机）
            orderState:'',       //页面订单状态
            isPassed:false,     //乘机人信息是否已经确认
            airlineSigns:1,     //航线类型   1：国内   2：国际

            titleData:null,     //头部导航信息
            flightData:null,    //航班信息
            orderMsg:null,      //订单信息
            payMsg:null,        //支付明细
            bottomData:null,    //底部浮动支付信息

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
        // let orderMsg = {
        //     orderId:'10000059f39c5427ca5f749604a09de39',
        //     orderNo:'123123123123132',
        //     adultCount:3,
        //     adultPrice:3450,
        //     childCount:7,
        //     childPrice:1200,
        //     createdTime:'2017-03-24 14:29',
        //     expiredTime:'2017-04-10 18:00',
        //     orderAmount:'12333',
        // };
        // let payMsg = [
        //     {
        //         amount:783,
        //         expiredTime:'2017-04-10',
        //         payStatus:1,
        //         orderId:'1231231231',
        //         id:'3232323233',
        //         payment:1,
        //         records:[
        //             {
        //                 auditStatus:2,
        //                 payAmount:3333,
        //                 payTime:'2017-03-230',
        //                 payType:0,
        //                 remark:'',
        //                 voucherUrl:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1510342176710&di=9f2237f38d03b8d8e1fa31f69093d35f&imgtype=0&src=http%3A%2F%2Fwww.myexception.cn%2Fimg%2F2015%2F07%2F07%2F210245743.png,https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1510342176710&di=20c575c39bd83ef538b99bd64e72d2c5&imgtype=0&src=http%3A%2F%2Fimages.cnitblog.com%2Fblog%2F685350%2F201411%2F011904149566976.jpg',
        //             }
        //         ],
        //     },
        //     {
        //         amount:4783,
        //         expiredTime:'2017-04-10',
        //         payStatus:1,
        //         payment:2,
        //         records:[
        //             {
        //                 auditStatus:1,
        //                 payAmount:3333,
        //                 payTime:'2017-03-230',
        //                 payType:1,
        //                 remark:'',
        //                 voucherUrl:'',
        //             },
        //             {
        //                 auditStatus:1,
        //                 payAmount:33,
        //                 payTime:'2017-03-230',
        //                 payType:4,
        //                 remark:'',
        //                 voucherUrl:'',
        //             }
        //         ],
        //     }
        // ];
        // this.setState({
        //     orderMsg:orderMsg,
        //     payMsg:payMsg,
        // });


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
                <div className={css.noMessage}>
                    <Spin size={'large'}></Spin>
                </div>
            );
        }
        return(
            <div className={css.mainPage}>
                <Spin
                    size={'large'}
                    spinning={this.state.loading}
                >
                <TitleBar
                    orderId={this.state.orderId}
                    orderState={this.state.orderState}
                    titleData={this.state.titleData}
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
                                    airlineSigns={this.state.airlineSigns}
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
                        payType={this.state.orderState}
                        param={this.state.bottomData}
                        btnAction={this.openPayPage.bind(this)}
                    />
                    :''
                }
                </Spin>
            </div>
        );
    }

    /**
     * 订单删除
     */
    deleteOrderCB(){
        let parames = {
            id:this.state.orderId,
        };
        let successCB = (code, msg, json, option)=>{
            this.setLoading(false);
            message.success(msg);
            //刷新页面
            window.location.reload();
        };
        let failureCB = (code, msg, option)=>{
            this.setLoading(false);
            message.error(msg);
        };
        this.setLoading(true,()=>{
            HttpTool.request(HttpTool.typeEnum.POST,APILXD.deleteOrder, successCB, failureCB, parames,
                {
                    ipKey: "hlIP"
                });
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
            log('=========请求订单详情结果>>>>>>>>>>>>>>>');
            log(json);
            if(!json){
                //如果信息为空，则跳转到404
                window.app_open(this,'/None',{});
            }
            let resultData = getFlightData(json.voyages,json.flightType,json.freeBag,json.weightLimit);
            let titleData = this.getTitleData(json);
            let orderMsg = this.getOrderMsg(json);
            let payMsg = json.pays?json.pays:[];
            let bottomData = this.getBottomData(json);
            let orderState = this.getOrderState(json);
            let airlineSigns = json.airlineSigns?json.airlineSigns:1;

            this.setLoading(false);
            this.setState({
                titleData:titleData,
                flightData:resultData,
                orderMsg:orderMsg,
                payMsg:payMsg,
                bottomData:bottomData,
                orderState:orderState,
                returnState:json.orderStatus,
                airlineSigns:airlineSigns,
            });
        };
        let failureCB = (code, msg, option)=>{
            this.setLoading(false);
            if(code == -500){
                //服务端错误
                window.app_open(this,'/None',{});
            }
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

    /**
     * 根据后端返回到orderStatus和extraCode判断页面状态
     * @param data
     * @return state
     */
    getOrderState(data){
        let returnState = parseInt(data.orderStatus);
        let extraCode = parseInt(data.extraCode);
        let state = '';
        switch(returnState){
            case 0:state = 0;break;
            case 1:state = 1;break;
            case 2:if(extraCode==0){
                        state = 14;
                    }else if(extraCode ==1){
                        state = 15;
                    }else{
                        state = 2;
                    }
                    break;
            case 3:if(extraCode==0){
                        state = 14;
                    }else if(extraCode ==1){
                        state = 15;
                    }else{
                        state = 3;
                    }
                    break;
            case 4:if(extraCode==5){
                        state = 3;
                    }else if(extraCode ==6){
                        state = 2;
                    }else{
                        state = 4;
                    }
                    break;
            case 5:if(extraCode==0){
                        state = 14;
                    }else if(extraCode ==1){
                        state = 15;
                    }else{
                        state = 5;
                    }
                    break;
            case 6:if(extraCode==2){
                        state = 12;
                    }else if(extraCode ==3){
                        state = 13;
                    }
                    break;
            case 7:state = 7;break;
            case 8:state = 8;break;
        }
        return state;
    }

    /**
     * 从详情信息中得到订单信息
     * @param data
     * @returns orderMsg
     */
    getOrderMsg(data){
        let orderMsg = {
            orderId:data.id,
            orderNo:data.orderNo,
            adultCount:data.adultCount,
            adultPrice:data.adultPrice,
            childCount:data.childCount,
            childPrice:data.childPrice,
            createdTime:data.createdTime,
            expiredTime:data.expiredTime,
            orderAmount:data.orderAmount,
            closeReason:data.remark,
            closetime:data.closetime,
        };
        return orderMsg;
    }

    /**
     * 从详情信息中得到头部信息
     * @param data
     * @returns titleData
     */
    getTitleData(data){
        let titleData = {
            deadLine:data.expiredTime,
            reason:data.remark,
        };
        return titleData;
    }

    /**
     * 从详情信息中得到头部信息
     * @param data
     * @returns bottomData
     */
    getBottomData(data){
        let bottomData = {
            orderPrice:data.orderAmount,
            totalPrice:data.orderAmount,
            adultPrice:data.adultPrice,
            childPrice:data.childPrice,
            childCount:data.childCount,
            adultCount:data.adultCount,
            countDown:data.countDown,
        };
        return bottomData;
    }

    /**
     * 打开支付页面
     */
    openPayPage(){
        window.app_open(this,'/Pay',{id:this.state.orderId});
    }
}

OrderFormDetail.contextTypes = {
    router: React.PropTypes.object
};
module.exports = OrderFormDetail;