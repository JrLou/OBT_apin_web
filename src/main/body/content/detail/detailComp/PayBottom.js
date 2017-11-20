/**
 * Created by apin on 2017/11/4.
 */
import React, { Component } from 'react';
import css from './PayBottom.less';

class PayBottom extends Component {
    constructor(props) {
        super(props);

    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        // orderPrice:"2333",
        //     adultPrice:"2333",
        //     childPrice:"2000",
        //     childNum:this.childNum,
        //     adultNum:this.adultNum,
        //     totalPrice:this.totalPrice,
        let {param,isPay,shouldFixed,callBack} = this.props;
        let str = param?"(成人¥"+param.adultPrice+"*"+(param.adultNum?param.adultNum:0)+(param.childNum!=0?("+"+"儿童¥" +param.childPrice+
            "*"+param.childNum):"")+"=价格(含税)"+"¥"+param.totalPrice+")":"";
        return (<div className={shouldFixed?css.payDiv:css.payDivNone} >
            <div className={css.bottomDiv}>
                <div className={css.bottomDiv_left}>
                    <div className={css.bottomBtn} onClick={()=>{
                        window.history.go(-1);
                    }}>{"<返回上一级"}</div>
                </div>
                {param.orderPrice||param.totalPrice?<div className={css.bottomDiv_center}>
                    <div className={css.depositPriceBg}>
                        <span style={{fontSize:"14px",color:"#333"}}>{param.orderPrice==0?"全款":"押金"}</span>
                        <span style={{fontSize:"14px",color:"red"}}>￥</span>
                        <span style={{fontSize:"20px",color:"red"}}>{param.orderPrice==0?param.totalPrice:(param.orderPrice?param.orderPrice:0)}</span>
                    </div>

                    <div className={css.depositPriceBg}>
                        <span style={{fontSize:"12px",color:"#888D99"}}>{str}</span>
                    </div>
                </div>:<div className={css.bottomDiv_center}></div>}
                <div className={css.bottomDiv_right} onClick={()=>{
                    if (callBack){
                        callBack();
                    }
                }}>
                    <div>{isPay?"立即支付":"提交订单"}</div>
                    {isPay?null:<div style={{fontSize:"12px"}}>{"( 提交订单30分钟内,即可确认资源信息 )"}</div>}
                </div>
            </div>
        </div>);
    }
}
PayBottom.contextTypes = {
    router: React.PropTypes.object
};
module.exports = PayBottom;