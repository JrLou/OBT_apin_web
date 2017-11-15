import React, { Component } from 'react';
import { Form, DatePicker, TimePicker, Button, Input, Row, Col, Radio, AutoComplete, Icon, message } from 'antd';
import { HttpTool } from "../../../../lib/utils/index.js";
import APIGYW from "../../../api/APIGYW.js";
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
        let par = window.app_getPar(this);
        this.param = par.data?par.data:{};

        alert(JSON.stringify(this.param));
    }
    httpPostAdd(param) {//发送数据
        let success = (code, msg, json, option) => {
            //   console.log(msg);
            message.success(msg);
            //跳转到---
            window.app_open(this, "/Demand",{});
        };
        let failure = (code, msg, option) => {
            //   console.log(msg);
            message.error(msg);
        };
        //  let api ="http://192.168.0.58:6300/demandapi/v1.0/demands";
        // let api = "/demandapi/v1.0/demands";
        HttpTool.request(HttpTool.typeEnum.POST, APIGYW.demandapi_demands, success, failure, param);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let {data}=this.props.location.query;
        let lineType=2;
        data=JSON.parse(data);
        if(data.lineType!=undefined && ["1","2","3"].indexOf(data.lineType)>-1){
            lineType=parseInt(data.lineType);
        }
        let toCity="";
        if(data.toCity!=undefined){
            toCity=data.toCity;
        }
        let fromCity="";
        if(data.fromCity!=undefined){
            fromCity=data.fromCity;
        }
        let isMult=false;
        if(data.fromCity!=undefined){
            isMult=data.isMult;
        }
        return (
            <div className={less.content}>
                <div style={{ paddingTop: 10, width: 520, margin: "auto" }}>
                    {/**标题*/}
                    <div style={{ position: "relative" }}>
                        <div style={{ width: 6, height: 20, position: "absolute", backgroundColor: "#29A6FF", marginTop: 8 }}></div>
                        <div style={{ color: "#333", fontSize: 20, marginLeft: 22 }}>需求信息</div>
                    </div>
                    <TemplatePublist state={{lineType:lineType,lineNum:1,adultCount:"",isMult:isMult,childCount:"",remark:"",phone:"",listData:[{fromCity:fromCity,toCity:toCity}]}}  callBack={(e) => {
                        this.httpPostAdd(e);
                    }} />
                </div>
                 {/* <Button  onClick={() => {
                            window.app_open(this, "/PublishMsg", {lineType:"2",toCity:"杭州",fromCity:"北京",isMult:false});}}> 
                    调整
                </Button>  */}
            </div >
        );
    }
}

const publishMsg = Form.create()(page);
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = publishMsg;

