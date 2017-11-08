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
import {hasKey} from '../../tool/LXDHelp.js';
import PassengerAdd from './PassengerAdd.js';
import {Table,Modal} from 'antd';
import {Button,Checkbox,message,Spin,Upload} from 'antd';

class PassengerMsg extends Component{
    constructor(props){
        super(props);
        this.state = {
            orderState:this.props.orderState,
            orderID:this.props.orderID,
            dataSource:this.props.defaultData?this.props.defaultData:[],
            isPassed:this.props.isPassed?this.props.isPassed:false,     //是否已经确认了乘机人
            checkedMsg:false,       //是否已经勾选'确认乘机人信息'
            submitConfirm:false,

            passengerMsg:null,      //打开新增／修改乘机人窗口时，传入的数据
            lineType:1,             //航线类型  1：国内  2：国际

            loading:false,          //加载状态
        };
    }

    componentDidMount(){

    }

    render(){
        //模拟数据
        let columns = [
            {
                title:'序号',
                dataIndex:'index',
            },{
                title:'乘机人',
                dataIndex:'name',
            },{
                title:'证件类型',
                dataIndex:'credType',
            },{
                title:'证件号',
                dataIndex:'credNum',
            },{
                title:'性别',
                dataIndex:'gender',
            },{
                title:'出生日期',
                dataIndex:'birth',
            },{
                title:'国籍',
                dataIndex:'nation',
            },{
                title:'签发地',
                dataIndex:'issuePlace',
            },{
                title:(this.state.isPassed?<div>票号</div>:<div>操作</div>),
                dataIndex:'operation',
                width:'200px',
                render:(text,record)=>(
                    this.state.isPassed
                    ?   <div className={css.waitTicket}>{record.ticket?record.ticket:'等待出票'}</div>
                    :   <div>
                            <div
                                className={css.operationUpDate}
                                onClick={()=>{
                                    this.toUpDatePassenger(record);
                                }}
                            >
                                修改
                            </div>
                            <div
                                className={css.operationDelete}
                                onClick={()=>{
                                    alert('删除');
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
                index:1,
                key:1,
                name:'张三',
                credType:'1',
                credNum:'3303030440201043045',
                birth:'1990-03-23',
                nation:'中国',
                operation:'把识别id传入',
            },
            {
                index:2,
                key:2,
                name:'李六',
                credType:'1',
                credNum:'3303030440201043045',
                birth:'1990-03-23',
                nation:'中国',
                operation:'把识别id传入',
                ticket:'123123123,123123123,23424123,235345345,23423423424,2353453455',
                issuePlace:'中国',
            },
            {
                index:3,
                key:4,
                name:'Edd',
                credType:'2',
                credNum:'3303030440201043045',
                gender:0,
                birth:'1990-03-23',
                nation:'中国',
                operation:'把识别id传入',
                ticket:'123123123,123123123,23424123,235345345,23423423424,2353453455',
            }
        ];

        if(hasKey(this.state.orderState,[1,2])){
            return(
                <div></div>
            );
        }else{
            return(
                <div className={css.passengerList}>
                    <Spin
                        spinning={this.state.loading}
                    >
                    <PassengerAdd
                        lineType = {this.props.lineType}        //航线类型
                        defaultData = {this.state.passengerMsg}     //单个乘机人信息
                        closeModCB = {()=>{this.setState({passengerMsg:null});}}  //关闭窗口回调
                        changeSuccCB={(allData)=>{}}                              //新增/修改成功的回调
                        getFunction = {(changeVisible)=>{this.changeShow = changeVisible;}} //获取打开/关闭窗口的方法
                    />
                    {
                        this.state.isPassed
                        ?   <div className={css.titleBar}>
                                <div className={css.title}>乘机人信息</div>
                                <Button
                                    type="primary"
                                    className={css.btnType02}
                                >
                                    导出乘机人
                                </Button>
                            </div>
                        :   <div className={css.titleBar}>
                                <div className={css.title}>乘机人信息</div>
                                <Button
                                    type="primary"
                                    className={css.btnType02}
                                    style={{float:'right'}}
                                >
                                    下载模版
                                </Button>
                                <Button
                                    type="primary"
                                    className={css.btnType01}
                                    onClick={()=>{this.changeShow(true);}}
                                >
                                    添加乘机人
                                </Button>
                                <Upload
                                    accept={'.xls,.xlsx'}
                                    action={'请求地址'}
                                    data={{id:'订单ID'}}
                                    onChange={(obj)=>{this.upLoadStateChange(obj);}}
                                >
                                    <Button
                                        type="primary"
                                        className={css.btnType02}
                                    >
                                        导入
                                    </Button>
                                </Upload>
                            </div>
                    }
                    <div className={css.passengerTable}>
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            pagination={false}
                        />
                        {
                            this.state.isPassed
                            ?   ''
                            :   <div className={css.submitBox}>
                                    <Checkbox
                                        onChange={(e)=>{
                                            this.setState({
                                                checkedMsg:e.target.checked
                                            });
                                        }}
                                    >
                                        确认乘机人信息无误
                                    </Checkbox>
                                    <Button
                                        size={'large'}
                                        type="primary"
                                        className={css.btnType03}
                                        onClick={()=>{
                                            this.clickSubmitBtn();
                                        }}
                                    >
                                        提交乘机人信息
                                    </Button>
                                    <Modal
                                        title="提交乘机人信息"
                                        visible={this.state.submitConfirm}
                                        onOk={()=>{
                                            this.setState({
                                                submitConfirm:false,
                                            },this.submit());
                                        }}
                                        okText={'是'}
                                        onCancel={()=>{
                                            this.setState({
                                                submitConfirm:false,
                                            });
                                        }}
                                    >
                                        <div className={css.contentTitle}>
                                            是否确定现在提交乘机人信息？
                                        </div>
                                        <div className={css.contentMsg}>
                                            注：只可提交一次，提交后不可修改。
                                            您也可在付完尾款/全款后和提交信息人时间截止前提交。
                                        </div>
                                    </Modal>
                                </div>
                        }
                    </div>
                    </Spin>
                </div>
            );
        }
    }

    /**
     * 编辑乘机人，设置默认乘机人信息后打开编辑模态框
     * @param date
     */
    toUpDatePassenger(date){
        this.setState({
            passengerMsg:date,
        },this.changeShow(true));
    }

    /**
     * 点击提交按钮
     */
    clickSubmitBtn(){
        if(!this.state.checkedMsg){
            message.warning('请先选择确认乘机人信息无误');
        }else{
            this.setState({
                submitConfirm:true,
            });
        }
    }

    /**
     * 提交信息
     */
    submit(){
        let parames = {};
        let successCB = (code, msg, json, option)=>{
            this.setState({
                isPassed:true,
                loading:false,
            },message.success('测试-成功'));
        };
        let failureCB = (code, msg, option)=>{
            this.setLoading(false);
            message.warning('测试-出错');
        };

        // this.setLoading(true,()=>{
        //     HttpTool.request(HttpTool.typeEnum.GET,APILXD.XXXXXXXX, successCB, failureCB, parames,
        //         {
        //             ipKey: "hlIP"
        //         });
        // });

        //模拟接口
        this.setLoading(true,()=>{
            log(parames);
            setTimeout(()=>{
                let num = Math.random();
                if(num<0.5){
                    successCB();
                }else{
                    failureCB();
                }
            },1000);
        });
    }

    /**
     * 更改请求数据的状态并回调
     * @param loading
     * @param cb
     */
    setLoading(loading, cb) {
        this.setState({
            loading: loading
        }, cb);
    }

    /**
     * 返回加载的状态
     * @returns {boolean}
     */
    isLoading() {
        return this.state.loading;
    }

    /**
     * 上传文件状态改变
     */
    upLoadStateChange(obj){
        log(obj);
    }
}

PassengerMsg.contextTypes = {
    router: React.PropTypes.object
};
module.exports = PassengerMsg;