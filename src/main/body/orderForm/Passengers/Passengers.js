/**
 * Created by louxudong on 2017/11/1.
 */

/**
 * 订单状态说明  orderState
 * 0：订单取消 1：等待确认 2：待付押金 3：待付款 5：待付尾款 7：已出票 8：订单关闭
 * 12：已付款（未录乘机人） 13：等待出票 14：支付审核中 15：支付审核失败
 *
 * 接口可能返回的值： returnState
 * 0：订单取消 1：等待确认 2：待付押金 3：待付全款 5：待付尾款 7：已出票 8：已关闭
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
            // orderId:this.props.orderId,
            orderId:'16b3639900f54a86b9116af77b088d75',
            dataSource:this.props.defaultData?this.props.defaultData:[],
            isPassed:this.props.isPassed?this.props.isPassed:false,     //是否已经确认了乘机人
            checkedMsg:false,       //是否已经勾选'确认乘机人信息'
            submitConfirm:false,    //确认乘机人询问框
            deleteConfirm:false,    //删除乘机人询问框
            importResultMod:false,     //导入乘机人结果提示框
            importResultMsg:null,       //导入结果展示数据
            deleteMsg:'',          //将要被删除的乘机人的姓名

            passengerMsg:null,      //打开新增／修改乘机人窗口时，传入的数据
            airlineSigns:this.props.airlineSigns,  //航线类型  1：国内  2：国际

            loading:false,          //加载状态
        };
    }

    componentDidMount(){
        //加载乘机人列表数据
        this.setLoading(true,this.loadPassengerList);
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
                render:(text,record)=>{
                    let num = parseInt(text);
                    let type = '';
                    switch(num){
                        case 1:type = '身份证';break;
                        case 2:type = '护照';break;
                        case 3:type = '港澳通行证';break;
                        case 4:type = '台胞证';break;
                        default:type = '';
                    }
                    return type;
                }
            },{
                title:'证件号',
                dataIndex:'credNumber',
            },{
                title:'性别',
                dataIndex:'gender',
                render:(text,record)=>{
                    let gender = '';
                    if(text == 1){
                        gender = '男';
                    }else if(text ==0){
                        gender = '女';
                    }
                    return gender;
                }
            },{
                title:'出生日期',
                dataIndex:'birthday',
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
                                    this.clickDeleteBtn(record);
                                }}
                            >
                                删除
                            </div>
                        </div>
                ),
            },
        ];
        // let dataSource = [
        //     {
        //         index:1,
        //         key:1,
        //         name:'张三',
        //         credType:'1',
        //         credNumber:'3303030440201043045',
        //         birthday:'1990-03-23',
        //         nation:'中国',
        //         operation:'把识别id传入',
        //         gender:1,
        //     },
        //     {
        //         index:2,
        //         key:2,
        //         name:'李六',
        //         credType:'1',
        //         credNumber:'3303030440201043045',
        //         birthday:'1990-03-23',
        //         nation:'中国',
        //         operation:'把识别id传入',
        //         ticket:'123123123,123123123,23424123,235345345,23423423424,2353453455',
        //         issuePlace:'中国',
        //     },
        //     {
        //         index:3,
        //         key:4,
        //         name:'Edd',
        //         credType:'2',
        //         credNumber:'3303030440201043045',
        //         gender:0,
        //         birthday:'1990-03-23',
        //         nation:'中国',
        //         operation:'把识别id传入',
        //         ticket:'123123123,123123123,23424123,235345345,23423423424,2353453455',
        //     }
        // ];

        if(hasKey(this.state.orderState,[1,2])){
            return(
                <div></div>
            );
        }else{
            return(
                <div className={css.passengerList}>
                    <Spin
                        size={'large'}
                        spinning={this.state.loading}
                    >
                    <PassengerAdd
                        orderId = {this.state.orderId}
                        airlineSigns = {this.state.airlineSigns}        //航线类型
                        defaultData = {this.state.passengerMsg}     //单个乘机人信息
                        closeModCB = {()=>{this.setState({passengerMsg:null});}}  //关闭窗口回调
                        changeSuccCB={(allData)=>{this.passengerChange(allData);}}                              //新增/修改成功的回调
                        getFunction = {(changeVisible)=>{this.changeShow = changeVisible;}} //获取打开/关闭窗口的方法
                    />
                    {
                        this.state.isPassed
                        ?   <div className={css.titleBar}>
                                <div className={css.title}>乘机人信息</div>
                                <Button
                                    type="primary"
                                    className={css.btnType02}
                                    onClick={()=>{
                                        this.exportPassenger();
                                    }}
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
                                    onClick={()=>{
                                        if(this.state.airlineSigns == 1){
                                            //国内
                                            window.location.href = '';
                                        }else{
                                            //国际
                                            window.location.href = '';
                                        }
                                    }}
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
                                    action={'/upload'}
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
                            prefixCls={'my-ant-table'}
                            columns={columns}
                            dataSource={this.state.dataSource}
                            pagination={false}
                        />
                        {
                            this.state.isPassed&&this.state.dataSource.length>0
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
                                        disabled={!this.state.checkedMsg}
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
                                    <Modal
                                        title="删除乘机人"
                                        visible={this.state.deleteConfirm}
                                        onOk={()=>{
                                            this.setState({
                                                deleteConfirm:false,
                                            },this.toDeletePassenger());
                                        }}
                                        okText={'是'}
                                        onCancel={()=>{
                                            this.setState({
                                                deleteConfirm:false,
                                            });
                                        }}
                                    >
                                        <div className={css.contentTitle}>
                                            {`是否确定删除乘机人：${this.state.deleteMsg.name} ？`}
                                        </div>
                                    </Modal>
                                    <Modal
                                        title="导入乘机人结果"
                                        visible={this.state.importResultMod}
                                        footer={null}
                                        maskClosable={false}
                                        onCancel={()=>{
                                            this.setState({
                                                importResultMsg:null,
                                                importResultMod:false,
                                            });
                                        }}
                                    >
                                        <div>
                                            {this.getResultView()}
                                        </div>
                                        <div>
                                            <Button
                                                onClick={()=>{
                                                    this.setState({
                                                        importResultMsg:null,
                                                        importResultMod:false,
                                                    });
                                                }}
                                            >
                                                确定
                                            </Button>
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
        let parames = {
            //订单ID
            id:this.state.orderId,
        };
        let successCB = (code, msg, json, option)=>{
            this.setState({
                isPassed:true,
                loading:false,
            },message.success(msg));
        };
        let failureCB = (code, msg, option)=>{
            this.setLoading(false);
            message.warning(msg);
        };

        this.setLoading(true,()=>{
            HttpTool.request(HttpTool.typeEnum.POST,APILXD.confirmPassenger, successCB, failureCB, parames,
                {
                    ipKey: "hlIP"
                });
        });

        //模拟接口
        // this.setLoading(true,()=>{
        //     log(parames);
        //     setTimeout(()=>{
        //         let num = Math.random();
        //         if(num<0.5){
        //             successCB();
        //         }else{
        //             failureCB();
        //         }
        //     },1000);
        // });
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
     * 上传文件到七牛 状态改变
     */
    upLoadStateChange(obj){
        if(obj&&obj.file&&obj.file.status=='done'){
            //导入乘机人
            if(obj.file.response.code == 200){
                let url = obj.file.response.data.url;
                this.importPassenger(url);
            }
        }
    }

    /**
     * 点击删除按钮
     * @param data
     */
    clickDeleteBtn(data){
        this.setState({
            deleteMsg:data,
            deleteConfirm:true,
        });
    }

    /**
     * 删除乘客
     * @param data
     */
    toDeletePassenger(){
        let parames = {
            id:this.state.deleteMsg.id,
            orderId:this.state.orderId,
        };
        let successCB = (code, msg, json, option)=>{
            this.passengerChange(json);
            message.success('删除成功');
            this.setLoading(false);
        };

        let failureCB = (code, msg, option)=>{
            this.setLoading(false);
            message.error(msg);
        };

        this.setLoading(true,()=>{
            HttpTool.request(HttpTool.typeEnum.POST,APILXD.deletePassenger, successCB, failureCB, parames,
                {
                    ipKey: "hlIP"
                });
        });
    }

    /**
     * 接受新的数据，改变乘机人列表
     * @param data
     */
    passengerChange(data){
        let newData = [];
        if(data instanceof Array){
            newData = data;
            for(let key in data){
                newData[key].index = newData[key].key = parseInt(key)+1;
            }
        }
        this.setState({
            dataSource:newData,
        });
    }

    /**
     * 请求乘机人列表数据
     */
    loadPassengerList(){
        let parames = {
            orderId:this.state.orderId,
        };
        let successCB = (code, msg, json, option)=>{
            this.passengerChange(json);
            this.setLoading(false);
        };

        let failureCB = (code, msg, option)=>{
            this.setLoading(false);
            message.error(msg);
        };

        this.setLoading(true,()=>{
            HttpTool.request(HttpTool.typeEnum.POST,APILXD.loadPassengerList, successCB, failureCB, parames);
        });
    }

    /**
     * 导出乘机人
     */
    exportPassenger(){
        let parames = {
            orderId:this.state.orderId,
        };
        let successCB = (code, msg, json, option)=>{
            window.location.href = json.fileUrl;
            this.setLoading(false);
        };

        let failureCB = (code, msg, option)=>{
            this.setLoading(false);
            message.error(msg);
        };

        this.setLoading(true,()=>{
            HttpTool.request(HttpTool.typeEnum.POST,APILXD.exportPassenger, successCB, failureCB, parames,
                {
                    ipKey: "hlIP"
                });
        });
    }

    /**
     * 导入乘机人
     * @param file
     */
    importPassenger(url){
        let parames = {
            orderId:this.state.orderId,
            file:url,
        };
        let successCB = (code, msg, json, option)=>{
            this.setState({
                importResultMsg:json,
                importResultMod:true,
            });
            this.setLoading(false);
        };

        let failureCB = (code, msg, option)=>{
            this.setLoading(false);
            message.error(msg);
        };

        this.setLoading(true,()=>{
            HttpTool.request(HttpTool.typeEnum.POST,APILXD.importPassenger, successCB, failureCB, parames,
                {
                    ipKey: "hlIP"
                });
        });
    }

    /**
     * 展示导入结果
     * @return {XML}
     */
    getResultView(){
        let result = this.state.importResultMsg;
        if(!result){
            return (<div></div>);
        }

        let getNumber = (list)=>{
            let numberList = [];
            if(list instanceof Array){
                for(let key in list){
                    numberList.push(<span>{list[key]}</span>);
                }
            }

            return numberList;
        };

        return(
            <div>
                {
                    result.successCount
                    ?<div>{`导入成功${result.successCount}人`}</div>
                    :''
                }
                {
                    result.failCount
                    ?<div>
                            {`导入失败${result.failCount}人`}
                            <div>
                                失败的记录行号：
                                {getNumber(result.failRowNumber)}
                            </div>
                    </div>
                    :''
                }
                {
                    result.repeatCount
                    ?<div>
                            {`导入重复${result.repeatCount}人`}
                            <div>
                                重复的记录行号：
                                {getNumber(result.repeatRowNumber)}
                            </div>
                    </div>
                    :''
                }
            </div>
        );
    }
}

PassengerMsg.contextTypes = {
    router: React.PropTypes.object
};
module.exports = PassengerMsg;