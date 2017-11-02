import React, {Component} from 'react';

import {Button} from 'antd';
import {HttpTool} from "../../lib/utils/index.js";

import PayInfo from './PayInfo';
import WindowHelp from './WindowHelp.js';
import Panel from './Panel';
import UnionPay from './UnionPay';
import BankPay from './BankPay';
import IntegralInfo from './IntegralInfo';
import PaySelectLayout from './PaySelectLayout';



//获取模拟数据
import less from './Pay.less';

class page extends Component {
    constructor(props) {
        super(props);
        this.wh = new WindowHelp();
        this.state = {
            step: 2,
        };
        //id
        this.data = {
            order: {
                title: "北京=>上海",
                desc: "5天6晚 2007年12月12号-2009年XXXX",
                price: 50000,
            },
            integral: {
                all: 456121,
                use: 50
            },
            pay: {
                defaultIndex:2,
                defaultshowMore:false
            }
        };
    }


    render() {

        let stepView = null;
        if(this.state.step===1){
            stepView =  this.getFirstStep();
        }else{
            let Com = this.getSecondStep();
            stepView = <Com
                ref={(ref)=>{
                    this.stepAction = ref;
                }
                }
                onAction={(type,data,callBack)=>{
                    //打开
                    if(type==="unionopen"){
                        //打开开通银联
                        this.openUnionPay(data);
                    }else if(type==="unionpay"){
                        //打开银联支付
                        this.openUnionPayIng(callBack);

                    }else if(type==="unionpaysuccess"){
                        //打开银联支付
                        this.openUnionPaySuccess(callBack);

                    }else if(type==="unionpayerror"){
                        //打开银联支付
                        this.openUnionPayError(data,callBack);

                    }


                }
                }
                back={()=>{
                this.setStep(1);
            }
            }/>;
        }
        return (
            <div className={less.content}>
                {stepView}
                <Panel
                    onAction={(action, showType) => {

                        if (showType === "paying") {
                            //验证是否支付
                            this.handVer("pay");
                        }else  if (showType === "unioning") {
                            //验证是否开通
                           this.handVer("union");
                        }
                        else if (action === "ok" && showType === "success") {
                            //打开订单页
                            alert("打开订单页面");
                        }

                    }}
                    ref={(ref) => {
                        this.panel = ref;
                    }}/>
            </div>
        );
    }

    getFirstStep() {
        return (
            <div>
                <PayInfo
                    data={this.data.order}
                    ref={(ref) => {
                        this.payInfo = ref;
                    }}
                />
                <PaySelectLayout
                    defaultshowMore={this.data.pay.defaultshowMore}
                    defaultIndex={this.data.pay.defaultIndex}
                    data={this.data.pay}
                />
                <IntegralInfo
                    data={this.data.integral}
                    onPriceChange={(use) => {
                        this.payInfo.upDatePrice(use);
                    }}

                />

                <div className={less.nextLayout}>
                    <div>
                        订单含机票 ,民......
                    </div>
                    <Button type="primary"

                            onClick={() => {
                                //1:如果是在线支付,进入银联支付
                                //2:如果是银行转账,进入银行转账
                                //3:如果是支付宝/微信支付,进入支付
                                console.log(this.data.pay.type);
                                switch (this.data.pay.type) {
                                    case "ali"://
                                    case "wechat"://
                                        this.openPay();
                                        break;
                                    case "online":
                                    case "bank":
                                        this.setStep(2);
                                        break;
                                }

                            }}
                    >下一步</Button>
                </div>
            </div>
        );
    }
    getSecondStep() {
        switch (this.data.pay.type) {
            case "bank":
                return BankPay;
            default:
                return UnionPay;
        }

    }
    setStep(step) {
        this.setState({
            step
        });
    }
    openUnionPayIng(callBack){
        this.panel.show(true, {
            content: "正在支付....",
            title: "支付信息",
            showType: "loading"

        },callBack);
    }
    openUnionPaySuccess(callBack){
        this.panel.show(true, {
            content: "支付成功",
            title: "支付信息",
            showType: "success"

        },callBack);
    }

