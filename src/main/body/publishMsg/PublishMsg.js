import React, { Component } from 'react';
import { Form, DatePicker, TimePicker, Button, Input, Row, Col, Radio, AutoComplete, Icon, message } from 'antd';
import { HttpTool } from "../../../../lib/utils/index.js";
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
        };
    }
    httpPostAdd(param) {//发送数据
        let success = (code, msg, json, option) => {
            //   console.log(msg);
            message.success(msg);
        };
        let failure = (code, msg, option) => {
            //   console.log(msg);
            message.error(msg);
        };
        //  let api ="http://192.168.0.58:6300/demandapi/v1.0/demands";
        let api = "/demandapi/v1.0/demands";
        HttpTool.request(HttpTool.typeEnum.POST, api, success, failure, param);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let { lineType } = this.state;
        return (
            <div className={less.content}>
                <div style={{ paddingTop: 10, width: 520, margin: "auto" }}>
                    {/**标题*/}
                    <div style={{ position: "relative" }}>
                        <div style={{ width: 6, height: 20, position: "absolute", backgroundColor: "#29A6FF", marginTop: 8 }}></div>
                        <div style={{ color: "#333", fontSize: 20, marginLeft: 22 }}>需求信息</div>
                    </div>
                    {/** state={{lineType:3,lineNum:1,adultCount:"10",childCount:"10",remark:"",phone:"",listData:[{fromCity:"北京",toCity:"杭州",fromDateTime:"2017-11-20",toDateTime:"2017-11-20"}]}}*/}
                    <TemplatePublist  callBack={(e) => {
                        this.httpPostAdd(e);
                    }} />
                </div>
            </div >
        );
    }
}

const publishMsg = Form.create()(page);
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = publishMsg;

