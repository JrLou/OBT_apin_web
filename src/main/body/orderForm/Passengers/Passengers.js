/**
 * Created by louxudong on 2017/11/1.
 */

/**
 * 订单状态说明  orderState
 * 0：订单取消 1：等待确认 2：待付订金 3：待付款 5：待付尾款 7：已出票 8：订单关闭
 * 12：已付款（未录乘机人） 13：等待出票 14：支付审核中 15：支付审核失败
 *
 * 接口可能返回的值： returnState
 * 0：订单取消 1：等待确认 2：待付订金 3：待付全款 5：待付尾款 7：已出票 8：已关闭
 */

import React, {Component} from 'react';
import css from './Passengers.less';
import { HttpTool } from '../../../../../lib/utils/index.js';
import APILXD from "../../../../api/APILXD.js";
import Table from "../../component/Table/index.js";
import {Button,Checkbox} from 'antd';

class PassengerMsg extends Component{
    constructor(props){
        super(props);
        this.state = {
            orderState:this.props.orderState,
            orderID:this.props.orderID,
            defaultData:this.props.defaultData,
            isPassed:this.props.isPassed?this.props.isPassed:false,     //是否已经确认了乘机人
            checkedMsg:false,       //是否已经勾选'确认乘机人信息'
        };

    }


    componentDidMount(){

    }

    render(){
        //模拟数据
        let columns = [
            {
                title:'乘机人',
                dataIndex:'passengerName',
            },{
                title:'乘机人类型',
                dataIndex:'passengerType',
            },{
                title:'证件类型',
                dataIndex:'cardType',
            },{
                title:'证件号',
                dataIndex:'cardNum',
            },{
                title:'出发日期',
                dataIndex:'date',
            },{
                title:'国籍',
                dataIndex:'nationality',
            },{
                title:'操作',
                dataIndex:'operation',
                render:(text,record)=>(
                    <div>
                        <div
                            className={css.operation}
                            onClick={()=>{
                                alert('修改');
                            }}
                        >
                            修改
                        </div>
                        <div
                            className={css.operation}
                            onClick={()=>{
                                alert('修改');
                            }}
                        >
                            删除
                        </div>
                    </div>

                ),
            },
        ];
        let dataSource = [
            {
                passengerName:'张三',
                passengerType:'成人',
                cardType:'身份证',
                cardNum:'3303030440201043045',
                date:'1990-03-23',
                nationality:'中国',
                operation:'把识别id传入',
            },
            {
                passengerName:'张三',
                passengerType:'成人',
                cardType:'身份证',
                cardNum:'3303030440201043045',
                date:'1990-03-23',
                nationality:'中国',
                operation:'把识别id传入',
            }
        ];


        if(this.hasKey(this.state.orderState,[0,1])){
            return(
                <div></div>
            );
        }else{
            return(
                <div className={css.passengerList}>
                    <div className={css.titleBar}>
                        <div className={css.title}>乘机人信息</div>
                        <Button type="primary" className={css.btnType01}>添加乘机人</Button>
                        <Button type="primary" className={css.btnType02}>导入</Button>
                        <Button type="primary" className={css.btnType02}>下载模版</Button>
                    </div>
                    <div className={css.passengerTable}>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                        />
                        <div className={css.submitBox}>
                            <Checkbox
                                onChange={(obj)=>{log(obj);}}
                            >
                                确认乘机人信息无误
                            </Checkbox>
                            <Button size={'large'} type="primary" className={css.btnType03}>提交乘机人信息</Button>
                        </div>
                    </div>
                </div>
            );
        }
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

PassengerMsg.contextTypes = {
    router: React.PropTypes.object
};
module.exports = PassengerMsg;