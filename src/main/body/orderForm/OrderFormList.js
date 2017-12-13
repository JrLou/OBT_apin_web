/**
 * Created by louxudong on 2017/10/30.
 */
import React, {Component} from 'react';
import css from './OrderFormList.less';
import { HttpTool } from '../../../../lib/utils/index.js';
import APILXD from "../../../api/APILXD.js";
import {routeTranslate,getDateFormat} from '../tool/LXDHelp.js';
import {transformForList} from './StateHelp.js';
import {Table,DatePicker,Select,Button,message} from 'antd';
import InputAuto from '../component/InputForList.js';
import datePlaceholder from '../component/SignView/datePlaceholder.js';
const Option = Select.Option;

class OrderFormList extends Component{
    constructor(props) {
        super(props);
        //状态机
        this.state = {
            cityDep:'',
            cityArr:'',
            flightType:'',
            orderStatus:'',
            startDate:null,
            dateRet:null,

            dataSource:null,        //传入Table组件的数据

            pageSize:10,            //每页展示数据数目
            page:1,                 //列表当前页
            total:0,                //总数据

            loading: false,         //是否处于加载状态
        };

        //点击分页器的查询条件
        this.searchParames = {
            cityDep:'',
            cityArr:'',
            flightType:'',
            orderStatus:'',
            startDate:null,
            dateRet:null,
        };

        this.earliest = new Date(2015,0,1);
        this.placeholderStyle = {fontSize:'14',color:'#c4c4c4'};

        //航程类型
        this.flightTypeList = [
            {
                title:'全部',
                value:'',
            },
            {
                title:'单程',
                value:'1',
            },
            {
                title:'往返',
                value:'2',
            },{
                title:'多程',
                value:'3',
            },
        ];
        //订单状态
        this.orderStateList = [
            {
                title:'全部',
                value:'',
            },
            {
                title:'等待确认',
                value:'1',
            },
            {
                title:'待付押金',
                value:'2',
            },
            {
                title:'待付尾款',
                value:'5',
            },
            {
                title:'待付款',
                value:'3',
            },
            {
                title:'已付款(未录乘机人)',
                value:'12',
            },
            {
                title:'等待出票',
                value:'13',
            },
            {
                title:'已出票',
                value:'7',
            },
            {
                title:'订单取消',
                value:'0',
            },
            {
                title:'订单关闭',
                value:'8',
            },
        ];

    }


    componentWillReceiveProps(nextProps) {

    }

    componentDidMount(){
        //查询订单列表数据
        this.loadData(1,true);
    }

    /**
     * 绘制下拉选项
     * @param data
     * @returns {Array}
     */
    getOptions(data){
        let options = [];
        if(data instanceof Array){
            for(let key in data){
                options.push(
                    <Option
                        key={`option${key}`}
                        value={data[key].value}
                    >
                        {data[key].title}
                    </Option>
                );
            }
        }

        return options;
    }


