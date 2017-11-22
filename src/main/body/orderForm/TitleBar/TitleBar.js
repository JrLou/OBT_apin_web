/**
 * Created by louxudong on 2017/11/4.
 */

/**
 * 订单状态说明
 * 0：订单取消 1：等待确认 2：待付押金 3：待付款 5：待付尾款 7：已出票 8：订单关闭
 * 12：已付款（未录乘机人） 13：等待出票 14：支付审核中
 */

import React, {Component} from 'react';
import css from './TitleBar.less';
import {hasKey,sliceTimeString} from '../../tool/LXDHelp.js';
import AlertView from '../../component/AlertView.js';

class TitleBar extends Component{
    constructor(props){
        super(props);

        this.state={
            orderState:this.props.orderState,
            orderID:this.props.orderID,
            deadLine:this.props.titleData.deadLine?this.props.titleData.deadLine:'',
            ticketDate:this.props.titleData.ticketDate?this.props.titleData.ticketDate:'',
            reason:this.props.titleData.reason?this.props.titleData.reason:'',
        };

        if(this.props.onDelete instanceof Function){
            this.deleteCB = this.props.onDelete;
        }

    }

    componentDidMount(){

    }

    /**
     * 根据订单状态显示不同的提示信息
     * @param state
     * @returns {string}
     */
    getHelpMsg(state){
        let msg = '';
        let title = '';
        let date = this.state.deadLine;
        let ticketDate = this.state.ticketDate;
        switch(state){
            case 0:title='订单取消';
                    break;
            case 1:title='等待确认...';
                    msg='30分钟以内，即可确认资源信息';
                    break;
            case 2:title='待付押金...';
                    break;
            case 3:title='待付款...';
                    msg=date?`请在 ${sliceTimeString(date)} 之前支付`:'';
                    break;
            case 5:title='待付尾款...';
                    msg=date?`请在 ${sliceTimeString(date)} 之前支付尾款`:'';
                    break;
            case 7:title='已出票';
                    break;
            case 8:title='订单关闭';
                    break;
            case 12:title='已付款（未录乘机人）';
                    msg=ticketDate?`您还没有录入齐全乘机人信息，请在 ${sliceTimeString(ticketDate)} 之前录入`:'';
                    break;
            case 13:title='等待出票...';
                    msg=`爱拼机正在为您出票中，请耐心等待`;
                     break;
            case 14:title='支付审核中...';
                    break;
            default:break;
        }

        return {msg,title};
    }

    render(){
        let state = this.state.orderState;
        if(!(hasKey(state,[0,1,2,3,5,7,8,12,13,14]))){
            return <div></div>;
        }
        return(
            <div className={css.stateBar}>
                <div className={css.stateTitle}>
                    <span style={{backgroundImage:`url(${require("../../../../images/orderForm/wait.png")})`}} className={css.stateIcon}></span>
                    {this.getHelpMsg(state).title}
                </div>
                <div className={css.helpMsg}>
                    {this.getHelpMsg(state).msg}
                </div>
                <div className={css.deleteOrder}>
                    {
                        (state==0||state==8)
                            ?<span onClick={()=>{this.deleteOrder();}}>删除订单</span>
                            :''
                    }
                </div>
                <AlertView
                    ref={(view) => this.partnerDetail = view}
                    callBack={(typeIndex,json)=>{
                         this.deleteCB();
                        }
                    }
                />
            </div>
        );
    }

    /**
     * 删除订单
     */
    deleteOrder(){
        this.partnerDetail.showModal({
            hideCancel:true,
            title:"提示",
            desc:"是否确定删除此订单?",
        });
    }
}

TitleBar.contextTypes = {
    router: React.PropTypes.object
};
module.exports = TitleBar;