    openUnionPayError(msg,callBack){
        this.panel.show(true, {
            okText: "我知道了",
            content: msg,
            title: "支付信息",
            showType: "error"

        },callBack);
    }
    openUnionPay(data) {
        let apinPanel = this.wh.openInitWindow();
        this.panel.show(true, {
            okText: "我已经开通",
            cancelText: "还没开通",
            content: "正在开通....",
            title: "银联开通",
            showType: "unioning"

        }, () => {
            //3秒后去开始验证,是否支付成功
            // setTimeout(()=>{this.autoVer(apinPanel,"union");},3000);
            this.wh.openWindow(apinPanel, data.url);
        });

    }

    openPay() {
        this.panel.show(true, {
            content: "正在下单....",
            title: "支付信息",
            showType: "loading"

        }, () => {
            let apinPanel = this.wh.openInitWindow();
            this.loadPayOrder(this.data, (code, msg, data) => {
                if (code > 0) {
                    //3秒后去开始验证,是否支付成功
                    // setTimeout(()=>{this.autoVer(apinPanel,"pay");},3000);
                    this.panel.show(true, {
                        okText: "我已经支付",
                        cancelText: "还没支付",
                        content: "确认是否已支付",
                        title: "支付信息",
                        showType: "paying"

                    }, () => {
                        this.wh.openWindow(apinPanel, data.url);
                    });
                } else {
                    this.wh.closeWindow(apinPanel);
                    this.panel.show(true, {
                        okText: "我知道了",
                        content: msg,
                        title: "支付信息",
                        showType: "error"
                    }, () => {


                    });
                }
            });
        });
    }


    handVer(type) {
        //关闭已经存在的窗口
        this.wh.closeWindow();
        //验证是否支付
        this.panel.show(true, {
            content: type==="pay"?"验证支付中":"验证开通中",
            showType: "verpay"
        }, () => {
            this[type==="pay"?"loadPayOrderVer":"loadUnionVer"](this.data, (code, msg, data) => {
                //验证是否支付成功
                if (code > 0) {

                    if(type==="pay"){
                        //支付成功/提示支付成功/通知用户去订单详情
                        this.panel.show(true, {
                            content: msg,
                            showType: "success"
                        }, () => {
                        });
                    }else{
                        //开通成功/关闭提示/关闭卡号输入
                        this.panel.show(false);
                        if(this.stepAction&&this.stepAction.onAction){
                            this.stepAction.onAction("closeAdd");
                        }
                    }

                } else {
                    this.panel.show(true, {
                        okText: "我知道了",
                        content: msg,
                        title: type==="pay"?"支付信息":"银联开通",
                        showType: "error"
                    }, () => {


                    });
                }

            });

        });

    }


    autoVer(apinPanel,type) {
        this[type==="pay"?"loadPayOrderVer":"loadUnionVer"](this.data, (code, msg, data) => {
            //验证是否支付成功
            if (code > 0) {
                //支付成功
                //关闭支付窗口
                this.wh.closeWindow(apinPanel);
                //提示支付成功
                this.panel.show(true, {
                    content: msg,
                    showType: "success"
                }, () => {


                });
            } else {
                setTimeout(() => {
                    this.autoVer(apinPanel);
                }, 1000);
            }

        });

    }
    loadUnionVer(param, cb) {
        setTimeout(() => {
            let code = (Math.random() * 10).toFixed(0) - 1;
            let data = {};
            data.url = "http://www.baidu.com";
            cb(code, code > 0 ? "开通成功" : "开通失败", data);
        }, Math.random() * 1000 + 2000);
    }
    loadPayOrderVer(param, cb) {
        setTimeout(() => {
            let code = (Math.random() * 10).toFixed(0) - 1;
            let data = {};
            data.url = "http://www.baidu.com";
            cb(code, code > 0 ? "支付成功" : "支付失败", data);
        }, Math.random() * 1000 + 2000);
    }

    loadPayOrder(param, cb) {
        setTimeout(() => {
            let code = (Math.random() * 10).toFixed(0) - 1;
            let data = {};
            data.url = "http://www.baidu.com";
            cb(code, "无库存了/或者其他", data);
        }, Math.random() * 1000 + 2000);
    }
}


page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;