    render(){
        let columns = [
            {
                title:'序号',
                dataIndex:'key',
            }, {
                title:'订单号',
                dataIndex:'orderNo',
            },{
                title:'航程',
                dataIndex:'voyages',
                render:(list,record)=>{
                    let flightType = record.flightType;
                    let view = routeTranslate(list,flightType);
                    return view;
                },
            },{
                title:'出发日期',
                dataIndex:'dateDep',
            },{
                title:'返回日期',
                dataIndex:'dateRet',
                render:(text,recode)=>{
                    return (<span>{text?text:'无'}</span>);
                }
            },{
                title:'航程类型',
                dataIndex:'flightType',
                render:(text,recode)=>{
                    let typeList = ['','单程','往返','多程'];
                    let num = parseInt(text);
                    return typeList[num];
                }
            },{
                title:'人数(成人／儿童)',
                dataIndex:'peopleNum',
            },{
                title:'含税价格',
                dataIndex:'orderAmount',
                render:(text,recode)=>{
                    if(text){
                        return (`¥${text}`);
                    }else{
                        return '';
                    }
                }
            },{
                title:'订单创建时间',
                dataIndex:'createdTime',
            },{
                title:'订单状态',
                dataIndex:'orderStatus',
                render:(text,record)=>{
                    let num = parseInt(text);
                    let state = '';
                    switch(num){
                        case 0:state = '订单取消';break;
                        case 1:state = '等待确认';break;
                        case 2:state = '待付押金';break;
                        case 3:state = '待付款';break;
                        case 5:state = '待付尾款';break;
                        case 7:state = '已出票';break;
                        case 8:state = '订单关闭';break;
                        case 12:state = '已付款(未录乘机人)';break;
                        case 13:state = '等待出票';break;
                        case 14:state = '支付审核中';break;
                        default:state = '';
                    }
                    return state;
                }
            },{
                title:'操作',
                dataIndex:'operation',
                render:(text,record)=>(
                    <span
                        className={css.operation}
                        onClick={()=>{
                                window.app_open(this, "/OrderFormDetail", {
                                    //传给详情页一个订单id
                                    id:record.id,
                                    //开发测试 - 写死的id
                                    // orderId:'10000059f39c5427ca5f749604a09de39',
                                });
                            }}
                    >
                        {text}
                    </span>
                ),
            },
        ];

        return(
            <div className={css.mainPage}>
                <div className={css.searchContainer}>
                    <div className={css.searchItem01}>
                        <span className={css.lableText}>出发城市：</span>
                        <InputAuto
                            type={"from"}
                            placeholder={'请输入'}
                            onChange={(val)=>{
                                this.setState({cityDep:val});
                                }
                            }
                            onChangeValue={(val)=>{
                                this.setState({cityDep:val});
                            }}
                            getClearAction={(clearAction)=>{this.clearDepCity = clearAction;}}
                        />
                    </div>
                    <div className={css.searchItem01}>
                        <span className={css.lableText}>目的城市：</span>
                        <InputAuto
                            type={"to"}
                            placeholder={'请输入'}
                            onChange={(val)=>{
                                this.setState({cityArr:val});
                            }
                            }
                            onChangeValue={(val)=>{
                                this.setState({cityArr:val});
                            }}
                            getClearAction={(clearAction)=>{this.clearArrCity = clearAction;}}
                        />
                    </div>
                    <div className={css.searchItem02}>
                        <span>出发日期：</span>
                        {datePlaceholder(<DatePicker
                            value={this.state.startDate}
                            disabledDate={this.disabledStart.bind(this)}
                            placeholder={'请选择日期'}
                            className={css.dateStyle}
                            format="YYYY-MM-DD"
                            onChange={(data)=>{
                                this.changeState('startDate',data);
                                if(!this.state.dateRet){
                                    this.changeState('dateRet',data);
                                }
                            }}
                        />,{width:'34%'},this.placeholderStyle)}
                        <span>—</span>
                        {datePlaceholder(<DatePicker
                            value={this.state.dateRet}
                            disabledDate={this.disabledEnd.bind(this)}
                            placeholder={'请选择日期'}
                            className={css.dateStyle}
                            format="YYYY-MM-DD"
                            onChange={(data)=>{
                                this.changeState('dateRet',data);
                                if(!this.state.startDate){
                                    this.changeState('startDate',data);
                                }
                            }}
                        />,{width:'34%'},this.placeholderStyle)}
                    </div>
                    <div className={css.searchItem01}>
                        <span>航程类型：</span>
                        <Select
                            prefixCls={'my-ant-select'}
                            value={this.state.flightType}
                            className={css.selectStyle}
                            placeholder={'请选择'}
                            onChange={(value)=>{
                                this.changeState('flightType',value);
                            }}
                        >
                            {this.getOptions(this.flightTypeList)}
                        </Select>
                    </div>
                    <div className={css.searchItem01}>
                        <span>订单状态：</span>
                        <Select
                            prefixCls={'my-ant-select'}
                            value={this.state.orderStatus}
                            className={css.selectStyle}
                            placeholder={'请选择'}
                            onChange={(value)=>{
                                this.changeState('orderStatus',value);
                            }}
                        >
                            {this.getOptions(this.orderStateList)}
                        </Select>
                    </div>
                    <div className={css.searchItem01}>
                        <Button
                            className={css.buttonStyle}
                            type="primary"
                            onClick={()=>{this.searchOrderForm();}}
                        >
                            查询
                        </Button>
                        <span
                            className={css.clearBtn}
                            onClick={()=>{
                                this.clearDepCity();
                                this.clearArrCity();
                                this.setState({
                                    cityDep:'',
                                    cityArr:'',
                                    flightType:'',
                                    orderStatus:'',
                                    startDate:null,
                                    dateRet:null,
                                },()=>{this.loadData(1,true);});
                            }}
                        >
                            清空查询条件
                        </span>
                    </div>
                </div>
                <div className={css.resultContainer}>
                        <Table
                            prefixCls={'my-ant-table'}
                            columns={columns}
                            dataSource={this.state.dataSource}
                            loading={{
                                spinning:this.state.loading,
                                size:'large',
                            }}
                            pagination={{
                                current:this.state.page,
                                total:this.state.total,
                                defaultCurrent:1,
                                showQuickJumper:true,
                            }}
                            onChange={(pagination, filters, sorter)=>{this.pageNumChange(pagination, filters, sorter);}}
                        />
                </div>
            </div>
        );
    }

