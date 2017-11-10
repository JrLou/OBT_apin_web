/**
 * Created by louxudong on 2017/11/10.
 */

import React, {Component} from 'react';
import css from './OrderInfoView.less';
import { HttpTool } from '../../../../../lib/utils/index.js';
import APILXD from "../../../../api/APILXD.js";
import {hasKey} from '../../tool/LXDHelp.js';
import {Button,message,Modal} from 'antd';

/**
 * 订单状态说明(页面)：
 * 0：订单取消 1：等待确认 2：待付订金 3：待付款 5：待付尾款 7：已出票 8：订单关闭
 * 12：已付款（未录乘机人） 13：等待出票 14：支付审核中 15：支付审核失败
 */

class OrderInfoView extends Component{
    constructor(props){
        super(props);
        this.state = {
            orderState:props.orderState,
            orderStateName:'',
            imgShow:false,
            imgUrl:'',
        };
    }

    componentDidMount(){
        //针对状态更改字段
        this.changeMsgByState();
    }

    render(){
        let {orderMsg, payMsg} = this.props;
        if(!orderMsg||!payMsg){
            return <div></div>;
        }
        return (
            <div className={css.outerBox}>
                <div className={css.orderBox}>
                    <div className={css.leftMsg}>
                        <div className={css.itemLine}>
                            <div className={css.itemTitle}>订单状态：</div>
                            <div className={css.itemValue}>
                                {this.state.orderStateName}
                                <div className={hasKey(this.state.orderState,[2,3,5])?css.helpMsg:css.hidden}>
                                    <span
                                        style={{backgroundImage:`url(${require("../../../../images/orderForm/alert.png")})`}}
                                        className={css.helpIcon}
                                    ></span>
                                    {
                                        this.state.orderState == 3
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
                        >
                            取消订单
                        </Button>
                    </div>
                </div>
                <div className={css.payBox}>
                    {this.getPayView(payMsg)}
                    {
                        hasKey(this.state.orderState,[0,8])
                        ?   <div className={css.itemLinePay}>
                                <div className={css.payTitle}>订单关闭：</div>
                                {
                                    this.state.orderState == 0
                                    ?'用户取消订单'
                                    :'关闭原因（再讨论）'
                                }
                                {`(关闭时间：XXXXXXXX)`}
                            </div>
                        :   ''
                    }
                </div>
                <Modal
                    visible={this.state.imgShow}
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                           imgShow:false,
                        });
                    }}
                >
                    <img src={this.state.imgUrl} className={css.imgShow}/>
                </Modal>
            </div>
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
        let scorePay = null;
        let otherPay = null;
        let payName = '';
        for(let key in data.records){
            let payType = parseInt(data.records[key].payType);
            switch(payType){
                case 0:otherPay = data.records[key];
                        payName = '线下支付';
                        break;
                case 1:otherPay = data.records[key];
                        payName = '支付宝';
                        break;
                case 2:otherPay = data.records[key];
                        payName = '微信';
                        break;
                case 3:otherPay = data.records[key];
                        payName = '银联';
                        break;
                case 4:scorePay = data.records[key];
                        break;
                default:break;
            }
        }

        let voucherUrl = otherPay.voucherUrl?otherPay.voucherUrl:'';

        return(
            <div className={css.itemLinePay}>
                <div className={css.payTitle}>
                    {data.payStatus == 1?'':'待'}
                    {paymentName}
                </div>
                <div className={css.payValue}>
                    {`¥${data.amount}`}
                    <span>&nbsp;&nbsp;</span>
                    {scorePay?`积分抵扣(¥${scorePay.payAmount})`:''}
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
}

OrderInfoView.contextTypes = {
    router: React.PropTypes.object
};
module.exports = OrderInfoView;