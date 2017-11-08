/**
 * Created by louxudong on 2017/10/30.
 */
import React, {Component} from 'react';
import css from './OrderFormDetail.less';
import { HttpTool } from '../../../../lib/utils/index.js';
import APILXD from "../../../api/APILXD.js";
import TitleBar from './TitleBar/index.js';
import Passengers from './Passengers/index.js';
import CellNewFlight from '../content/cell/CellNewFlight.js';
import OrderInfoView from '../component/OrderInfoView/index.js';
import PayBottom from '../content/detail/detailComp/PayBottomForDetail.js';

/**
 * 订单状态说明(页面)：
 * 0：订单取消 1：等待确认 2：待付订金 3：待付款 5：待付尾款 7：已出票 8：订单关闭
 * 12：已付款（未录乘机人） 13：等待出票 14：支付审核中 15：支付审核失败
 *
 * 接口可能返回的值：
 * 0：订单取消 1：等待确认 2：待付订金 3：待付全款 5：待付尾款 7：已出票 8：已关闭
 */



class OrderFormDetail extends Component{
    constructor(props){
        super(props);
        //模拟随机状态
        let random = Math.floor(Math.random()*11);
        let list = [0,1,2,3,5,7,8,12,13,14,15];

        this.state = {
            returnState:3,          //接口返回的订单状态  （接口返回的状态需要经过转换才赋值给状态机）
            orderState:list[random],       //页面订单状态
            isPassed:false,     //乘机人信息是否已经确认
            orderID:'',         //订单ID
            upDate:0,
        };
    }

    componentDidMount(){
        //模拟航班数据
        let go = {arrAirport:"塞班",
            arrDate:"2017-11-05",
            arrTime:"15:30",
            compName:"北京首都航空有限公司",
            depAirport:"杭州萧山",
            depDate:"2017-11-05",
            depTime:"08:10",
            flightTime:"7:20",
            flightType:"2",
            logo:null,
            num:"JD395",
            tag:0
        };
        let back = {
            arrAirport: "杭州萧山",
            arrDate: "2017-11-09",
            arrTime: "10:25",
            compName: "北京首都航空有限公司",
            depAirport: "塞班",
            depDate: "2017-11-09",
            depTime: "07:00",
            flightTime: "3:25",
            flightType: "2",
            logo: null,
            num: "JD396",
            tag: 0,
        };
        let zhongZhuanObj=[{
            flightType:true,
            obj:go
        },{
            flightType:true,
            obj:go
        },{
            flightType:false,
            obj:back
        }];

        let flightTypeGo = [{
            flightType:true,
            obj:go,
            data:zhongZhuanObj
        }];


        let flightTypeGoAndBack = [{
            flightType:true,
            obj:go,
            data:zhongZhuanObj
        },{
            flightType:false,
            obj: back,
            data:zhongZhuanObj
        }];

        let moreFlightObj = [{
            numFlight:"一",
            obj:go,
        },{
            numFlight:"二",
            obj:go,
        },{
            numFlight:"三",
            obj: back,
        }];

        //航班信息所需要的数据
        this.listData = {
            rule:"1.行李规则行李规则行李规则行李规则行李",
            obj:flightTypeGo,
            flightType:1
        };

        this.upView();

    }

    //更新状态机
    upView(){
        this.setState({
            upDate:this.state.upDate+1,
        });
    }

    render(){
        //仅在此处做状态异常判断，如果状态不在此列，说明出现异常，页面不展示
        if(!(this.hasKey(this.state.orderState,[0,1,2,3,5,7,8,12,13,14,15]))){
            return(
                <div className={css.noMessage}>订单查询中，请稍后...</div>
            );
        }
        return(
            <div className={css.mainPage}>
                <TitleBar
                    orderState={this.state.orderState}
                    deadLine={'2017-11-27'}
                    reason={'审核失败的原因'}
                    orderID={this.state.orderID}
                    onDelete={()=>{this.deleteOrderCB();}}
                />
                 <div className={css.itemContainer}>
                    <div className={css.itemTitle}>航班信息</div>
                    <div className={css.itemContent}>
                        <CellNewFlight
                            dataSource = {this.listData}
                        />
                    </div>
                </div>
                    {
                        (this.hasKey(this.state.orderState,[0,3,5,7,8,12,13])||this.hasKey(this.state.returnState,[3,5]))
                        ?   <div className={css.itemContainer}>
                                <Passengers
                                    orderState={this.state.orderState}
                                    returnState={this.returnState}
                                    isPassed={this.state.isPassed}
                                    orderID={this.state.orderID}
                                    defaultData={[]}
                                />
                            </div>
                        :   <div></div>
                    }
                <div className={css.itemContainer}>
                    <div className={css.orderInfoBox}>
                        <OrderInfoView
                            type={9}
                            data={{
                                orderNo:'12312312313',
                                message:'请在XXXX之前支付',
                                createTime:'2017-03-02',
                            }}
                        />
                    </div>
                </div>
                {
                    (this.hasKey(this.state.orderState,[2,3,5]))
                    ?<PayBottom
                        param={{
                            orderPrice:"2333",
                            adultPrice:"2333",
                            childPrice:"2000",
                            childNum:2,
                            adultNum:1,
                            totalPrice:'33333',
                        }}
                        payType={this.state.orderState}
                        timer={3888}
                    />
                    :''
                }

            </div>
        );
    }

    /**
     * 订单删除以后的回调
     */
    deleteOrderCB(){
        alert('订单删除啦！');
    }

    /**
     * 判断数组中是否含有某值
     * @param key
     * @param array
     * @returns {boolean}
     */
    hasKey(key,array){
        let result = false;
        if(array instanceof Array){
            if(array.indexOf(key)>=0){
                result = true;
            }
        }
        return result;
    }
}

OrderFormDetail.contextTypes = {
    router: React.PropTypes.object
};
module.exports = OrderFormDetail;