/**
 * Created by louxudong on 2017/11/1.
 */

/**
 * 订单状态说明  orderState
 * 0：订单取消 1：等待确认 2：待付押金 3：待付款 5：待付尾款 7：已出票 8：订单关闭
 * 12：已付款（未录乘机人） 13：等待出票 14：支付审核中
 *
 * 接口可能返回的值： returnState
 * 0：订单取消 1：等待确认 2：待付押金 3：待付全款 5：待付尾款 7：已出票 8：已关闭
 */

import React, {Component} from 'react';
import css from './Passengers.less';
import { HttpTool } from '../../../../../lib/utils/index.js';
import APILXD from "../../../../api/APILXD.js";
import WindowHelp from '../../tool/WindowHelp.js';
import {hasKey,loadHelp} from '../../tool/LXDHelp.js';
import PassengerAdd from './PassengerAdd.js';
import {Table,Modal} from 'antd';
import AlertView from '../../component/AlertView.js';
import {Button,Checkbox,message,Spin,Upload} from 'antd';

class PassengerMsg extends Component{
    constructor(props){
        super(props);
        this.state = {
            returnState:this.props.returnState,     //接口返回的订单状态
            orderState:this.props.orderState,       //页面订单状态
            orderId:this.props.orderId,
            // orderId:'16b3639900f54a86b9116af77b088d75',
            dataSource:this.props.passengerData?this.passengerChange(this.props.passengerData,false):[],
            isPassed:this.props.isPassed?this.props.isPassed:false,     //是否已经确认了乘机人
            checkedMsg:false,       //是否已经勾选'确认乘机人信息'
            importResultMod:false,     //导入乘机人结果提示框
            importResultMsg:null,       //导入结果展示数据
            deleteMsg:'',          //将要被删除的乘机人的姓名

            passengerMsg:null,      //打开新增／修改乘机人窗口时，传入的数据
            airlineSigns:this.props.airlineSigns,  //航线类型  1：国内  2：国际

            loading:false,          //加载状态
        };

        this.WindowHelp = new WindowHelp();
    }

    componentDidMount(){
        //加载乘机人列表数据
        // this.setLoading(true,this.loadPassengerList);
        //模拟导入成功的窗口
        // this.setState({
        //     importResultMod:true,
        //     importResultMsg:{
        //         successCount:10,
        //         failCount:3,
        //         failRowNumber:[1,2,3],
        //         repeatCount:4,
        //         repeatRowNumber:[6,7,8,9],
        //         totalCount:13,
        //         reason:'XXXXXXXX',
        //     },
        // });
    }

    componentWillReceiveProps(nextProps){
        if(this.hasChanged){
            return;
        }
        let newData = nextProps.passengerData?nextProps.passengerData:[];
        this.passengerChange(newData,true);
        this.hasChanged = true;
    }

