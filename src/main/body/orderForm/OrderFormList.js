/**
 * Created by louxudong on 2017/10/30.
 */
import React, {Component} from 'react';
import css from './OrderFormList.less';
import { HttpTool } from '../../../../lib/utils/index.js';
import APILXD from "../../../api/APILXD.js";
import {routeTranslate,getDateFormat,removeSpace,transformOrderState} from '../tool/LXDHelp.js';
import {Table,Input,DatePicker,Select,Button,message} from 'antd';
import moment from 'moment';
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

        this.earliest = new Date(2015,0,1);

        //航程类型
        this.flightTypeList = [
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
                title:'订单取消',
                value:'0',
            },
            {
                title:'等待确认',
                value:'1',
            },
            {
                title:'待付订金',
                value:'2',
            },
            {
                title:'待付款',
                value:'3',
            },
            {
                title:'待付尾款',
                value:'5',
            },
            {
                title:'已出票',
                value:'7',
            },
            {
                title:'订单关闭',
                value:'8',
            },
            {
                title:'已付款(未录乘机人)',
                value:'12',
            },
            {
                title:'等待出票',
                value:'13',
            },
        ];

    }


    componentWillReceiveProps(nextProps) {

    }

    componentDidMount(){
        //查询订单列表数据
        this.loadData();
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
                    return (`¥${text}`);
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
                        case 2:state = '待付订金';break;
                        case 3:state = '待付款';break;
                        case 5:state = '待付尾款';break;
                        case 7:state = '已出票';break;
                        case 8:state = '订单关闭';break;
                        case 12:state = '已付款(未录乘机人)';break;
                        case 13:state = '等待出票';break;
                        case 14:state = '支付审核中';break;
                        case 15:state = '支付审核失败';break;
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
        // let dataSource = [
        //     {
        //         index:1,
        //         key:1,
        //         orderNo:'20170923132332333',
        //         voyages:[{
        //             cityDep:'宁波',
        //             cityArr:'杭州',
        //         },],
        //         dateDep:'2017-09-13',
        //         flightType:1,
        //         peopleNum:'12/2',
        //         adultCount:3,
        //         childCount:15,
        //         orderAmount:'¥1200',
        //         createDate:'2017-08-23 16:23',
        //         orderStatus:'0',
        //         operation:'查看详情',
        //     },
        //     {
        //         index:2,
        //         key:2,
        //         orderNo:'20170923132332333',
        //         voyages:[{
        //             cityDep:'波罗地亚吉卜力岛',
        //             cityArr:'阿西列宁科克丽缇岛',
        //         }],
        //         dateDep:'2017-09-13',
        //         dateRet:'2017-09-13',
        //         flightType:2,
        //         peopleNum:'12/2',
        //         childCount:'3',
        //         orderAmount:'¥1200',
        //         createDate:'2017-08-23 16:23',
        //         orderStatus:'1',
        //         operation:'查看详情',
        //     },
        //     {
        //         index:3,
        //         key:3,
        //         orderNo:'20170923132332333',
        //         voyages:[
        //                 {
        //                     cityDep:'杭州',
        //                     cityArr:'厦门',
        //                 },{
        //                     cityDep:'北京',
        //                     cityArr:'天津',
        //                 },{
        //                     cityDep:'宁波',
        //                     cityArr:'广州',
        //                 }
        //             ],
        //         dateDep:'2017-09-13',
        //         dateRet:'2017-09-13',
        //         flightType:3,
        //         adultCount:'8',
        //         peopleNum:'12/2',
        //         orderAmount:'¥1200',
        //         createDate:'2017-08-23 16:23',
        //         orderStatus:'5',
        //         operation:'查看详情',
        //     },
        // ];


        return(
            <div className={css.mainPage}>
                <div className={css.searchContainer}>
                    <div className={css.searchItem01}>
                        <span>出发城市：</span>
                        <Input
                            value={this.state.cityDep}
                            className={css.inputStyle}
                            placeholder={'请输入'}
                            onChange={(obj)=>{
                                let value = removeSpace(obj.target.value);
                                this.changeState('cityDep',value);
                            }}
                        />
                    </div>
                    <div className={css.searchItem01}>
                        <span>目的城市：</span>
                        <Input
                            value={this.state.cityArr}
                            className={css.inputStyle}
                            placeholder={'请输入'}
                            onChange={(obj)=>{
                                let value = removeSpace(obj.target.value);
                                this.changeState('cityArr',value);
                            }}
                        />
                    </div>
                    <div className={css.searchItem02}>
                        <span>出发日期：</span>
                        <DatePicker
                            value={this.state.startDate}
                            disabledDate={this.disabledStart.bind(this)}
                            placeholder={'请选择'}
                            className={css.dateStyle}
                            format="YYYY-MM-DD"
                            onChange={(data)=>{
                                this.changeState('startDate',data);
                                if(!this.state.dateRet){
                                    this.changeState('dateRet',data);
                                }
                            }}
                        />
                        <span>—</span>
                        <DatePicker
                            value={this.state.dateRet}
                            disabledDate={this.disabledEnd.bind(this)}
                            placeholder={'请选择'}
                            className={css.dateStyle}
                            format="YYYY-MM-DD"
                            onChange={(data)=>{
                                this.changeState('dateRet',data);
                                if(!this.state.startDate){
                                    this.changeState('startDate',data);
                                }
                            }}
                        />
                    </div>
                    <div className={css.searchItem01}>
                        <span>航程类型：</span>
                        <Select
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
                            disabled={this.state.loading}
                            onClick={()=>{this.searchOrderForm();}}
                        >
                            查询
                        </Button>
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
        this.setState({
            page:currentNum,
        },this.loadData);
    }

    /**
     * 点击查询按钮
     */
    searchOrderForm(){
        if(this.isLoading()){
            return;
        }
        this.loadData();
    }

    /**
     * 请求数据
     * @param searchParames
     */
    loadData(){
        let parames = this.getSearchParames();

        let successCB = (code, msg, json, option)=>{
            //转换数据，更改状态机
            let newData = this.transformData(json);
            this.setLoading(false);
            this.setState({
                dataSource:newData,
                total:parseInt(option.total?option.total:0),
            });
        };

        let failureCB = (code, msg, option)=>{
            this.setLoading(false);
            message.error(msg);
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
            page:state.page,
            pageSize:state.pageSize,
        };
        let dateDepStart = state.startDate?getDateFormat(state.startDate.valueOf()):'',
            dateDepStop = state.dateRet?getDateFormat(state.dateRet.valueOf()):'';
        parames.dateDepStart = dateDepStart;
        parames.dateDepStop = dateDepStop;
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
                newData[key].orderStatus = transformOrderState(newData[key].orderStatus,newData[key].extraCode);
            }
        }
        return newData;
    }

}

OrderFormList.contextTypes = {
    router: React.PropTypes.object
};
module.exports = OrderFormList;