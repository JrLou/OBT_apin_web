/**
 * Created by  on 2017/11/6.
 */
import React, { Component } from 'react';
import css from './PayBottom.less';

class PayBottom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payType:this.props.payType?this.props.payType:'', //支付类型：2：待付订金 3：待付全款 5：待付尾款
            overTime:false,
            countDown:this.props.param.countDown?this.props.param.countDown:0,
            timerStr:'00:00:00',
        };

        if(this.props.btnAction instanceof Function){
            this.callBack = this.props.btnAction;
        }
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount(){
        if(this.state.countDown&&(this.state.payType==2||this.state.payType==3)){
            //启动倒计时
            this.getTimeOut(this.state.countDown);
        }
    }

    render() {
        let payName = '订金';
        switch (this.state.payType){
            case 2:payName = '支付订金';
                    break;
            case 3:payName = '总金额';
                    break;
            case 5:payName = '尾款金额';
                    break;
            default:break;
        }

        let {param,isPay,callBack} = this.props;
        let str = param?"(成人¥"+param.adultPrice+"*"+param.adultCount+"+"+"儿童¥" +param.childPrice+
            "*"+param.childCount+"=价格(含税)"+"¥"+param.totalPrice+")":"";

        return (<div className={css.payDiv}>
            <div className={this.state.overTime?css.divDisabled:css.bottomDiv}>
                <div className={css.bottomDiv_left}>
                    <div className={css.bottomBtn}
                        onClick={()=>{
                            window.app_open(this,'/OrderFormList',{});
                        }}
                    >
                        {"<返回上一级"}
                    </div>
                </div>
                <div className={css.bottomDiv_center}>
                    <div className={css.depositPriceBg}>
                        <span style={{fontSize:"14px",color:"#333"}}>{payName}</span>
                        <span style={{fontSize:"14px",color:"red"}}>￥</span>
                        <span style={{fontSize:"20px",color:"red"}}>{param.orderPrice}</span>
                    </div>
                    <div className={css.depositPriceBg}>
                        {
                            (this.state.payType==2||this.state.payType==5)
                            ?''
                            :<span style={{fontSize:"12px",color:"#888D99"}}>{str}</span>
                        }
                    </div>
                </div>
                <div
                    className={this.state.overTime?css.btnDisabled:css.bottomDiv_right}
                    onClick={()=>{
                        if(this.state.overTime){return;}
                        if (this.callBack){
                            this.callBack();
                    }
                }}>
                    <div>{this.state.payType?'去支付':(isPay?"立即支付":"提交订单")}</div>
                    {
                        (this.state.payType==2||this.state.payType==3)
                        ?<div style={{fontSize:"12px"}}>
                                {this.state.countDown>0?this.state.timerStr:''}
                        </div>
                        :
                            (this.state.payType==5)
                            ?''
                            :<div style={{fontSize:"12px"}}>{"( 提交订单30分钟内,即可确认资源信息 )"}</div>
                    }
                </div>
            </div>
        </div>);
    }

    /**
     * 根据传入的时间倒计时，需要毫秒数
     * @param time
     */
    getTimeOut(time){
        //时间大于24小时或者不存在
        if(!time||time>86400000){
            return;
        }
        let timeCount = setInterval(()=>{
            time = time -1000;
            let hour = Math.floor(time/3600000),
                minute = Math.floor((time%3600000)/60000),
                second = Math.floor((time%60000)/1000),
                str = `${hour<10?('0'+hour):hour}:${minute<10?('0'+minute):minute}:${second<10?('0'+second):second}`;
            if(time<=0){
                clearTimeout(timeCount);
                str = '已超时';
                this.setState({
                    overTime:true,
                    timerStr:str,
                });
            }else{
                this.setState({
                    timerStr:str,
                });
            }
        },1000);
    }
}
PayBottom.contextTypes = {
    router: React.PropTypes.object
};
module.exports = PayBottom;