    render(){
        //模拟数据
        let columns = [
            {
                title:'序号',
                dataIndex:'index',
                render:(text,record)=>{
                    return (<div style={{minWidth:'30px',display:'inline-block'}}>{text}</div>);
                }
            },{
                title:'乘机人',
                dataIndex:'name',
                render:(text,record)=>{
                    return (<div style={{maxWidth:'150px',display:'inline-block'}}>{text}</div>);
                }
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
                    return <div style={{minWidth:'80px',display:'inline-block'}}>{type}</div>;
                }
            },{
                title:'证件号',
                dataIndex:'credNumber',
                render:(text,record)=>{
                    return (<div style={{maxWidth:'350px',display:'inline-block'}}>{text}</div>);
                }
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
                    return <div style={{minWidth:'30px',display:'inline-block'}}>{gender}</div>;
                }
            },{
                title:'乘机人类型',
                dataIndex:'passengerType',
                render:(text,record)=>{
                    let passengerType = '';
                    if(text == 1){
                        passengerType = '成人';
                    }else if(text ==2){
                        passengerType = '儿童';
                    }
                    return <div style={{minWidth:'30px',display:'inline-block'}}>{passengerType}</div>;
                }
            },{
                title:'出生日期',
                dataIndex:'birthday',
                render:(text,record)=>{
                    return (<div style={{minWidth:'100px',display:'inline-block'}}>{text}</div>);
                }
            },{
                title:'国籍',
                dataIndex:'nation',
                render:(text,record)=>{
                    return (<div style={{maxWidth:'200px',display:'inline-block'}}>{text}</div>);
                }
            },{
                title:'签发地',
                dataIndex:'issuePlace',
                render:(text,record)=>{
                    return (<div style={{maxWidth:'200px',display:'inline-block'}}>{text}</div>);
                }
            },{
                title:(this.state.isPassed?<div>票号</div>:<div>操作</div>),
                dataIndex:'operation',
                width:'200px',
                render:(text,record)=> {
                    if(this.state.isPassed){
                        let ticketStr = record.ticket?record.ticket:'';
                        // let ticketStr = '1231231,12313123,12313123';   //测试数据
                        let ticketList = ticketStr.split(',');
                        let listLength = ticketList.length;
                        let ticketViews = [];
                        for(let index = 0;index<listLength;index+=2){
                            ticketViews.push(
                                <div key={`ticket${index}`} style={{textAlign:'left'}}>
                                    <span>{ticketList[index]?`${ticketList[index]}`:''}</span>
                                    <span>{ticketList[index+1]?',':''}</span>
                                    <span style={{paddingLeft:'10px'}}></span>
                                    <span>{ticketList[index+1]?ticketList[index+1]:''}</span>
                                    <span>{index+2<listLength?',':''}</span>
                                </div>
                            );
                        }
                        return(<div className={css.waitTicket}>
                            {ticketStr ? ticketViews : '等待出票'}
                        </div>);
                    }else{
                        return(<div>
                            <div
                                className={css.operationUpDate}
                                onClick={() => {
                                    this.toUpDatePassenger(record);
                                }}
                            >
                                修改
                            </div>
                            <span>/</span>
                            <div
                                className={css.operationDelete}
                                onClick={() => {
                                    this.clickDeleteBtn(record);
                                }}
                            >
                                删除
                            </div>
                        </div>);
                    }
                },
            },
        ];

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
                        changeSuccCB={(allData)=>{this.passengerChange(allData,true);}}                              //新增/修改成功的回调
                        getFunction = {(changeVisible)=>{this.changeShow = changeVisible;}} //获取打开/关闭窗口的方法
                    />
                    {
                        (this.state.isPassed ||hasKey(this.state.orderState,[0,7,8]))
                        ?   <div className={css.titleBar}>
                                <div className={css.title}>乘机人信息</div>
                                <Button
                                    type="primary"
                                    className={hasKey(this.state.orderState,[0,8])?css.hidden:css.btnType02}
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
                                            let currentTime = new Date();
                                            let timeShip = currentTime.valueOf();
                                            let url = "http://oqum3uti8.bkt.clouddn.com/guonei.xlsx"+'?'+timeShip;
                                            loadHelp(url);
                                        }else{
                                            //国际
                                            let currentTime = new Date();
                                            let timeShip = currentTime.valueOf();
                                            let url = "http://oqum3uti8.bkt.clouddn.com/guoji.xlsx"+'?'+timeShip;
                                            loadHelp(url);
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
                                    showUploadList={false}
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
                            //提交按钮显示前提：状态未确认，且列表内容大于1，且订单状态处于3，5，12，14（之前已区分待付订金，这里不用再判断）
                            (!this.state.isPassed)&&(this.state.dataSource.length>0)&&(hasKey(this.state.orderState,[3,5,12,14]))
                            ?   <div className={css.submitBox}>
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
                                </div>
                            :   ''
                        }
                        <AlertView
                            ref={(view) => this.partnerDetail = view}
                            callBack={(typeIndex,json)=>{
                                if(typeIndex == 1){
                                    this.submit();
                                }else if(typeIndex== 2){
                                    this.toDeletePassenger();
                                }
                            }
                            }
                        />
                        <Modal
                            prefixCls={'my-ant-modal'}
                            title="导入乘机人结果"
                            visible={this.state.importResultMod}
                            footer={null}
                            maskClosable={false}
                            onCancel={()=>{
                                this.setState({
                                    importResultMsg:null,
                                    importResultMod:false,
                                });
                                this.setLoading(true,this.loadPassengerList);
                            }}
                        >
                            <div>
                                {this.getResultView()}
                            </div>
                            <div className={css.btnBox}>
                                <Button
                                    type={'primary'}
                                    onClick={()=>{
                                        this.setState({
                                            importResultMsg:null,
                                            importResultMod:false,
                                        });
                                        this.setLoading(true,this.loadPassengerList);
                                    }}
                                >
                                    确定
                                </Button>
                            </div>
                        </Modal>
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
            this.partnerDetail.showModal({
                typeIndex:1,
                title:"提交乘机人信息",
                desc:"是否确定现在提交乘机人信息?",
                con:"注：只可提交一次，提交后不可修改。您也可在付完尾款/全款后和提交信息人时间截止前提交。",
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
            //刷新页面
            window.location.reload();
        };
        let failureCB = (code, msg, option)=>{
            this.setLoading(false);
            message.warning(msg);
        };



        let submitAction = ()=>{
            this.setLoading(true,()=>{
                HttpTool.request(HttpTool.typeEnum.POST,APILXD.confirmPassenger, successCB, failureCB, parames,
                    {
                        ipKey: "hlIP"
                    });
            });
        };

        //判断订单状态是否已经改变
        // if(this.props.checkOrderState){
        //     this.props.checkOrderState(submitAction);
        // }else{
        //     submitAction();
        // }

        submitAction();
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
                let filename = obj.file.response.data.filename;
                this.importPassenger(filename);
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
        },()=>{
            this.partnerDetail.showModal({
                typeIndex:2,
                title:"删除乘机人",
                desc:`是否确定删除乘机人 ${data.name}?`,
            });
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
            this.passengerChange(json,true);
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
    passengerChange(data,type){
        let newData = [];
        if(data instanceof Array){
            newData = data;
            for(let key in data){
                newData[key].index = newData[key].key = parseInt(key)+1;
            }
        }
        if(type){
            this.setState({
                dataSource:newData,
            });
        }else{
            return newData;
        }
    }

    /**
     * 请求乘机人列表数据
     */
    loadPassengerList(){
        let parames = {
            orderId:this.state.orderId,
        };
        let successCB = (code, msg, json, option)=>{
            this.passengerChange(json,true);
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

            this.setLoading(false);
            loadHelp(json);
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
    importPassenger(filename){
        let parames = {
            orderId:this.state.orderId,
            fileName:filename,
        };
        let successCB = (code, msg, json, option)=>{
            let newData = json;
            newData.reason = msg;
            this.setState({
                importResultMsg:newData,
                importResultMod:true,
            });
            this.setLoading(false);
        };

        let failureCB = (code, msg, option)=>{
            let newData = {};
            newData.reason = msg;
            this.setState({
                importResultMsg:newData,
                importResultMod:true,
            });
            this.setLoading(false);
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

        //普通行号
        let getNumber = (list,type)=>{
            let numberList = [];
            if(list instanceof Array){
                for(let key in list){
                    numberList.push(<span
                                        key={`span${key}`}
                                        className={type==1?css.failureNum:(type==2?css.defaultNum:css.warningNum)}
                                    >
                                        {list[key]}
                                    </span>);
                }
            }

            return numberList;
        };
        //失败行号  （括号内有原因）
        let getFailNumber = (list,type)=>{
            let numberList = [];
            if(list instanceof Array){
                for(let key in list){
                    let array01 = list[key].split('第');
                    let array02 = array01[1].split('行');
                    numberList.push(<div
                                        key={`span${key}`}
                                        className={css.failureNum}
                                    >
                                        <span>{`${array01[0]}`}</span>
                                        &nbsp;&nbsp;
                                        <span>第</span>
                                        &nbsp;
                                        <span style={{color:'#f50'}}>{array02[0]}</span>
                                        &nbsp;
                                        <span>行</span>
                                        &nbsp;&nbsp;
                                        <span>{`${array02[1]}`}</span>
                                    </div>);
                }
            }

            return numberList;
        };

        if(result.length==1){
            //条数为1，说明json为空，reason接收的是导入错误的信息
            result(<div>
                <div className={css.resultTitle}>导入错误</div>
                {
                    result.reason
                        ?<div className={css.resultReason}>{`错误信息：${result.reason}`}</div>
                        :''
                }
            </div>);
        }

        return(
            <div className={css.importResult}>
                {
                    result.totalCount
                    ?<div className={css.resultTitle}>{`文件中总共有数据：${result.totalCount}条`}</div>
                    :''
                }
                <div className={css.resultItem}>
                        <span style={{color:'#87d068',fontSize:'16px'}}>导入成功：</span>
                        {`${result.successCount?result.successCount:0}人`}
                </div>
                {
                    result.repeatCount
                    ?<div className={css.resultItem}>
                            <span style={{color:'#333',fontSize:'16px'}}>导入重复：</span>
                            {`${result.repeatCount}人`}
                            <div className={css.numberList}>
                                重复的记录行号：
                                {getNumber(result.repeatRowNumber,2)}
                            </div>
                    </div>
                    :''
                }
                {
                    result.dbExistCount
                        ?<div className={css.resultItem}>
                            <span style={{color:'#fa0',fontSize:'16px'}}>已存在：</span>
                            {`${result.dbExistCount}人`}
                            <div className={css.numberList}>
                                已存在的记录行号：
                                {getNumber(result.dbExistRowNumber,3)}
                            </div>
                        </div>
                        :''
                }
                {
                    result.failCount
                        ?<div className={css.resultItem}>
                            <span style={{color:'#f50',fontSize:'16px'}}>导入失败：</span>
                            {`${result.failCount}人`}
                            <div className={css.numberList}>
                                失败的记录行号：
                                {getFailNumber(result.failRowNumber,1)}
                            </div>
                        </div>
                        :''
                }
                {
                    result.reason
                    ?<div className={css.resultReason}>{`返回信息：${result.reason}`}</div>
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