    /**
     * 根据不同的键改值
     * @param field
     * @param value
     */
    changeState(field,value){
        this.setState({
            [field]: value,
        });
    }

    /**
     * 动态设置时间组件的禁止日期
     * @param date
     * @returns {boolean}
     */
    disabledStart(date){
        if(!date){
            return true;
        }
        if(this.state.dateRet){
            return (date.valueOf()>this.state.dateRet.valueOf()||date.valueOf()<this.earliest.valueOf());
        }else{
            return date.valueOf()<this.earliest.valueOf();
        }
    }
    disabledEnd(date){
        if(!date){
            return true;
        }
        if(this.state.startDate){
            return (date.valueOf()<this.state.startDate.valueOf()||date.valueOf()<this.earliest.valueOf());
        }else{
            return date.valueOf()<this.earliest.valueOf();
        }
    }

    /**
     * 分页器改变页码
     * @param num
     */
    pageNumChange(pagination, filters, sorter){
        if(this.isLoading()){
            return;
        }
        let currentNum = pagination.current;
        this.loadData(currentNum,false);
    }

    /**
     * 点击查询按钮
     */
    searchOrderForm(){
        if(this.isLoading()){
            return;
        }
        this.loadData(1,true);
    }

    /**
     * 请求数据
     * @param searchParames
     */
    loadData(currentNum,type){
        let page = currentNum;
        let parames = {};
        if(type){
            parames = this.getSearchParames();
        }else{
            parames = this.searchParames;
        }
        parames.page = page;

        let successCB = (code, msg, json, option)=>{
            //转换数据，更改状态机
            log(`=============列表页请求结果=============》`);
            log(json);
            let newData = this.transformData(json);
            this.setLoading(false);
            this.setState({
                page:page,
                dataSource:newData,
                total:parseInt(option.option&&option.option.total?option.option.total:0),
            });
        };

        let failureCB = (code, msg, option)=>{
            this.setLoading(false);
            // message.error(msg);
            if(code == -490){
                message.error(msg);
                return;
            }
            this.setState({
                page:1,
                dataSource:[],
                total:0,
            });
        };

        this.setLoading(true,()=>{
            HttpTool.request(HttpTool.typeEnum.POST,APILXD.loadOrderList, successCB, failureCB, parames,
                {
                    ipKey: "hlIP"
                });
        });
    }

    /**
     * 从状态机中解析出请求需要的参数
     * @returns {{}}
     */
    getSearchParames(){
        let state = this.state;
        let parames = {
            orderStatus:state.orderStatus,
            cityDep:state.cityDep,
            cityArr:state.cityArr,
            flightType:state.flightType,
            pageSize:state.pageSize,
        };
        let dateDepStart = state.startDate?getDateFormat(state.startDate.valueOf()):'',
            dateDepStop = state.dateRet?getDateFormat(state.dateRet.valueOf()):'';
        parames.dateDepStart = dateDepStart;
        parames.dateDepStop = dateDepStop;
        this.searchParames = parames;
        return parames;
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
     * 对后台传回对数据进行解析，返回格式化数据
     * @param data
     * @returns {Array}
     */
    transformData(data){
        let newData = data;
        if(data instanceof Array){
            for(let key in data){
                newData[key].index = newData[key].key = parseInt(key)+1;
                newData[key].operation = '查看详情';
                let adultNum = newData[key].adultCount?newData[key].adultCount:0;
                let childNum = newData[key].childCount?newData[key].childCount:0;
                newData[key].peopleNum = (''+adultNum+'/'+childNum);
                newData[key].orderStatus = transformForList(data[key]);
            }
        }
        return newData;
    }

}

OrderFormList.contextTypes = {
    router: React.PropTypes.object
};
module.exports = OrderFormList;