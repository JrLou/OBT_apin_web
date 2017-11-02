/**
 * Created by louxudong on 2017/10/30.
 */
import React, {Component} from 'react';
import css from './OrderFormList.less';
import { HttpTool } from '../../../../lib/utils/index.js';
import APILXD from "../../../api/APILXD.js";
import LoadingView from "../component/LoadingView.js";
import Table from "../component/Table/index.js";
import {Pagination,Input,DatePicker,Select,Button} from 'antd';
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
        };

        this.earliest = new Date(2015,0,1);

    }


    componentWillReceiveProps(nextProps) {

    }

    componentDidMount(){

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
            },{
                title:'出发日期',
                dataIndex:'data',
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
                data:'2017-09-13',
                routeType:'往返',
                peopleNum:'12/2',
                price:'¥1200',
                orderState:'等待确认',
                operation:'查看详情',
            },
            {
                index:1,
                key:1,
                orderNum:'20170923132332333',
                route:'波罗地亚吉卜力岛-阿西列宁科克丽缇岛',
                data:'2017-09-13',
                routeType:'往返',
                peopleNum:'12/2',
                price:'¥1200',
                orderState:'等待确认',
                operation:'查看详情',
            },
            {
                index:1,
                key:1,
                orderNum:'20170923132332333',
                route:'杭州-宁波',
                data:'2017-09-13',
                routeType:'往返',
                peopleNum:'12/2',
                price:'¥1200',
                orderState:'等待确认',
                operation:'查看详情',
            },
        ];
        let routeType = [
            {
                title:'等待确认',
                value:'0',
            },
            {
                title:'支付订单',
                value:'1',
            }
        ];


        return(
            <div className={css.mainPage}>
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
                            className={css.inputStyle}
                            placeholder={'请选择'}
                            onChange={(value)=>{
                                this.changeState('routeType',value);
                            }}
                        >
                            {this.getOptions(routeType)}
                        </Select>
                    </div>
                    <div className={css.searchItem01}>
                        <span>订单状态：</span>
                        <Select
                            className={css.inputStyle}
                            placeholder={'请选择'}
                            onChange={(value)=>{
                                this.changeState('orderState',value);
                            }}
                        >
                            {this.getOptions(routeType)}
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
        log(num);
    }

    /**
     * 点击查询按钮
     */
    searchOrderForm(){
        log(this.state);
    }
}

OrderFormList.contextTypes = {
    router: React.PropTypes.object
};
module.exports = OrderFormList;