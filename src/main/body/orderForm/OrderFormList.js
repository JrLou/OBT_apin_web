/**
 * Created by louxudong on 2017/10/30.
 */
import React, {Component} from 'react';
import css from './OrderFormList.less';
import { HttpTool } from '../../../../lib/utils/index.js';
import APILXD from "../../../api/APILXD.js";
import {routeTranslate,getDateFormat,removeSpace} from '../tool/LXDHelp.js';
import {Table,Input,DatePicker,Select,Button,message} from 'antd';
import moment from 'moment';
const Option = Select.Option;

class OrderFormList extends Component{
    constructor(props) {
        super(props);
        //状态机
        this.state = {
            cityDep:'',
            cityArrive:'',
            flightType:'',
            orderStatus:'',
            startDate:null,
            endDate:null,

            dataSource:null,        //传入Table组件的数据

            pageSize:10,            //每页展示数据数目
            pageNumber:1,           //列表当前页
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
                dataIndex:'orderNum',
            },{
                title:'航程',
                dataIndex:'route',
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
                dataIndex:'endDate',
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
                render:(text,recode)=>{
                    let adultNum = recode.adult?recode.adult:0;
                    let childNum = recode.child?recode.child:0;
                    return (''+adultNum+'/'+childNum);
                }
            },{
                title:'含税价格',
                dataIndex:'price',
            },{
                title:'订单创建时间',
                dataIndex:'createDate',
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
                                    data:{}
                                });
                            }}
                    >
                        {text}
                    </span>
                ),
            },
        ];
        let dataSource = [
            {
                index:1,
                key:1,
                orderNum:'20170923132332333',
                route:[{
                    cityDep:'宁波',
                    cityArrive:'杭州',
                },],
                dateDep:'2017-09-13',
                flightType:1,
                peopleNum:'12/2',
                adult:3,
                child:15,
                price:'¥1200',
                createDate:'2017-08-23 16:23',
                orderStatus:'0',
                operation:'查看详情',
            },
            {
                index:2,
                key:2,
                orderNum:'20170923132332333',
                route:[{
                    cityDep:'波罗地亚吉卜力岛',
                    cityArrive:'阿西列宁科克丽缇岛',
                }],
                dateDep:'2017-09-13',
                endDate:'2017-09-13',
                flightType:2,
                peopleNum:'12/2',
                child:'3',
                price:'¥1200',
                createDate:'2017-08-23 16:23',
                orderStatus:'1',
                operation:'查看详情',
            },
            {
                index:3,
                key:3,
                orderNum:'20170923132332333',
                route:[
                        {
                            cityDep:'杭州',
                            cityArrive:'厦门',
                        },{
                            cityDep:'北京',
                            cityArrive:'天津',
                        },{
                            cityDep:'宁波',
                            cityArrive:'广州',
                        }
                    ],
                dateDep:'2017-09-13',
                endDate:'2017-09-13',
                flightType:3,
                adult:'8',
                peopleNum:'12/2',
                price:'¥1200',
                createDate:'2017-08-23 16:23',
                orderStatus:'5',
                operation:'查看详情',
            },
        ];


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
                            value={this.state.cityArrive}
                            className={css.inputStyle}
                            placeholder={'请输入'}
                            onChange={(obj)=>{
                                let value = removeSpace(obj.target.value);
                                this.changeState('cityArrive',value);
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
                                if(!this.state.endDate){
                                    this.changeState('endDate',data);
                                }
                            }}
                        />
                        <span>—</span>
                        <DatePicker
                            value={this.state.endDate}
                            disabledDate={this.disabledEnd.bind(this)}
                            placeholder={'请选择'}
                            className={css.dateStyle}
                            format="YYYY-MM-DD"
                            onChange={(data)=>{
                                this.changeState('endDate',data);
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
                            columns={columns}
                            dataSource={dataSource}
                            loading={{
                                spinning:this.state.loading,
                                size:'large',
                            }}
                            pagination={{
                                current:this.state.pageNumber,
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
        if(this.state.endDate){
            return (date.valueOf()>this.state.endDate.valueOf()||date.valueOf()<this.earliest.valueOf());
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
            pageNumber:currentNum,
        },this.loadData());
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
        };

        let failureCB = (code, msg, option)=>{
            this.setLoading(false);
            // message.error(msg);
            message.error('测试-请求错误的回调');
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
     * 从状态机中解析出请求需要的参数
     * @returns {{}}
     */
    getSearchParames(){
        let state = this.state;
        let parames = {
            bdCharger:'',
            customerName:'',
            orderStatus:state.orderStatus,
            cityDep:state.cityDep,
            cityArrive:state.cityArrive,
            flightType:state.flightType,
            pageNumber:state.pageNumber,
            pageSize:state.pageSize,
        };
        let dateDepStart = state.startDate?getDateFormat(state.startDate.valueOf()):'',
            dateDepStop = state.endDate?getDateFormat(state.endDate.valueOf()):'';
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
     * 对后台传回对数据进行解析，返回格式化对数据
     * @param data
     * @returns {Array}
     */
    transformData(data){
        let newData = [];
        if(data instanceof Array){
            log(1);
        }
        return newData;
    }

}

OrderFormList.contextTypes = {
    router: React.PropTypes.object
};
module.exports = OrderFormList;