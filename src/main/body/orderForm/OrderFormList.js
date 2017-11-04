/**
 * Created by louxudong on 2017/10/30.
 */
import React, {Component} from 'react';
import css from './OrderFormList.less';
import { HttpTool } from '../../../../lib/utils/index.js';
import APILXD from "../../../api/APILXD.js";
import LoadingView from "../component/LoadingView.js";
import Table from "../component/Table/index.js";
import {Pagination,Input,DatePicker,Select,Button,Spin} from 'antd';
import moment from 'moment';
const Option = Select.Option;

class OrderFormList extends Component{
    constructor(props) {
        super(props);
        //状态机
        this.state = {
            startCity:'',
            endCity:'',
            routeType:'',
            orderState:'',
            startDate:null,
            endDate:null,

            pageSize:10,            //每页展示数据数目
            currentPage:1,          //列表当前页

            loading: false,          //是否处于加载状态
        };

        this.earliest = new Date(2015,0,1);

        //航程类型
        this.routeTypeList = [
            {
                title:'单程',
                value:'0',
            },
            {
                title:'往返',
                value:'1',
            },{
                title:'多程',
                value:'2',
            },
        ];
        //订单状态
        this.routeType = [
            {
                title:'订单取消',
                value:'0',
            },
            {
                title:'等待确认',
                value:'1',
            }
        ];

    }


    componentWillReceiveProps(nextProps) {

    }

    componentDidMount(){
        //查询订单列表数据
        this.setLoading(true,this.loadData());
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
                render:(text,record)=>(
                    <div className={css.routeStyle}>
                        {text}
                    </div>
                ),
            },{
                title:'出发日期',
                dataIndex:'startDate',
            },{
                title:'返回日期',
                dataIndex:'endDate',
            },{
                title:'航程类型',
                dataIndex:'routeType',
            },{
                title:'人数(成人／儿童)',
                dataIndex:'peopleNum',
            },{
                title:'含税价格',
                dataIndex:'price',
            },{
                title:'订单创建时间',
                dataIndex:'createDate',
            },{
                title:'订单状态',
                dataIndex:'orderState',
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
                route:'杭州-宁波',
                startDate:'2017-09-13',
                routeType:'单程',
                peopleNum:'12/2',
                price:'¥1200',
                createDate:'2017-08-23 16:23',
                orderState:'等待确认',
                operation:'查看详情',
            },
            {
                index:2,
                key:2,
                orderNum:'20170923132332333',
                route:'波罗地亚吉卜力岛-阿西列宁科克丽缇岛',
                startDate:'2017-09-13',
                endDate:'2017-09-13',
                routeType:'往返',
                peopleNum:'12/2',
                price:'¥1200',
                createDate:'2017-08-23 16:23',
                orderState:'等待确认',
                operation:'查看详情',
            },
            {
                index:3,
                key:3,
                orderNum:'20170923132332333',
                route:'杭州-宁波，上海-天津，北京-厦门',
                startDate:'2017-09-13',
                endDate:'2017-09-13',
                routeType:'多程',
                peopleNum:'12/2',
                price:'¥1200',
                createDate:'2017-08-23 16:23',
                orderState:'已付款（未录乘机人）',
                operation:'查看详情',
            },
        ];
        dataSource = dataSource.concat(dataSource).concat(dataSource);


        return(
            <div className={css.mainPage}>
                <Spin spinning={this.state.loading} size={'large'}>
                <div className={css.searchContainer}>
                    <div className={css.searchItem01}>
                        <span>出发城市：</span>
                        <Input
                            value={this.state.startCity}
                            className={css.inputStyle}
                            placeholder={'请输入'}
                            onChange={(obj)=>{
                                let value = this.replaceSpace(obj.target.value);
                                this.changeState('startCity',value);
                            }}
                        />
                    </div>
                    <div className={css.searchItem01}>
                        <span>目的城市：</span>
                        <Input
                            value={this.state.endCity}
                            className={css.inputStyle}
                            placeholder={'请输入'}
                            onChange={(obj)=>{
                                let value = this.replaceSpace(obj.target.value);
                                this.changeState('endCity',value);
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
                                this.changeState('routeType',value);
                            }}
                        >
                            {this.getOptions(this.routeTypeList)}
                        </Select>
                    </div>
                    <div className={css.searchItem01}>
                        <span>订单状态：</span>
                        <Select
                            className={css.selectStyle}
                            placeholder={'请选择'}
                            onChange={(value)=>{
                                this.changeState('orderState',value);
                            }}
                        >
                            {this.getOptions(this.routeType)}
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
                    </div>
                </div>
                <div className={css.resultContainer}>

                        <Table
                            columns={columns}
                            dataSource={dataSource}
                        />
                        <div className={css.pagination}>
                            <Pagination
                                showQuickJumper
                                total={500}
                                defaultCurrent={1}
                                defaultPageSize={8}
                                onChange={(num)=>{this.pageNumChange(num);}}
                            />
                        </div>
                </div>
                </Spin>
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
     * 去除字符串前后的空格
     * @param text
     * @returns {string}
     */
    replaceSpace(text){
        if(typeof(text) === 'string'){
            return text.replace(/(^\s+)|(\s+$)/g,'');
        }else{
            return '';
        }
    }

    /**
     * 分页器改变页码
     * @param num
     */
    pageNumChange(num){
        if(this.isLoading()){
            return;
        }
        log(num);
    }

    /**
     * 点击查询按钮
     */
    searchOrderForm(){
        if(this.isLoading()){
            return;
        }
        log(this.state);
    }

    /**
     * 请求数据
     * @param searchParames
     */
    loadData(){
        let parames = this.getSearchParames();

        let successCB = (code, msg, json, option)=>{
            this.setLoading(false);
        };

        let failureCB = (code, msg, option)=>{
            this.setLoading(false);
        };

        // HttpTool.request(HttpTool.typeEnum.POST,APILXD.XXXXXXXX, successCB, failureCB, parames,
        //     {
        //         ipKey: "hlIP"
        //     });

        //模拟接口
        setTimeout(()=>{
            let num = Math.random();
            if(num<0.5){
                successCB();
            }else{
                failureCB();
            }
        },1000);
    }

    /**
     * 从状态机中解析出请求需要的参数
     * @returns {{}}
     */
    getSearchParames(){
        let state = this.state;
        let parames = {
            pageSize:state.pageSize,
            //todo 完善请求参数
        };
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

}

OrderFormList.contextTypes = {
    router: React.PropTypes.object
};
module.exports = OrderFormList;