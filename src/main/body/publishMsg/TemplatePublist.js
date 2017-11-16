import React, { Component } from 'react';
import { Form, DatePicker, TimePicker, Button, Input, Row, Col, Radio, AutoComplete, Icon, message } from 'antd';
import { HttpTool ,CookieHelp} from "../../../../lib/utils/index.js";
import AutoInput from "../component/InputAuto";
import TemplatePublist from "./TemplatePublist";

import less from './PublishMsg.less';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;

class page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineType: 1,
            lineNum: 1,
            adultCount: "",
            childCount: "",
            remark: "",
            phone: "",
            listData: [],
            isMult:false
        };
        if (this.props.state) {
            this.state = this.props.state;
        }
        console.log(JSON.stringify(this.props));
        this.marginBottomRow = 8;
        this.marginBottomFormItem = 24;
        if (this.props.styleObj) {
            this.marginBottomRow = this.props.styleObj.marginBottomRow;
            this.marginBottomFormItem = this.props.styleObj.marginBottomFormItem;
            this.postHeight = this.props.styleObj.postHeight;
        }
       
    }
    check() {//拼接数据
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //组装数据
                if (values.flightType == 1 || values.flightType == 2) {//单程+往返
                    values["cityDep"] = values.fromCity0;
                    values["cityArr"] = values.toCity0;
                    values["dateDep"] = values.fromDateTime0 ? values.fromDateTime0.format(dateFormat) : "";
                    values["dateRet"] = values.toDateTime0 ? values.toDateTime0.format(dateFormat) : "";
                    values["cityCodeDep"] = "",
                        values["cityCodeArr"] = "",
                        values["voyage"] = "";
                } else if (values.flightType == 3) {//多程
                    let voyage = [];
                    for (let i = 0; i < this.state.lineNum; i++) {
                        values["cityDep"] = values.fromCity0;
                        values["cityArr"] = values.toCity+i;
                        values["dateDep"] = values.fromDateTime0 ? values.fromDateTime0.format(dateFormat) : "";
                        values["cityCodeDep"] = "",
                            values["cityCodeArr"] = "",
                            voyage.push({
                                tripIndex: (i + 1),
                                dateDep: values["fromDateTime" + i] ? values["fromDateTime" + i].format(dateFormat) : "",
                                cityDep: values["fromCity" + i],
                                cityArr: values["toCity" + i],
                                cityCodeDep: "",
                                cityCodeArr: "",
                            });
                    }
                    values["voyage"] = "{\"voyage\":" + JSON.stringify(voyage) + "}";
                }
                //回调数据
                if (this.props.callBack) {
                    this.props.callBack(values);
                    //将COOKIE 清空     
                    CookieHelp.saveCookieInfo("publishMsgCookie","");               
                }

            }
        });
    }
 
    lineTypeonChange(e) {//航线选择
        let { lineNum } = this.state;
        lineNum = e.target.value == 3 ? 3 : 1;
        this.setState({
            lineType: e.target.value, lineNum
        });
    }
    lineDel() {//多程删除
        let { lineNum } = this.state;
        lineNum = lineNum - 1;
        this.setState({
            lineNum
        });
        this.lineDetails();//控制航线信息
    }

    lineAdd() {//多程添加
        let { lineNum } = this.state;
        console.log(lineNum);
        lineNum = lineNum + 1;
        this.setState({
            lineNum
        });
        this.lineDetails();//控制航线信息
    }
    lineDetails() {//航线信息
        let { lineNum, listData } = this.state;
        const { getFieldDecorator,getFieldValue} = this.props.form;
        let div = [];
        for (let i = 0; i < lineNum; i++) {
            div.push(
                <div key={i} >
                    {this.state.lineType == 3 &&
                        <Row style={{ marginBottom: this.marginBottomRow, fontSize: "14px", color: " #29A6FF" }}>
                            <Col span={10} >
                                <span>行程{i + 1}</span>
                            </Col>
                        </Row>
                    }
                    {this.state.lineType != 3 &&
                        <Row style={{ marginBottom: this.marginBottomRow, fontSize: "14px", color: " #29A6FF" }}>
                            <Col span={10} >
                                <span></span>
                            </Col>
                        </Row>
                    }

                    <Row style={{ marginBottom: this.marginBottomRow , fontSize: "14px"}}>
                        <Col span={10} >出发城市：</Col>
                        <Col span={10} offset={3}>目的城市：</Col>
                    </Row>
                    <Row >
                        <Col span={11} >
                            <FormItem style={{ marginBottom: this.marginBottomFormItem }}>
                                {getFieldDecorator('fromCity' + i, {
                                    rules: [{
                                        required: true,
                                        message: '请输入城市名称',
                                    }],
                                    trigger: "onChangeValue",
                                    validateTrigger: "onChangeValue",
                                    initialValue: this.state.listData[i] == undefined ? "" : this.state.listData[i].fromCity
                                })(

                                    <AutoInput style={{ borderRadius: "2px" }} defaultValue={this.state.listData[i] == undefined ? "" : this.state.listData[i].fromCity}
                                        type={"from"}
                                        placeholder={'中文／拼音／三字码'} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={11} offset={2}>
                            <FormItem style={{ marginBottom: this.marginBottomFormItem }}>
                                {getFieldDecorator('toCity' + i, {
                                    rules: [{
                                        required: true,
                                        message: '请输入城市名称',
                                    }],
                                    trigger: "onChangeValue",
                                    validateTrigger: "onChangeValue",
                                    initialValue: this.state.listData[i] == undefined ? "" : this.state.listData[i].toCity
                                })(

                                    <AutoInput style={{ borderRadius: "2px" }} defaultValue={this.state.listData[i] == undefined ? "" : this.state.listData[i].toCity}
                                        type={"to"}
                                        placeholder={'中文／拼音／三字码'} />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: this.marginBottomRow , fontSize: "14px"}}>
                        <Col span={10} >出发日期：</Col>
                        {this.state.lineType == 2 &&
                            <Col span={10} offset={3}>返回日期：</Col>
                        }
                    </Row>
                    <Row >
                        <Col span={11} >
                            <FormItem style={{ marginBottom: this.marginBottomFormItem }}>
                                {getFieldDecorator('fromDateTime' + i, {
                                    rules: [{
                                        required: true,
                                        message: '请选择时间',
                                    }],
                                    initialValue: this.state.listData[i] == undefined ? "" :(this.state.listData[i].fromDateTime==undefined || this.state.listData[i].fromDateTime==""?"": moment(this.state.listData[i].fromDateTime))
                                })(
                                    <DatePicker getCalendarContainer={()=>{
                                        return this.refs.test;
                                    }}  style={{ borderRadius: "2px", minWidth: "200px", width: '100%' }} format='YYYY-MM-DD' disabledDate={(current) => {
                                        let dateend=getFieldValue("toDateTime"+i);
                                        if(dateend){
                                            dateend=moment(dateend);
                                            return current &&  (current.valueOf() <= Date.now() || current.valueOf() > dateend);
                                        }else{
                                            dateend="";
                                            return current &&  current.valueOf() <= Date.now();
                                        }
                                    }} />
                                    )}
                            </FormItem>
                        </Col>
                        {this.state.lineType == 2 &&
                            <Col span={11} offset={2}>
                                <FormItem style={{ marginBottom: this.marginBottomFormItem }}>
                                    {getFieldDecorator('toDateTime' + i, {
                                        rules: [{
                                            required: true,
                                            message: '请选择时间',
                                        }],
                                        initialValue: this.state.listData[i] == undefined ? "" :(this.state.listData[i].toDateTime==undefined || this.state.listData[i].toDateTime==""?"": moment(this.state.listData[i].toDateTime))
                                    })(
                                        <DatePicker getCalendarContainer={()=>{
                                            return this.refs.test;
                                        }} style={{ borderRadius: "2px", minWidth: "200px", width: '100%' }} format='YYYY-MM-DD' disabledDate={(current) => {
                                            let datestart=getFieldValue("fromDateTime"+i);
                                            if(datestart){
                                                datestart=moment(datestart);
                                            }else{
                                                datestart="";
                                            }
                                            return current && current.valueOf() <= (datestart== "" ? Date.now():datestart);
                                        }} />
                                        )}
                                </FormItem>
                            </Col>
                        }
                        {this.state.lineType == 3 &&
                            <Col span={11} offset={2}>
                                <Button type="primary" style={{ float: "right",borderRadius:"2px",width:60,height:36 }} disabled={this.state.lineNum != (i + 1) || i == 0 || this.state.lineNum == 2} onClick={() => this.lineDel()}>删除</Button>
                            </Col>
                        }
                    </Row>
                    {this.state.lineType == 3 && this.state.lineNum == (i + 1) && this.state.lineNum <= 5 &&
                        <Row style={{ marginBottom: this.marginBottomRow, color: "#2FA9FF",fontSize:"16px" }}>
                            <Col span={4} offset={9} style={{ width: "76px" }}>
                                <div style={{ position: "relative", cursor: "pointer" }} onClick={() => this.lineAdd()}>
                                    <Icon type="plus-circle-o" />
                                    <span style={{ float: "right",fontSize:"16px",marginLeft:10}}>加一程</span>
                                </div>
                            </Col>
                        </Row>
                    }
                </div>
            );
        }
        return div;
    }

  
    

    handleConfirmNum(str, e) {//成人人数和儿童人数判断
        let { childCount, adultCount } = this.state;
        let {setFieldsValue}=this.props.form;
        if (str == "adultCount") {
            adultCount = e.target.value;
        } else if (str == "childCount") {
            childCount = e.target.value;
        }
        this.setState({
            childCount, adultCount
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let { lineType } = this.state;
        let bottomSumbit = { textAlign: "center", paddingBottom: 40, paddingTop: 20 };
        let phoneCookie =CookieHelp.getCookieInfo("phone")==undefined?"":CookieHelp.getCookieInfo("phone");
        return (
            <div className={less.content} ref={"test"}>
                <div style={{ margin: "20px 0px" }}>
                    <div style={{width:"518px",height:"0px",border:"1px dashed #CBD3E5"}}></div>
                </div>
                <div className={less.innerbox} style={{ overflow: "auto", height: this.postHeight, overflowX: "hidden" }}>
                    {/**多选择*/}
                    <Row style={{ marginBottom: this.marginBottomRow , fontSize: "14px"}}>
                        <Col span={4}>航程类型：</Col>
                    </Row>
                    <Row >
                        <FormItem style={{ marginBottom: this.marginBottomFormItem }}>
                            {getFieldDecorator('flightType', {//lineType
                                initialValue: this.state.lineType,
                            })(
                                <RadioGroup style={{ fontSize: "12px"}} onChange={(e) => this.lineTypeonChange(e)}>
                                    <Radio value={1}>单程</Radio>
                                    <Radio value={2}>往返</Radio>
                                    {!this.state.isMult && 
                                        <Radio value={3}>多程</Radio>
                                    }
                                </RadioGroup>
                                )}
                        </FormItem>
                    </Row>
                    {/*航线+时间*/}
                    {this.lineDetails()}
                    {/**出行人数*/}
                    <Row style={{ marginBottom: this.marginBottomRow , fontSize: "14px"}}>
                        <Col span={4}>出行人数：</Col>
                    </Row>
                    <Row >
                        <Col span={10} >
                            <FormItem style={{ marginBottom: this.marginBottomFormItem }}>
                                {getFieldDecorator('adultCount', {//adultCount
                                    rules: [{
                                        required: true,
                                        message: '请输入成人人数',
                                    }, {
                                        pattern: /^[1-9]{1}\d*$/,
                                        message: '请输入正确的数字'
                                    }
                                ],
                                    initialValue: this.state.adultCount,
                                })(
                                    <div style={{ position: "relative" }}>
                                        <span style={{ position: "absolute", zIndex: 1, right: "20px", color: "#cacaca" ,marginTop:"3px", fontSize: "14px"}}>成人</span>
                                        <Input style={{ width: 207, height: 36, borderRadius: "2px" }} defaultValue={this.state.adultCount} onChange={(e) => this.handleConfirmNum("adultCount", e)} maxLength="4" />
                                    </div>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={10} offset={1}>
                            <FormItem style={{ marginBottom: this.marginBottomFormItem }}>
                                {getFieldDecorator('childCount', {//childCount
                                    rules: [{
                                        pattern: /^[0-9]*$/,
                                        message: '请输入正确的数字'
                                    }],
                                    initialValue: this.state.childCount,
                                })(
                                    <div style={{ position: "relative" }}>
                                        <span style={{ position: "absolute", zIndex: 1, right: "20px", color: "#cacaca" ,marginTop:"3px", fontSize: "14px"}}>儿童(2～12周岁)</span>
                                        <Input style={{ width: 207, height: 36, borderRadius: "2px" }} defaultValue={this.state.childCount} maxLength="4" onChange={(e) => this.handleConfirmNum("childCount", e)} />
                                    </div>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={3}>
                            <div style={{ height: 32, lineHeight: "32px", float: "right",fontSize: "14px" }}>共:{(this.state.adultCount == "" || !/^\d*$/.test(this.state.adultCount) ? 0 : parseInt(this.state.adultCount)) + (this.state.childCount == "" || !/^\d*$/.test(this.state.childCount) ? 0 : parseInt(this.state.childCount))}人</div>
                        </Col>
                    </Row>

                    <Row style={{ marginBottom: this.marginBottomRow, fontSize: "14px" }}>
                        <Col span={4}>备注(选填)：</Col>
                    </Row>
                    <Row>
                        <Col >
                            <FormItem style={{ marginBottom: this.marginBottomFormItem }}>
                                {getFieldDecorator('remark', {//annotation
                                    rules: [],
                                    initialValue: this.state.remark,
                                })(
                                    <Input type="textarea" maxLength="100" style={{ height: 180, resize: "none", borderRadius: 2,fontSize:"16px" }} placeholder="如：价格、时间等" />
                                    )}
                            </FormItem>

                        </Col>
                    </Row>
                    <Row style={{ marginBottom: this.marginBottomRow , fontSize: "14px"}}>
                        <Col span={4}>联系电话：</Col>
                    </Row>
                    <Row>
                        <Col >
                            <FormItem style={{ marginBottom: this.marginBottomFormItem }}>
                                {getFieldDecorator('mobile', {
                                    rules: [{
                                        required: true,
                                        message: '请输入联系电话',
                                    }, {
                                        pattern: /^1[0-9]{10}$/,
                                        message: '请输入正确的11位手机号码'
                                    }],
                                    initialValue: phoneCookie,
                                })(
                                    <div style={{ width: "100%" }}>
                                        <Input style={{ width: 240, height: 36, borderRadius: "2px",fontSize:"16px" }} defaultValue={phoneCookie} placeholder="输入可联系的手机号码" />
                                        {/* <span style={{ fontSize: "22px", color: "red", marginLeft: 10 }}>*</span> */}
                                    </div>
                                    )}
                            </FormItem>

                        </Col>
                    </Row>
                </div>
                <Row style={bottomSumbit}>
                    <Button type="primary" style={{ width: 170, height: 36, borderRadius: "2px", fontSize: 16 }} onClick={() => this.check()}>提交需求</Button>
                </Row>
            </div >
        );
    }
}

const publishMsg = Form.create()(page);
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = publishMsg;

