/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component} from "react";
import {DatePicker,Button,Select,Table} from "antd";
import css from "./index.less";

const monthFormat = 'YYYY年MMMD日';
import moment from 'moment';
const Option = Select.Option;
const {Column, ColumnGroup} = Table;
class MyDemandView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            startValue:moment(),
            endValue:moment(),
            endOpen: false,
            type:null,
            status:null
        };
    }

    componentDidMount() {

    }
    getData() {
        return {
            fromPlace: this.refs.fromPlace.getValue(),
            toPlace: this.refs.toPlace.getValue(),
            startValue:this.state.startValue,
            endValue:this.state.endValue,
            type:this.state.type,
            status:this.state.status,
        };
    }
    disabledStartDate(value){
        var data=new Date();
        data.setFullYear(2015,0,1);
        return value && value.valueOf() < data;
    }
    disabledEndDate(value){
        return value && value.valueOf() < this.state.startValue;
    }
    onChange(field, value) {
        this.setState({
            [field]: value,
        });
    }

    onStartChange(value) {
        this.onChange('startValue', value);
        this.onChange('endValue', value);
    }

    onEndChange(value) {
        this.onChange('endValue', value);
    }

    handleStartOpenChange(open) {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    handleEndOpenChange(open) {
        this.setState({ endOpen: open });

    }
    handleChangeType(value){
        this.setState({ type: value });
    }
    handleChangeStatus(value){
        this.setState({ status: value });
    }
    render() {

        return (
            <div style={{padding:10}} ref="main">
                出发城市：<input ref="fromPlace" style={{marginRight:30,width:200}}/>
                目的城市：<input ref="toPlace" style={{marginRight:30,width:200}}/>
                出发日期：
                <DatePicker
                    allowClear = {false}
                    getCalendarContainer={() => this.refs.main}
                    format={monthFormat}
                    disabledDate={this.disabledStartDate.bind(this)}
                    onChange={this.onStartChange.bind(this)}
                    value={this.state.startValue}
                    onOpenChange={this.handleStartOpenChange.bind(this)}
                />
                <font style={{paddingRight:5,paddingLeft:5}}>~</font>
                <DatePicker
                    allowClear = {false}
                    getCalendarContainer={() => this.refs.main}
                    format={monthFormat}
                    disabledDate={this.disabledEndDate.bind(this)}
                    onChange={this.onEndChange.bind(this)}
                    open={this.state.endOpen}
                    value={this.state.endValue}
                    onOpenChange={this.handleEndOpenChange.bind(this)}
                    style={{marginRight:30}}/>
                航程类型：
                <Select style={{width:100,marginRight:40}} onChange={this.handleChangeType.bind(this)}>
                    <Option value="0">哈哈</Option>
                    <Option value="1">呵呵</Option>
                    <Option value="3">嘿嘿</Option>
                    <Option value="">全部</Option>
                </Select>
                订单状态：
                <Select style={{width:100,marginTop:20}} onChange={this.handleChangeStatus.bind(this)}>
                    <Option value="0">待付款</Option>
                    <Option value="1">待发货</Option>
                    <Option value="3">已取消</Option>
                    <Option value="">全部</Option>
                </Select>
                <Button style={{marginLeft:20,backgroundColor:"#29A6FF",color:"#fff"}}>查询</Button>
                <font style={{marginLeft:20,color:"#29A6FF"}}>清空查询条件</font>
                <br/> <br/>
                <Button style={{margin:20,backgroundColor:"#29A6FF",color:"#fff"}}>发布需求</Button>
                <div>
                    <Table >
                        <Column
                            title="序号"
                            key="key"
                        />
                        <Column
                            title="航程"
                            key="kewys"
                        />
                        <Column
                            title="出发日期"
                            key="kesy"
                        />
                        <Column
                            title="需求类型"
                            key="akey"
                        />
                        <Column
                            title="航程状态"
                            key="kszey"
                        />
                        <Column
                            title="天数"
                            key="kezy"
                        />
                        <Column
                            title="人数（成人／儿童）"
                            key="kcey"
                        />
                        <Column
                            title="总金额"
                            key="kevy"
                        />
                        <Column
                            title="需求状态"
                            key="kbey"
                        />
                        <Column
                            title="创建时间"
                            key="ekey"
                        />
                        <Column
                            title="操作"
                            key="kewy"
                        />
                    </Table>
                </div>
            </div>
        );
    }
}

module.exports = MyDemandView;