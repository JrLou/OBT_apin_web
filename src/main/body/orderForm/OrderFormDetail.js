/**
 * Created by louxudong on 2017/10/30.
 */
import React, {Component} from 'react';
import css from './OrderFormDetail.less';
import { HttpTool } from '../../../../lib/utils/index.js';
import APILXD from "../../../api/APILXD.js";
import {hasKey,getFlightData,transformOrderState} from '../tool/LXDHelp.js';
import {Spin,message} from 'antd';
import TitleBar from './TitleBar/index.js';
import Passengers from './Passengers/index.js';
import CellNewFlight from '../content/cell/CellNewFlight.js';
import OrderInfoView from './OrderInfoView/index.js';
import PayBottom from './PayBottom/PayBottomForDetail.js';

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
        //模拟随机状态
        // let random = Math.floor(Math.random()*11);
        // let list = [0,1,2,3,5,7,8,12,13,14,15];

        this.state = {
            orderId:window.app_getPar(this).id,         //订单ID
            // orderId:'16b3639900f54a86b9116af77b088d75',         //订单ID
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

        //启动页面滚动监听
        setTimeout(()=>{this.listenScroll();},1000);
        // this.listenScroll();
    }

    listenScroll(){
        // let markDiv = document.getElementById('markDiv');
        // let rootDiv = document.getElementById('root');
        // log('启动监听---------------------');
        // log(markDiv);
        // //监听页面滚动
        // window.onscroll = ()=>{
        //     //根元素的整个高度   （不是body）
        //     let rootDivHeight = window.getComputedStyle(rootDiv,'').height;
        //     //标记div顶端 到 body顶端 的距离（body顶端 与root元素顶端位置相同）
        //     let markDivTop = markDiv.offsetTop;
        //     //浏览器窗口可视高度
        //     let windowHeight = window.screen.clientHeight;
        //     log(windowHeight);
        // };
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
                    <div className={css.itemContentBigPadding}>
                        <CellNewFlight
                            dataSource = {this.state.flightData}
                            isNoShowRule={false}
                        />
                    </div>
                </div>
                    {
                        //因为待付押金状态不能录入乘机人，待付押金的审核中和审核失败也不能。需要接口返回的真实状态辅助判断（区分页面的2，3，5）
                        (hasKey(this.state.orderState,[0,3,5,7,8,12,13])||hasKey(this.state.returnState,[3,5]))
                        ?   <div className={css.itemContainer}>
                                <Passengers
                                    orderState={this.state.orderState}
                                    returnState={this.state.returnState}
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
                <div id={'markDiv'}></div>
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
            window.app_open(this,'/OrderFormList',{});
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
                isPassed:json.passed?json.passed:false,
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
        let state = transformOrderState(returnState,extraCode);

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
            reason:data.failReason,
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
            payAmount:data.payAmount,
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