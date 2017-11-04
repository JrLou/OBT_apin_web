/**
 * Created by louxudong on 2017/10/30.
 */
import React, {Component} from 'react';
import css from './OrderFormDetail.less';
import { HttpTool } from '../../../../lib/utils/index.js';
import APILXD from "../../../api/APILXD.js";
import LoadingView from "../component/LoadingView.js";
import Passengers from "./Passengers/Passengers.js";

class OrderFormDetail extends Component{
    constructor(props){
        super(props);
        this.state = {
            orderState:2,  //0：等待确认 1：待付定金 2：待付尾款 3：待付款 4：已付尾款(未录乘机人) 5：等待出票 6：已出票 7：订单取消 8：订单关闭
            orderID:'',
        };

    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount(){

    }


    /**
     * 绘制状态条
     * @param state
     * @returns {XML}
     */
    getStateBar(state){
        let titleList = ['等待确认资源中...','待付订金...','待付尾款...','待付款...','已付尾款...','等待出票...','已出票...','订单取消...','订单关闭...'];
        let deadLine = '2017-9-29';
        return(
            <div className={css.stateBar}>
                <div className={css.stateTitle}>
                    <span className={css.stateIcon}>(图)</span>
                    {titleList[state]}
                </div>
                <div className={css.helpMsg}>
                    {this.getHelpMsg(state)}
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
     * 根据订单状态显示不同点提示信息
     * @param state
     * @returns {string}
     */
    getHelpMsg(state){
        let deadLine = '';
        let msg = '';
        switch(state){
            case 0: msg = '30分钟以内，即可确认资源信息';
                    break;
            case 2: deadLine = 'XXXX-XX-XX';
                    msg = '请在'+deadLine+'18点之前支付尾款';
                    break;
            case 3: deadLine = '#####';
                    msg = '请在'+deadLine+'18点之前支付';
                    break;
            case 4: deadLine = '$$$$$$$';
                    msg = '您还没有录入齐全乘机人信息，请在'+deadLine+'18点之前支付';
                    break;
            case 5: msg = '爱拼机正在为您出票中，请耐心等待';
                    break;
            case 1:
            case 6:
            case 7:
            case 8:break;
            default:break;
        }

        return msg;
    }

    render(){
        //仅在此处做状态异常判断，如果状态不在此列，说明出现异常，页面不展示
        if(!(this.state.orderState in [0,1,2,3,4,5,6,7,8])){
            return(
                <div className={css.noMessage}>订单查询中，请稍后...</div>
            );
        }
        return(
            <div className={css.mainPage}>
                {this.getStateBar(this.state.orderState)}
                <div className={css.itemContainer}>
                    航班信息
                </div>
                <Passengers
                    orderState={this.state.orderState}
                    orderID={this.state.orderID}
                    passengerData={[]}
                />
                <div className={css.itemContainer}>
                    订单信息
                </div>
                <div>
                    支付明细
                </div>
                <div>
                    底部操作条
                </div>
            </div>
        );
    }

    deleteOrder(){
        alert('删除');
    }
}

OrderFormDetail.contextTypes = {
    router: React.PropTypes.object
};
module.exports = OrderFormDetail;