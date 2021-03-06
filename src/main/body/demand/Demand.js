/**
 * Created by liuqing on 2017/10/30.
 */
import React, {Component} from 'react';
import css from './Demand.less';
import {HttpTool} from '../../../../lib/utils/index.js';
import APILXD from "../../../api/APILXD.js";
import {routeTranslate,getDateFormat,removeSpace,transformOrderState} from '../tool/LXDHelp.js';
import {Table, Input, DatePicker, Select, Button, message} from 'antd';
import APIGYW from '../../../api/APIGYW';
import moment from 'moment';
import InputAuto from '../component/InputForList.js';
import datePlaceholder from '../component/SignView/datePlaceholder.js';

const Option = Select.Option;

class page extends Component {
    constructor(props) {
        super(props);
        //状态机


        this.earliest = new Date(2015, 0, 1);
        this.placeholderStyle = {fontSize:'14',color:'#c4c4c4'};


        //航程类型
        this.flightTypeList = [
            {
                title: '单程',
                value: '1',
            }, {
                title: '往返',
                value: '2',
            }, {
                title: '多程',
                value: '3',
            }, {
                title: '全部',
                value: '-1',
            },
        ];
        //需求状态
        this.flightType = [
            {
                title: '需求已取消',
                value: '0',
            }, {
                title: '需求处理中',
                value: '1',
            },{
                title: '待确认',
                value: '3',
            }, {
                title: '处理完成',
                value: '4',
            }, {
                title: '需求关闭',
                value: '5',
            }, {
                title: '全部',
                value: '-1',
            }
        ];
        this.state = {
            cityDep: '',
            cityArrive: '',
            flightType: this.flightType[5].value,
            demandStatus:  this.flightTypeList[3].value,
            startDate: null,
            endDate: null,
            dataSource: null,        //传入Table组件的数据
            pageSize: 10,            //每页展示数据数目
            pageNumber: 1,           //列表当前页
            total: 0,                //总数据
            loading: false,         //是否处于加载状态
        };

        //点击分页器的查询条件
        this.searchParames = {
            cityDep:'',
            cityArrive:'',
            flightType:'',
            orderStatus:'',
            startDate:null,
            dateRet:null,
            pageSize: 10,
        };
    }


    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {
        //查询订单列表数据
        this.loadData(1,true);
    }

