import React, { Component } from 'react';
import { Form, DatePicker, TimePicker, Button, Input, Row, Col, Radio, AutoComplete, Icon, message } from 'antd';
import { HttpTool,CookieHelp} from "../../../../lib/utils/index.js";
import APIGYW from "../../../api/APIGYW.js";
import AutoInput from "../component/InputAuto";
import TemplatePublist from "./TemplatePublist";

import less from './PublishMsg.less';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
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
            message.success(msg);
            window.app_open(this, "/Demand",{});
        };
        let failure = (code, msg, option) => {
            message.error(msg);
        };
        HttpTool.request(HttpTool.typeEnum.POST, APIGYW.demandapi_demands, success, failure, param);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let {data}=this.props.location.query;
        let testdate=(data==undefined || data== "")?{}:data;
        if(CookieHelp.getCookieInfo("publishMsgCookie") != undefined && CookieHelp.getCookieInfo("publishMsgCookie") !="" ){
            testdate=CookieHelp.getCookieInfo("publishMsgCookie");
        }
        let lineType=2;
        data=JSON.parse(testdate);
        if(data.lineType!=undefined && ["1","2","3"].indexOf(data.lineType+"")>-1){
            lineType=parseInt(data.lineType);
        }
        let toCity=data.toCity==undefined?"":data.toCity;
        let fromCity=data.fromCity==undefined?"":data.fromCity;
        let isMult=data.fromCity==undefined?false:data.isMult;
        let adultCount=data.adultCount==undefined?"":data.adultCount;
        let childCount=data.childCount==undefined?"":data.childCount;
        let listDefa=[{fromCity:fromCity,toCity:toCity}];
        let listData =data.listData==undefined?listDefa:data.listData;
        let lineNum =listData.length;
    
        return (
            <div className={less.content}>
            <div style={{ paddingTop: 10, width: 520, margin: "auto" }}>
                    {/**标题*/}
                    <div style={{ position: "relative" }}>
                        <div style={{ width: 6, height: 20, position: "absolute", backgroundColor: "#29A6FF", marginTop: 8 }}></div>
                        <div style={{ color: "#333", fontSize: 20, marginLeft: 22 }}>需求信息</div>
                    </div>
                    <TemplatePublist state={{lineType:lineType,lineNum:lineNum,adultCount:adultCount,isMult:isMult,childCount:childCount,remark:"",phone:"",listData:listData}}  callBack={(e) => {
                        this.httpPostAdd(e);
                    }} />
                </div>


                {/**
                    本组件调用：
                    lineType：航程类型1，2，3                    
                    adultCount：成人人数                        
                    childCount：儿童人数                              
                    lineNum：单程，往返：1，多程【2】至【6】一个数          
                    isMult：是否显示多层false 显示，true 不显示
                    listData:[{fromCity:"from",toCity:"to",toDateTime:"",fromDateTime:""}] 航线的线路与时间
                */}
                {/* <Button  onClick={() => {
                    let data ={lineType:"3",toCity:"杭州",fromCity:"北京",adultCount:"1",childCount:"1",lineNum:3,
                    isMult:false,listData:[
                        {fromCity:"from",toCity:"to",toDateTime:"",fromDateTime:""},
                        {fromCity:"from1",toCity:"to1",toDateTime:"",fromDateTime:""}
                    ]};
                    CookieHelp.saveCookieInfo("publishMsgCookie",data);
                    window.app_open(this, "/PublishMsg",{});
                }
                }> 
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

