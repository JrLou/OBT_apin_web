/**
 * Created by louxudong on 2017/11/4.
 */

/**
 * 订单状态说明
 * 0：订单取消 1：等待确认 2：待付订金 3：待付款 5：待付尾款 7：已出票 8：订单关闭
 * 12：已付款（未录乘机人） 13：等待出票 14：支付审核中 15：支付审核失败
 */

import React, {Component} from 'react';
import css from './TitleBar.less';

class TitleBar extends Component{
    constructor(props){
        super(props);

        this.state={
            orderState:this.props.orderState,
            orderID:this.props.orderID,
            deadLine:this.props.deadLine?this.props.deadLine:'',
        };

        if(this.props.onDelete instanceof Function){
            this.deleteCB = this.props.onDelete;
        }
    }

    componentDidMount(){

    }

    /**
     * 绘制状态条
     * @param state
     * @returns {XML}
     */
    getStateBar(state){
        return(
            <div className={css.stateBar}>
                <div className={css.stateTitle}>
                    <span className={css.stateIcon}>(图)</span>
                    {this.getHelpMsg(state).title}
                </div>
                <div className={css.helpMsg}>
                    {this.getHelpMsg(state).msg}
                </div>
                <div className={css.deleteOrder}>
                    {
                        (state==7||state==8)
                            ?<span onClick={()=>{this.deleteOrder();}}>删除订单</span>
                            :''
                    }
                </div>
            </div>
        );
    }

    /**
     * 根据订单状态显示不同的提示信息
     * @param state
     * @returns {string}
     */
    getHelpMsg(state){
        let msg = '';
        let title = '';
        switch(state){
            case 0:title='订单取消';
                    msg='1111';
                    break;
            case 1:title='等待确认';
                    msg='222222';
                    break;
            default:break;
        }

        return {msg,title};
    }

    render(){
        if(!this.state.orderState){
            return;
        }
        return(
            <div>
                {this.getStateBar(this.state.orderState)}
            </div>
        );
    }

    /**
     * 删除订单
     */
    deleteOrder(){
        log('执行删除操作');
        this.deleteCB();
    }
}

TitleBar.contextTypes = {
    router: React.PropTypes.object
};
module.exports = TitleBar;