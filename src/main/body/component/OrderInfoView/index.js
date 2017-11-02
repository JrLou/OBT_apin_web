/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component} from "react";
import {DatePicker,Button,Select,Table} from "antd";
import css from "./index.less";

const monthFormat = 'YYYY年MMMD日';
import moment from 'moment';
const Option = Select.Option;
const {Column, ColumnGroup} = Table;
/**
 * 等待确认资源中 1
 * 待付订金      2
 * 待付尾款      3
 * 待付款        4
 * 已付尾款      5
 * 等待出票      6
 * 已出票        7
 * 订单取消      8
 * 订单关闭      9
 * 我的需求      0
 */
class OrderInfoView extends Component {

    constructor(props) {
        super(props);
    }

    getBottom(type,data){
        switch (type){
            case 2:
            {/*待付订金*/}
               return(
                   <div className={css.bottom}>
                       支付订金：
                       <font style={{color:"red"}}>{"¥"+data&&data.deposit?data.deposit:""}</font>
                   </div>
                   );
            case 3:
            {/*待付尾款*/}
                return(<div className={css.bottom}>
                    {this.getPayDeposit(data)}
                    <div>支付尾款：
                        <font style={{color:"red"}}>{"¥"+data&&data.tailMoney?data.tailMoney:""}</font>
                        支付截止日：{data&&data.endTailTime?data.endTailTime:""}</div>
                </div>);
            case 4:
            {/*待付款*/}
                return(
                <div className={css.bottom}>
                    <div>待支付总金额：
                        <font style={{color:"red"}}>{"¥"+data&&data.totalMoney?data.totalMoney:""}</font>
                        支付截止日：{data&&data.endTime?data.endTime:""}</div>
                </div>);
            case 5,6,7:
            {/*已付尾款*/}{/*等待出票*/}{/*已出票*/}
                return(
                <div className={css.bottom}>
                    {this.getPayDeposit(data)}
                    {this.getPayTailMoney(data)}
                </div>);
            case 8:
            {/*订单取消*/}
                return(
                <div className={css.bottom}>
                    {this.getPayDeposit(data)}
                    {this.getPayTailMoney(data)}
                    <div>订单关闭：用户取消订单（关闭时间 {data&&data.closeTime?data.closeTime:""}）</div>
                </div>);
            case 9:
            {/*订单关闭*/}
                return(
                <div className={css.bottom}>
                    {this.getPayDeposit(data)}
                    {this.getPayTailMoney(data)}
                    <div>订单关闭：{data&&data.closeReason?data.closeReason:""}（关闭时间 {data&&data.closeTime?data.closeTime:""}）</div>
                </div>
            );
            default:
                null;
        }
    }

    getPayDeposit(data){
        return(
            <div>支付订金：
                <font style={{color:"red"}}>{"¥"+data&&data.deposit?data.deposit:""}</font>
                {"（支付方式："+data&&data.paymentMethod?data.paymentMethod:""}
                {"支付时间："+data&&data.payTime?data.payTime:""+"）"}
                </div>
        );
    }

    getPayTailMoney(data){
        return(
            <div>
            <div>支付尾款：
                <font style={{color:"red"}}>{"¥"+data&&data.tailMoney?data.tailMoney:""}</font>
                积分抵扣（¥{data&&data.integral?data.integral:""}）
                {"（支付方式："+data&&data.paymentTailMethod?data.paymentTailMethod:""}
                {"支付时间："+data&&data.payTailTime?data.payTailTime:""+"）"} </div>
                <div>支付凭证： <img className={css.img} src={require("../../../../images/login_check.png")}/></div>
            </div>
                );
    }

    getMessage(type,data){
        switch (type){
            case 1,2,3,4,6,7,8,9:
                return(
                    <div className={css.messageLayout}>
                        <img className={css.img} src={require("../../../../images/login_check.png")}/>
                        <font style={{verticalAlign:"middle"}}>{data&&data.message?data.message:""}</font>
                    </div>
                );
            default:
                null;
        }
    }

    getButton(type){
        switch (type){
            case 0:
                return(
                    <div className={css.buttonLayout}>
                        <Button className={css.detailButton}>查看订单详情</Button>
                    </div>
                );
            case 1,2,3,4,6,7,8,9:
                return(
                    <div className={css.buttonLayout}>
                        <Button>取消订单</Button>
                    </div>
                );
            default:
                return(
                    <div className={css.emptyButton}/>
                );
        }

    }

    render(){
        let {data, type} = this.props;
        return(
            <div>
                <div className={css.title}>订单信息</div>
                <div className={css.line}/>
                <div className={css.content}>
                    <div className={css.mainTextLayout}>
                            <font className={css.mainTitlt}>订单状态：</font>
                            <font className={css.mainContent}>{data&&data.status?data.status:""}</font>
                        <br/>
                        <div>{this.getMessage(type,data)}</div>
                            <font className={css.mainTitlt}>订单号：</font>
                            <font className={css.mainContent1}>{data&&data.orderNo?data.orderNo:""}</font>
                        <br/>
                            <font className={css.mainTitlt}>创建时间：</font>
                            <font className={css.mainContent}>{data&&data.createTime?data.createTime:""}</font>
                        <br/>
                            <font className={css.mainTitlt}>成人价格：</font>
                            <font className={css.mainContent}>{data&&data.adultMoney?data.adultMoney:""}</font>
                        <br/>
                            <font className={css.mainTitlt}>儿童价格：</font>
                            <font className={css.mainContent}>{data&&data.childrenMoney?data.childrenMoney:""}</font>
                        <br/>
                            <font className={css.mainTitlt}>航班人数：</font>
                            <font className={css.mainContent}>{data&&data.totalNum?data.totalNum:""+"人（"}{data&&data.adultNum?data.adultNum:""+"成人，"}{data&&data.childrenNum?data.childrenNum:""+"儿童）"}</font>
                    </div>

                    <div className={css.moneyLayout}>
                        <font style={{fontSize:10}}>{type===0||type===1?"参考价（含税）":"订单总金额"}</font>
                        <font style={{color:"red",fontSize:10}}>¥</font>
                        <font style={{color:"red",fontSize:20}}>{data&&data.totalMoney?data.totalMoney:"0"}</font>
                    </div>

                    {this.getButton(type)}



                </div>
                <div>
                    {this.getBottom(type,data)}
                </div>








            </div>
        );
    }


}

module.exports = OrderInfoView;






