/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component} from "react";
import {DatePicker, Button, Select, Table} from "antd";
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
 * 支付审核失败   10
 * 支付审核中    11
 * 我的需求      0
 */
/**
 * 订单状态  status
 * 订单号    orderNo
 * 创建时间  createTime
 * 成人价格  adultMoney
 * 儿童价格  childrenMoney
 * 航班人数  总人数 totalNum  儿童人数 adultNum  成人人数  childrenNum
 * 订单总金额 totalMoney
 * 支付订金  deposit  支付方式  paymentMethod  支付时间  payTime
 * 支付尾款  tailMoney  支付方式  paymentTailMethod  支付时间  payTailTime
 * 支付凭证
 * 关闭原因  closeReason
 * 关闭时间  closeTime
 * 支付截止日 endTime
 * 审核不通过原因  notPassReason
 */
class OrderInfoView extends Component {

    constructor(props) {
        super(props);

    }

    getBottom(type, data) {
        switch (type) {
            case 2: {/*待付订金*/
            }
                return (
                    <div className={css.bottom}>
                        <font style={{fontSize: 12, color: "#333"}}>支付订金：</font>
                        <font
                            style={{
                                color: "#ff5841",
                                fontSize: 16,
                                marginLeft: 20
                            }}>¥{data && data.deposit ? data.deposit : "0"}</font>
                    </div>
                );
            case 3: {/*待付尾款*/
            }
                return (
                    <div className={css.bottom}>
                        {this.getPayDeposit(type, data)}
                        <div>
                            <font className={css.payInfo}>支付尾款：</font>
                            <font style={{
                                color: "#ff5841",
                                fontSize: 16,
                                marginLeft: 26
                            }}>¥ {data && data.tailMoney ? data.tailMoney : "0"}</font>
                            <font className={css.payInfo}
                                  style={{marginLeft: 25}}>支付截止日：{data && data.endTailTime ? data.endTailTime : ""}</font>
                        </div>
                    </div>
                );
            case 4: {/*待付款*/
            }
                return (
                    <div className={css.bottom}>
                        <div>
                            <font className={css.payInfo}>待支付总金额：</font>
                            <font style={{
                                color: "#ff5841",
                                fontSize: 16,
                                marginLeft: 26
                            }}>¥{data && data.totalMoney ? data.totalMoney : "0"}</font>
                            <font className={css.payInfo} style={{marginLeft: 25}}>
                                支付截止日：{data && data.endTime ? data.endTime : ""}</font>
                        </div>
                    </div>
                );
            case 5: {/*已付尾款*/
            }
                return (
                    <div className={css.bottom}>
                        {this.getPayDeposit(type, data)}
                        {this.getPayTailMoney(type, data)}
                    </div>);
            case 6: {/*等待出票*/
            }
                return (
                    <div className={css.bottom}>
                        {this.getPayDeposit(type, data)}
                        {this.getPayTailMoney(type, data)}
                    </div>);
            case 7: {/*已出票*/
            }
                return (
                    <div className={css.bottom}>
                        {this.getPayDeposit(type, data)}
                        {this.getPayTailMoney(type, data)}
                    </div>);
            case 8: {/*订单关闭*/
            }
                return (
                    <div className={css.bottom}>
                        {this.getPayDeposit(type, data)}
                        {this.getPayTailMoney(type, data)}
                        <div style={{marginTop: 25}}>
                            <font className={css.payInfo}>订单关闭：</font>
                            <font className={css.payInfo}
                                  style={{marginLeft: 25}}> {data && data.closeReason ? data.closeReason : "暂无"}
                                <font
                                    style={{marginLeft: 15}}>（关闭时间 {data && data.closeTime ? data.closeTime : ""}）</font></font>
                        </div>
                    </div>
                );
            case  9: {/*订单取消*/
            }
                return (
                    <div className={css.bottom}>
                        {this.getPayDeposit(type, data)}
                        {this.getPayTailMoney(type, data)}
                        <div style={{marginTop: 25}}>
                            <font className={css.payInfo}>订单关闭：</font>
                            <font className={css.payInfo}
                                  style={{marginLeft: 25}}> {data && data.closeReason ? data.closeReason : "暂无"}
                                <font
                                    style={{marginLeft: 15}}>（关闭时间 {data && data.closeTime ? data.closeTime : ""}）</font></font>
                        </div>
                    </div>
                );
            case 10: {/*支付审核失败*/
            }
                return (
                    <div className={css.bottom}>
                        {this.getPayDeposit(type, data)}
                        {this.getPayTailMoney(type, data)}
                    </div>
                );
            case 11: {/*支付审核中*/
            }
                return (
                    <div className={css.bottom}>
                        {this.getPayDeposit(type, data)}
                        {this.getPayTailMoney(type, data)}
                    </div>
                );
            default:
                null;
        }
    }

    getPayDeposit(type, data) {
        return (
            <div style={{marginBottom: 25}}>
                <font className={css.payInfo}>支付订金：</font>
                <font style={{
                    color: "#ff5841",
                    fontSize: 16,
                    marginLeft: 26
                }}>¥{data && data.deposit ? data.deposit : "0"}</font>
                <font className={css.payInfo} style={{marginLeft: 15}}>
                    （支付方式：{data && data.paymentMethod ? data.paymentMethod : ""}
                    支付时间：{data && data.payTime ? data.payTime : "" + "）"}</font>
                {type === 10 ? this.getPayVoucher() : null}
            </div>
        );
    }

