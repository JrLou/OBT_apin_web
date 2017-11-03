import React, {Component} from 'react';

import {Button,message} from 'antd';
import {HttpTool} from "../../lib/utils/index.js";

import PayInfo from './PayInfo';
import WindowHelp from './WindowHelp.js';
import Panel from './Panel';
import WXPay from './WXPay';
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
            step: 1,
            loading:true,
        };
        // get id
        this.par = window.app_getPar(this);
        console.log(this.par);
        this.id = this.par?this.par.id:null;


    }
    componentDidMount() {
        if (this.un) {
            return;
        }
        this.refresh();
    }
    componentWillUnmount() {
        this.un = true;
    }

    refresh(){
        this.show(true,()=>{
            this.loadPayInfo({
                id:this.id
            }, (code, msg, data) => {
                if (this.un) {
                    return;
                }
                this.data = data;
                this.setState({
                    loading: false,
                    error: code > 0 ? "" : msg,
                });
            });
        });

    }
    show(loading, callBack) {
        this.setState({
            loading
        }, callBack);
    }
    getLoadingView() {
        return <div className={less.loading}>正在为您拉取订单信息,请稍候...</div>;
    }
    getDefaultView() {
        return (
            <div className={less.loading}>
                {this.state.error ? <div className={less.loading}> {this.state.error}</div> : null}
                <div>订单号异常? <a onClick={() => {
                    if( window.ysf&& window.ysf.open){
                        // window.ysf.open();
                        window.ysf.product({
                            show : 1, // 1为打开， 其他参数为隐藏（包括非零元素）
                            title : "订单支付异常",
                            desc : "异常原因:"+(this.state.error||"未知"),
                            note : "订单号:"+this.id,
                            url : window.location.host,
                            success: function(){     // 成功回调
                                window.ysf.open();
                            },
                            error: function(){       // 错误回调
                                // handle error
                            }
                        });
                    }else{
                        message.warn("");
                    }
                }}>联系客服</a></div>
            </div>
        );

    }
    render() {
        let contentView = null;
        if (this.state.loading) {
            contentView =  this.getLoadingView();
        }else  if(this.state.error){
            contentView =  this.getDefaultView();
        }else{
            console.log("==");
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
            contentView = (
                <div>
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
                                window.app_open(this, "/Order", {
                                    id:this.id
                                },"self");
                            }

                        }}
                        ref={(ref) => {
                            this.panel = ref;
                        }}/>
                    <WXPay
                        ref={(ref) => {
                            this.wxPay = ref;
                        }}/>
                </div>
            );
        }
        return (
            <div className={less.content}>
                {contentView}
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
                    onAction={()=>{
                        //打开新页面
                        window.app_open(this, "/Upload", {
                            id:this.id
                        },"new");
                    }}
                />
                <IntegralInfo
                    data={this.data.integral}
                    onPriceChange={(use) => {
                        this.payInfo.upDatePrice(use);
                    }}

                />

                <div className={less.nextLayout}>
                    <div>
                        <span className={less.nextLayout_priceTitle}>需支付：</span>
                        <span className={less.nextLayout_price}>
                        <span className={less.nextLayout_price_rmb}>¥</span>
                           {(1000000/100).toFixed(2)}
                        </span>
                    </div>


                    <p>订单含机票、民航发展基金、燃油费、税费</p>
                    <Button type="primary"
                            className={less.nextLayout_btn}
                            onClick={() => {
                                //1:如果是在线支付,进入银联支付
                                //2:如果是银行转账,进入银行转账
                                //3:如果是支付宝/微信支付,进入支付
                                console.log(this.data.pay.type);
                                switch (this.data.pay.type) {
                                    case "ali"://
                                    case "wechat"://
                                        this.openPay(this.data.pay.type);
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

    openPay(showType) {

        this.panel.show(true, {
            content: "正在下单....",
            title: "支付信息",
            showType: "loading"

        }, () => {
            let apinPanel = this.wh.openInitWindow(showType==="wechat"?this.wxPay:null);
            this.loadPayOrder(this.data, (code, msg, data) => {
                if (code > 0) {
                    //3秒后去开始验证,是否支付成功
                  //   setTimeout(()=>{this.autoVer(apinPanel,"pay");},3000);
                    this.panel.show(true, {
                        okText: "我已经支付",
                        cancelText: "还没支付",
                        content: "确认是否已支付",
                        title: "支付信息",
                        showType: "paying"

                    }, () => {
                        this.wh.openWindow(apinPanel, showType==="wechat"?data:data.url);
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
            data.payPrice = (Math.random()*10000).toFixed(0);
            cb(code, "无库存了/或者其他", data);
        }, Math.random() * 1000 + 2000);
    }
    loadPayInfo(param, cb) {
      //   if(!param||!param.id){
      //       cb(-3, "缺少订单号", null);
      //       return;
      //   }
        setTimeout(() => {
            let code = (Math.random() * 10).toFixed(0) - 0;
            let data = {};
            // code = 10;
            if (code > 0) {
                data =  {
                    order: {
                        orderId: "201711111111",
                        passengersInfo: "2成人/1儿童",
                        price: (Math.random()*100000).toFixed(0),
                    },
                    integral: {
                        all: (Math.random()*100000).toFixed(0),
                        use: 0
                    }
                };
               if(!data.pay){
                   data.pay = {
                       defaultIndex:0,
                           defaultshowMore:false
                   };
               }
            }
            cb(code, code > 0 ? "获取成功" : "获取支付信息失败", data);
        }, Math.random() * 1000);
    }

}


page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;

