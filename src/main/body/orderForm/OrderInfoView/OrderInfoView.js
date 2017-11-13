/**
 * Created by louxudong on 2017/11/10.
 */

import React, {Component} from 'react';
import css from './OrderInfoView.less';
import { HttpTool } from '../../../../../lib/utils/index.js';
import APILXD from "../../../../api/APILXD.js";
import {hasKey} from '../../tool/LXDHelp.js';
import {Button,message,Modal,Spin,Icon} from 'antd';

/**
 * 订单状态说明(页面)：
 * 0：订单取消 1：等待确认 2：待付订金 3：待付款 5：待付尾款 7：已出票 8：订单关闭
 * 12：已付款（未录乘机人） 13：等待出票 14：支付审核中 15：支付审核失败
 */

class OrderInfoView extends Component{
    constructor(props){
        super(props);
        this.state = {
            orderState:this.props.orderState,
            orderStateName:'',
            imgShow:false,          //查看图片模态框
            imgUrl:'',
            confirmModal:false,     //取消订单询问框
            loading:false,          //加载状态
        };
    }

    componentDidMount(){
        //针对状态更改字段
        this.changeMsgByState();
    }

    render(){
        let {orderMsg, payMsg} = this.props;
        if(!orderMsg){
            return <div></div>;
        }
        return (
            <Spin
                spinning={this.state.loading}
            >
            <div className={css.outerBox}>
                <div className={css.orderBox}>
                    <div className={hasKey(this.state.orderState,[1,2,3,5,14,15])?css.leftMsg:css.boxNoBorder}>
                        <div className={css.itemLine}>
                            <div className={css.itemTitle}>订单状态：</div>
                            <div className={css.itemValue}>
                                {this.state.orderStateName}
                                <div className={
                                    (hasKey(this.state.orderState,[2,3,5]) && orderMsg.expiredTime)
                                        ?css.helpMsg
                                        :css.hidden
                                }
                                >
                                    <span
                                        style={{backgroundImage:`url(${require("../../../../images/orderForm/alert.png")})`}}
                                        className={css.helpIcon}
                                    ></span>
                                    {
                                        (this.state.orderState == 3)
                                        ?`请在${orderMsg.expiredTime}之前支付款`
                                        :`请在${orderMsg.expiredTime}之前支付尾款`
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={css.itemLine}>
                            <div className={css.itemTitle}>订单号：</div>
                            <div className={css.itemValue}>{orderMsg.orderNo}</div>
                        </div>
                        <div className={css.itemLine}>
                            <div className={css.itemTitle}>创建时间：</div>
                            <div className={css.itemValue}>{orderMsg.createdTime}</div>
                        </div>
                        <div className={css.itemLine}>
                            <div className={css.itemTitle}>成人价格：</div>
                            <div className={css.itemValue}>{`¥${orderMsg.adultPrice}`}</div>
                        </div>
                        <div className={css.itemLine}>
                            <div className={css.itemTitle}>儿童价格：</div>
                            <div className={css.itemValue}>{`¥${orderMsg.childPrice}`}</div>
                        </div>
                        <div className={css.itemLine}>
                            <div className={css.itemTitle}>航班人数：</div>
                            <div className={css.itemValue}>
                                {`${parseInt(orderMsg.adultCount)+parseInt(orderMsg.childCount)}人（${orderMsg.adultCount}成人，${orderMsg.childCount}儿童）`}
                            </div>
                        </div>
                        <div className={css.priceItem}>
                            <span className={css.priceTitle}>订单总金额</span>
                            <span className={css.priceTip}>¥</span>
                            <span className={css.priceValue}>{orderMsg.orderAmount}</span>
                        </div>
                    </div>
                    <div className={hasKey(this.state.orderState,[1,2,3,5,14,15])?css.rightMsg:css.hidden}>
                        <Button
                            onClick={()=>{
                                //订单取消
                                this.setState({
                                    confirmModal:true,
                                });
                            }}
                        >
                            取消订单
                        </Button>
                    </div>
                </div>
                <div className={payMsg?css.payBox:css.hidden}>
                    {this.getPayView(payMsg)}
                    {
                        hasKey(this.state.orderState,[0,8])
                        ?   <div className={css.itemLinePay}>
                                <div className={css.payTitle}>订单关闭：</div>
                                {
                                    this.state.orderState == 0
                                    ?'用户取消订单'
                                    :orderMsg.closeReason
                                }
                                {`(关闭时间：${orderMsg.closetime})`}
                            </div>
                        :   ''
                    }
                </div>
                <Modal
                    visible={this.state.imgShow}
                    closable={false}
                    footer={null}
                    width={0}
                    onCancel={()=>{
                        this.setState({
                            imgShow:false,
                        });
                    }}
                >
                    <div>
                        <img
                            src={this.state.imgUrl}
                            onError={()=>{
                                //添加默认的图片
                                this.state.imgUrl = require('../../../../images/default.png');
                            }}
                            className={css.imgShow}
                        />
                        <div
                            className={css.closeImgBtn}
                            onClick={()=>{
                                this.setState({
                                    imgShow:false,
                                });
                            }}
                        ><Icon
                            style={{
                                fontSize:'35px',
                                cursor:'pointer',
                                backgroundColor:'#fff',
                                borderRadius:'50%',
                            }}
                            type="close-circle-o"
                        /></div>
                    </div>
                </Modal>
                <Modal
                    prefixCls={'my-ant-modal'}
                    title={'提示'}
                    visible={this.state.confirmModal}
                    onOk={()=>{
                        this.setState({
                            confirmModal:false,
                        },()=>{this.cancelOrder(orderMsg.orderId);});
                    }}
                    onCancel={()=>{
                        this.setState({
                            confirmModal:false,
                        });
                    }}
                >
                    {
                        this.state.orderState == 5
                            ?   (<div className={css.messageBox}>
                                    <div>是否确定要取消此行程订单？</div>
                                    <div>订单取消后将不退还订金</div>
                                </div>)
                            :   (<div className={css.messageBox}>
                                    是否确定取消此订单？
                                </div>)
                    }
                </Modal>
            </div>
            </Spin>
        );
    }

    /**
     * 绘制支付明细视图
     * @param payMsg
     */
    getPayView(payMsg){
        let viewArray = [];
        if(payMsg instanceof Array){
            for(let key in payMsg){
                viewArray.push(<div key={`item${key}`}>{this.getPayItemDetail(payMsg[key])}</div>);
            }
        }
        return viewArray;
    }

    /**
     * 单条支付记录
     * @param data
     */
    getPayItemDetail(data){
        if(!data){return;}
        let payment = parseInt(data.payment);
        let paymentName = '';
        switch(payment){
            case 0:paymentName = '支付全款:';break;
            case 1:paymentName = '支付订金:';break;
            case 2:paymentName = '支付尾款:';break;
            case 3:paymentName = '退回全款:';break;
            case 4:paymentName = '退回订金:';break;
            case 5:paymentName = '退回尾款:';break;
            default:break;
        }

        //是否有积分支付
        let scorePay = parseInt(data.pointsAmount);
        let otherPay = null;
        let payName = '';
        let voucherUrl = '';
        if(data.records.length>0){
            let payType = parseInt(data.records[0].payType);
            switch(payType){
                case 0:otherPay = data.records[0];
                        payName = '线下支付';
                        break;
                case 1:otherPay = data.records[0];
                        payName = '支付宝';
                        break;
                case 2:otherPay = data.records[0];
                        payName = '微信';
                        break;
                case 3:otherPay = data.records[0];
                        payName = '银联';
                        break;
                default:break;
            }

            voucherUrl = otherPay.voucherUrl?otherPay.voucherUrl:'';
        }

        return(
            <div className={css.itemLinePay}>
                <div className={css.payTitle}>
                    {data.payStatus == 1?'':'待'}
                    {paymentName}
                </div>
                <div className={css.payValue}>
                    {`¥${data.amount}`}
                    <span>&nbsp;&nbsp;</span>
                    {scorePay>0?`积分抵扣(¥${scorePay})`:''}
                </div>
                {
                    data.payStatus == 1
                    ?   (<div className={css.payType}>
                            {`(支付方式：${payName}`}
                            <span>&nbsp;&nbsp;</span>
                            {`支付时间：${otherPay.payTime})`}
                        </div>)
                    :   (<div className={css.payType}>
                            {data.exexpiredTime?`支付截止日期：${data.exexpiredTime}`:''}
                        </div>)
                }
                {
                    voucherUrl
                    ?   <div className={css.payVoucher}>
                            <span>支付凭证</span>
                            {this.getPayVoucher(voucherUrl)}
                            {
                                otherPay.auditStatus == 2
                                ?   <div className={css.reUpload}>
                                        <Button
                                            onClick={()=>{
                                                window.app_open(this,'/UpLoad',{
                                                    orderId:data.orderId,
                                                    id:data.id,
                                                });
                                            }}
                                        >
                                            重新上传
                                        </Button>
                                    </div>
                                :   ''
                            }
                        </div>
                    :''
                }

            </div>
        );
    }

    /**
     * 支付凭证
     */
    getPayVoucher(voucherUrl){
        let urlList = voucherUrl.split(',');
        let views = [];
        for(let key in urlList){
            let imgUrl = urlList[key];
            if(imgUrl){
                views.push(
                    <img
                        key={`img${key}`}
                        src={imgUrl}
                        alt="支付凭证"
                        className={css.voucherImg}
                        onClick={()=>{
                            this.getImgShow(imgUrl);
                        }}
                    />
                );
            }
        }

        return views;
    }

    /**
     * 展示图片
     * @param imgUrl
     */
    getImgShow(imgUrl){
        this.setState({
            imgUrl:imgUrl,
            imgShow:true,
        });
    }

    changeMsgByState(){
        let title = '';
        let state = parseInt(this.state.orderState);
        switch(state){
            case 0:title='订单取消';
                break;
            case 1:title='等待确认';
                break;
            case 2:title='待付订金';
                break;
            case 3:title='待付款';
                break;
            case 5:title='待付尾款';
                break;
            case 7:title='已出票';
                break;
            case 8:title='订单关闭';
                break;
            case 12:title='已付款（未录乘机人）';
                break;
            case 13:title='等待出票';
                break;
            case 14:title='支付审核中';
                break;
            case 15:title='支付审核失败';
                break;
            default:break;
        }
        this.setState({
            orderStateName:title,
        });
    }

    /**
     * 取消订单
     * @param id
     */
    cancelOrder(id){
        let parames = {
            id:id,
            orderStatus:0,
            remark:'',
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
            HttpTool.request(HttpTool.typeEnum.POST,APILXD.cancelOrder, successCB, failureCB, parames,
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

OrderInfoView.contextTypes = {
    router: React.PropTypes.object
};
module.exports = OrderInfoView;