    getPayVoucher() {
        return (
            <div>
                <div className={css.voucher}>
                    <font>支付凭证</font>
                    <img src={require("../../../../images/login_check.png")}/>
                </div>
                <div style={{clear: "both"}}/>
            </div>
        );
    }

    getPayTailMoney(type, data) {
        return (
            <div>
                <div className={css.payTailLayout}>
                    <div className={css.payTailInfoLayout}>
                        <font className={css.payInfo}>支付尾款：</font>
                        <font style={{
                            color: "#ff5841",
                            fontSize: 16,
                            marginLeft: 26
                        }}>¥{data && data.tailMoney ? data.tailMoney : "0"}
                            积分抵扣（¥{data && data.integral ? data.integral : "0"}）</font>
                        <font className={css.payInfo}
                              style={{marginLeft: 15}}>（支付方式：{data && data.paymentTailMethod ? data.paymentTailMethod : ""}
                            {type === 10 ? <font className={css.payInfo}
                                                 style={{marginLeft: 15}}>审核不通过原因:{data && data.notPassReason ? data.notPassReason : ""}
                            </font>
                                : null  }
                            <font className={css.payInfo}
                                  style={{marginLeft: 25}}>支付时间：{data && data.payTailTime ? data.payTailTime : "" + "）"}</font></font>
                    </div>
                    {
                        type === 10 ? <div className={css.aginButtonLayout}>
                            <Button className={css.aginButton}
                                    onClick={() => {
                                        window.app_open(this, "/BankUpload", {
                                            orderId:data.orderId,
                                           id:data.id,
                                        });
                                    }}
                            >重新上传</Button>

                        </div> : null
                    }

                </div>
                {type === 10 || type === 11 ? this.getPayVoucher() : null}

            </div>
        );
    }

    getMessage(type, data) {
        if (type === 1 || type === 2 || type === 3 || type === 4) {
            return (
                <div className={css.messageLayout}>
                    <div className={css.img}>
                        <img src={require("../../../../images/login_check.png")}/>
                    </div>
                    <div className={css.messageText}>{data && data.message ? data.message : "暂无"}</div>
                </div>
            );
        }
    }

    getButton(type) {
        if(type===0){
            return (
                <div className={css.buttonLayout}>
                    <Button className={css.detailButton}>查看订单详情</Button>
                </div>
            );
        }else if(type===1||type===2||type===3||type===4||type===11){
            return (
                <div className={css.buttonLayout}>
                    <Button className={css.buttonCancel}>取消订单</Button>
                </div>
            );
        }else {
            return (
                <div className={css.emptyButton}/>
            );
        }
    }

    render() {
        let {data, type} = this.props;
        return (
            <div className={css.layout}>
                <div className={css.title}>订单信息</div>
                <div className={css.line}/>
                <div className={css.content}>
                    <div className={css.mainTextLayout}>
                        <div>
                            <font className={css.mainTitle}>订单状态：</font>
                            <font
                                className={type === 0 ? css.mainGreenContent : css.mainContent}>{data && data.status ? data.status : "暂无"}</font>
                        </div>
                        <div>
                            <div>{this.getMessage(type, data)}</div>
                            <font className={css.mainTitle}>订单号：</font>
                            <font className={css.mainContent1}>{data && data.orderNo ? data.orderNo : "暂无"}</font>
                        </div>
                        <div>
                            <font className={css.mainTitle}>创建时间：</font>
                            <font className={css.mainContent}>{data && data.createTime ? data.createTime : "暂无"}</font>
                        </div>
                        <div>
                            <font className={css.mainTitle}>成人价格：</font>
                            <font className={css.mainContent}>{data && data.adultMoney ? data.adultMoney : "暂无"}</font>
                        </div>
                        <div>
                            <font className={css.mainTitle}>儿童价格：</font>
                            <font
                                className={css.mainContent}>{data && data.childrenMoney ? data.childrenMoney : "暂无"}</font>
                        </div>
                        <div>
                            <font className={css.mainTitle}>航班人数：</font>
                            <font
                                className={css.mainContent}>{data && data.totalNum ? data.totalNum : "" + "人（"}{data && data.adultNum ? data.adultNum : "" + "成人，"}{data && data.childrenNum ? data.childrenNum : "" + "儿童）"}</font>
                        </div>
                    </div>

                    <div className={css.moneyLayout}>
                        <font style={{
                            color: "#999",
                            fontSize: 12,
                        }}>{type === 0 || type === 1 ? "参考价（含税）" : "订单总金额"}</font>
                        <font style={{color: "#ff5841", fontSize: 10, marginLeft: 8}}>¥</font>
                        <font style={{
                            color: "#ff5841",
                            fontSize: 20
                        }}>{data && data.totalMoney ? data.totalMoney : "0"}</font>
                    </div>

                    {this.getButton(type)}


                </div>
                <div>
                    {this.getBottom(type, data)}
                </div>


            </div>
        );
    }


}

module.exports = OrderInfoView;