    /**
     * 绘制下拉选项
     * @param data
     * @returns {Array}
     */
    getOptions(data) {
        let options = [];
        if (data instanceof Array) {
            for (let key in data) {
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


    render() {

        let columns = [
            {
                title: '序号',
                dataIndex: 'key',
            }, {
                title: '航程',
                dataIndex: 'voyage',
                render:(list,record)=>{
                    let flightType = record.type;
                    let view = routeTranslate(list,flightType);
                    return view;
                },
            }, {
                title: '出发日期',
                dataIndex: 'dateDep',
            }, {
                title: '返回日期',
                dataIndex: 'dateRet',
            }, {
                title: '航程类型',
                dataIndex: 'flightType',
            }, {
                title: '人数(成人／儿童)',
                dataIndex: 'num',
            }, {
                title: '总金额',
                dataIndex: 'orderAmount',
            }, {
                title: '需求状态',
                dataIndex: 'demandStatus',
                render:(list,record)=>{
                  return(
                      <font style={{color:record.status===3?"#ff9a00":""}}>
                          {record.demandStatus}
                      </font>
                      );
                },
            }, {
                title: '创建时间',
                dataIndex: 'createdTime',
            }, {
                title: '操作',
                render: (text, record) => (
                    <span
                        className={css.operation}
                        onClick={() => {
                            window.app_open(this, "/DemandDetail", {
                              id:record.id
                            });
                        }}
                    >
                        查看详情
                    </span>
                ),
            },
        ];


        return (
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
                                this.setState({cityArrive:val});
                            }
                            }
                            onChangeValue={(val)=>{
                                this.setState({cityArrive:val});
                            }}
                            getClearAction={(clearAction)=>{this.clearArriveCity = clearAction;}}

                        />
                    </div>
                    <div className={css.searchItem02}>
                        <span>出发日期：</span>
                        {datePlaceholder(<DatePicker
                            value={this.state.startDate}
                            className={css.dateStyle}
                            placeholder={'请选择日期'}
                            disabledDate={this.disabledStart.bind(this)}
                            format="YYYY-MM-DD"
                            onChange={(data)=>{
                                this.changeState('startDate',data);
                                if(!this.state.endDate){
                                    this.changeState('endDate',data);
                                }
                            }}
                        />,{width:'34%'},this.placeholderStyle)}
                        <span> — </span>
                        {datePlaceholder(<DatePicker
                            value={this.state.endDate}
                            placeholder={'请选择日期'}
                            disabledDate={this.disabledEnd.bind(this)}
                            className={css.dateStyle}
                            format="YYYY-MM-DD"
                            onChange={(data)=>{
                                this.changeState('endDate',data);
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
                            className={css.selectStyle}
                            placeholder={'请选择'}
                            onChange={(value) => {
                                this.changeState('flightType', value);
                            }}

                            value={this.state.flightType}

                        >
                            {this.getOptions(this.flightTypeList)}
                        </Select>
                    </div>
                    <div className={css.searchItem01}>
                        <span>需求状态：</span>
                        <Select
                            prefixCls={'my-ant-select'}
                            value={this.state.demandStatus}
                            className={css.selectStyle}
                            placeholder={'请选择'}
                            onChange={(value) => {
                                this.changeState('demandStatus', value);
                            }}
                        >
                            {this.getOptions(this.flightType)}
                        </Select>
                    </div>
                    <div className={css.searchItem01}>
                        <Button
                            className={css.buttonStyle}
                            type="primary"
                            onClick={() => {
                                this.searchOrderForm();
                            }}
                        >
                            查询
                        </Button>
                        <span className={css.clearBtn}
                              onClick={() => {
                                  this.clearDepCity();
                                  this.clearArriveCity();
                                  this.setState({
                                      cityDep: '',
                                      cityArrive: '',
                                      flightType: this.flightType[5].value,
                                      demandStatus:  this.flightTypeList[3].value,
                                      startDate: null,
                                      endDate: null,
                                  },()=>{this.loadData(1,true);});
                              }}
                        >清空查询条件</span>
                    </div>

                </div>
                <div className={css.resultContainer}>
                    <Button
                        className={css.buttonRelease}
                        type="primary"
                        onClick={() => {
                            window.app_open(this, "/PublishMsg", {});
                        }}
                    >
                        发布需求
                    </Button>
                    <Table
                        prefixCls={'my-ant-table'}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        loading={{
                            spinning: this.state.loading,
                            size: 'large',
                        }}
                        pagination={{
                            current: this.state.pageNumber,
                            total: this.state.total,
                            defaultCurrent: 1,
                            showQuickJumper: true,
                        }}
                        onChange={(pagination, filters, sorter) => {
                            this.pageNumChange(pagination, filters, sorter);
                        }}
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
    changeState(field, value) {
        this.setState({
            [field]: value,
        });
    }

    /**
     * 动态设置时间组件的禁止日期
     * @param date
     * @returns {boolean}
     */
    disabledStart(date) {
        if (!date) {
            return true;
        }
        if (this.state.endDate) {
            return (date.valueOf() > this.state.endDate.valueOf() || date.valueOf() < this.earliest.valueOf());
        } else {
            return date.valueOf() < this.earliest.valueOf();
        }
    }

    disabledEnd(date) {
        if (!date) {
            return true;
        }
        if (this.state.startDate) {
            return (date.valueOf() < this.state.startDate.valueOf() || date.valueOf() < this.earliest.valueOf());
        } else {
            return date.valueOf() < this.earliest.valueOf();
        }
    }


    /**
     * 去除字符串前后的空格
     * @param text
     * @returns {string}
     */
    replaceSpace(text) {
        if (typeof(text) === 'string') {
            return text.replace(/(^\s+)|(\s+$)/g, '');
        } else {
            return '';
        }
    }

    /**
     * 分页器改变页码
     * @param num
     */
    pageNumChange(pagination, filters, sorter) {
        if(this.isLoading()){
            return;
        }
        let currentNum = pagination.current;
        this.loadData(currentNum,false);

    }

    /**
     * 点击查询按钮
     */
    searchOrderForm() {
        if(this.isLoading()){
            return;
        }
        this.loadData(1,true);
    }

    /**
     * 请求数据
     * @param searchParames
     */
    loadData(currentNum,type) {
        let parames = this.getSearchParames();
        parames.pageNum = currentNum;
        let successCB = (code, msg, json, option) => {
            this.setLoading(false);
            let arr = [];
            let datas = {};
            if (!json) {
                this.setState({
                    dataSource: []
                });
            } else {
                let flightType = ["单程", "往返", "多程"];
                let demandStatus = ["需求已取消", "需求处理中", "需求处理中", "待确认", "处理完成", "需求关闭"];

                json.map((data, index) => {
                    datas = {
                        id:data.id,
                        key: index + 1,
                        voyage: JSON.parse(data.voyage),
                        cityArr: data.cityArr,
                        cityDep: data.cityDep,
                        createdTime: data.createdTime,
                        type:data.flightType,
                        flightType: data.flightType === -1 ? "全部" : flightType[data.flightType - 1],
                        num:data.adultCount + "/" +  data.childCount ,
                        orderAmount: data.orderAmount ? "¥" + data.orderAmount : "无",
                        status: data.demandStatus,
                        demandStatus: data.demandStatus === -1 ? "全部" : demandStatus[data.demandStatus],
                        dateRet: data.dateRet ? data.dateRet : "无",
                        dateDep: data.dateDep ? data.dateDep : "无",
                    };
                    arr.push(datas);
                });
                this.setState({
                    pageNumber:currentNum,
                    total:option.option.total,
                    dataSource: arr
                });
            }

        };

        let failureCB = (code, msg, option) => {
            this.setLoading(false);
            message.error(msg);
        };

        this.setLoading(true, () => {
            HttpTool.request(HttpTool.typeEnum.POST, APIGYW.demand_list, successCB, failureCB, parames,
                {
                    ipKey: "hlIP"
                });
        });

    }

    /**
     * 从状态机中解析出请求需要的参数
     * @returns {{}}
     */
    getSearchParames() {
        let state = this.state;
        let parames = {
            demandStatus: state.demandStatus,
            cityDep: state.cityDep,
            cityArr: state.cityArrive,
            flightType: state.flightType,
            pageNum: state.pageNumber,
            pageSize: state.pageSize,
        };
        let dateDepStart = state.startDate ? this.getDateFormat(state.startDate.valueOf()) : '',
            dateDepStop = state.endDate ? this.getDateFormat(state.endDate.valueOf()) : '';
        parames.startDate = dateDepStart;
        parames.endDate = dateDepStop;
        return parames;
    }

    /**
     * 从时间对象中解析出特定时间格式字符串
     * @param time
     * @returns {string}   eg:20170324
     */
    getDateFormat(time) {
        let date = '';
        if (time) {
            let newDate = new Date(time);
            let year = newDate.getFullYear();
            let month = (newDate.getMonth() + 1) > 9 ? (newDate.getMonth() + 1) : '0' + (newDate.getMonth() + 1);
            let day = newDate.getDate() > 9 ? newDate.getDate() : '0' + newDate.getDate();
            date =year +"-"+ month +"-"+ day;
        }
        return date;
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

page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;

