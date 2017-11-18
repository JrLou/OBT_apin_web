/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import {message,Button} from 'antd';
import css from './OneWayDetail.less';
import { HttpTool } from '../../../../lib/utils/index.js';
import APIGYW from "../../../api/APIGYW.js";
import LineHeadTitle from "./line/LineHeadTitle.js";
import MyCalendar from "./line/MyCalendar.js";
import MyAlert from "./line/MyAlert.js";
import LoadingView from "../component/LoadingView.js";
import CellFlightCom from "./line/CellFlightCom.js";

import Scroll from 'react-scroll/modules/index'; // Imports all Mixins


var Link = Scroll.Link;
var Events = Scroll.Events;
var scroll = Scroll.animateScroll;
var scrollSpy = Scroll.scrollSpy;

class page extends Component {
    constructor(props) {
        super(props);
        this.setParam(props.data);

        let date = new Date();
        this.year = date.getFullYear();
        this.month = date.getMonth()+1;
        this.day = date.getDate();
        this.isShowRightCal=this.year+"-"+this.month+"-"+this.day;

        this.state={
            upData:0
        };
        this.scrollTo = this.scrollTo.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        // todo
        this.setParam(nextProps.data);
        this.upView();
    }
    scrollTo(y) {
        scroll.scrollTo(y);
    }

    upView(){
        this.setState({
            upData:this.state.upData++
        });
    }
    setParam(myData){
        this.myData = myData;
        this.depCity = myData?myData.depCity:"";
        this.arrCity = myData?myData.arrCity:"";
        this.flightType = myData?myData.flightType:"2";
    }

    componentDidMount() {
        this.loadLeftHeadMonthData();
        Events.scrollEvent.register("begin", function () {
            console.log("begin", arguments);
        });
        Events.scrollEvent.register("end", function () {
            console.log("end", arguments);
        });

        scrollSpy.update();
    }
    componentWillUnmount() {
        Events.scrollEvent.remove("begin");
        Events.scrollEvent.remove("end");
    }
    //左日历的headMonth
    loadLeftHeadMonthData() {
        var param = {
            "depCity":this.depCity,
            "arrCity":this.arrCity,
            "flightType":this.flightType
        };
        // this.loadingView.refreshView(true);
        var success = (code, msg, json, option) => {
            // this.loadingView.refreshView(false);
            if (this.flightType == "2"){
                this.myCalendarLeft.refreshMonth(true,json);
            }else {
                this.myCalendarRight.refreshMonth(false,json);
            }
            this.loadLeftDay(json[0]);
        };
        var failure = (code, msg, option) => {
            message.warning(msg);
            // this.loadingView.refreshView(false);
        };
        HttpTool.request(HttpTool.typeEnum.POST,APIGYW.flightapi_flightDetail_month_query,success, failure, param);
    }

    //右日历的headMonth
    loadRightHeadMonthData(depDate) {
        var param = {
            "depCity":this.depCity,
            "arrCity":this.arrCity,
            "flightType":this.flightType,
            "depDate":depDate
        };
        var success = (code, msg, json, option) => {
            if (json[0]){
                let current_Y_M_D = json[0]?json[0]:this.isShowRightCal;
                let YMDArr = current_Y_M_D.split("-");
                let rightY=YMDArr[0]?YMDArr[0]:this.year;
                let rightM=YMDArr[1]?YMDArr[1]:this.month;
                let rightD=YMDArr[2]?YMDArr[2]:this.day;

                this.myCalendarRight.initYMD(rightY,rightM,rightD,current_Y_M_D);
                this.myCalendarRight.refreshMonth(false,json);
                this.loadRightDay(current_Y_M_D,depDate);
            }
        };
        var failure = (code, msg, option) => {
            message.warning(msg);
        };
        HttpTool.request(HttpTool.typeEnum.POST,APIGYW.flightapi_retFlight_month_query,success, failure, param);
    }

    //左边日历每天的数据
    loadLeftDay(month) {
        var param = {
            "depCity":this.depCity,
            "arrCity":this.arrCity,
            "flightType":this.flightType,
            "month":month
        };

        this.loadingView.refreshView(true);
        var success = (code, msg, json, option) => {
            this.loadingView.refreshView(false);
            let retDateObj = json&&json[0]?json[0]:{};
            let current_Y_M_D = retDateObj.retDate?retDateObj.retDate:this.isShowRightCal;
            let YMDArr = current_Y_M_D.split("-");
            let rightY=YMDArr[0]?YMDArr[0]:this.year;
            let rightM=YMDArr[1]?YMDArr[1]:this.month;
            let rightD=YMDArr[2]?YMDArr[2]:this.day;
            if (this.flightType=="2"){
                this.myCalendarLeft.initYMD(rightY,rightM,rightD,current_Y_M_D);
                this.myCalendarLeft.refreshCalendarDay(true,json);
                this.date = current_Y_M_D;
                this.loadRightHeadMonthData(current_Y_M_D);
            }else {
                this.myCalendarRight.initYMD(rightY,rightM,rightD,current_Y_M_D);
                this.myCalendarRight.refreshCalendarDay(false,json);
                let days = 0;
                this.loadTripData(current_Y_M_D, days);
            }
        };
        var failure = (code, msg, option) => {
            this.loadingView.refreshView(false);
        };
        HttpTool.request(HttpTool.typeEnum.POST,APIGYW.flightapi_flightDetail_day_query,success, failure, param);
    }

    //右日历每天的数据
    loadRightDay(month,depDate) {
        var param = {
            "depCity":this.depCity,
            "arrCity":this.arrCity,
            "flightType":this.flightType,
            "month":month,
            "depDate":depDate
        };
        this.loadingView.refreshView(true);
        var success = (code, msg, json, option) => {
            this.loadingView.refreshView(false);
            let retDateObj = json&&json[0]?json[0]:{};
            let current_Y_M_D = retDateObj.retDate?retDateObj.retDate:this.isShowRightCal;
            let YMDArr = current_Y_M_D.split("-");
            let rightY=YMDArr[0]?YMDArr[0]:this.year;
            let rightM=YMDArr[1]?YMDArr[1]:this.month;
            let rightD=YMDArr[2]?YMDArr[2]:this.day;
            this.myCalendarRight.initYMD(rightY,rightM,rightD,current_Y_M_D);
            this.myCalendarRight.refreshCalendarDay(false,json);
            let days = retDateObj.days;
            this.loadTripData(depDate, days);
        };
        var failure = (code, msg, option) => {
            message.warning(msg);
            this.loadingView.refreshView(false);
        };
        HttpTool.request(HttpTool.typeEnum.POST,APIGYW.flightapi_flights_query,success, failure, param);
    }

    loadTripData(date,days) {
        if (this.flightType=="2"){
            if (!date||!days){
                message.warning("航程不存在");
                return;
            }
        }else {
            if (!date){
                message.warning("航程不存在");
                return;
            }
        }
        this.loadingView.refreshView(true);
        var param = {
            "depCity":this.depCity,
            "arrCity":this.arrCity,
            "flightType":this.flightType,
            "day":days,
            "depDate":date
        };
        var success = (code, msg, json, option) => {
            this.loadingView.refreshView(false,()=>{
                this.loadingView.refreshView(false);
                this.myLineData = json;
                this.upView();

                if (json&&json.length>0){
                    let y = this.myflightCon?this.myflightCon.offsetTop:0;
                    let isBigZero = y-150;
                    if (isBigZero>0){
                        this.scrollTo(isBigZero);
                    }
                }
            });

        };
        var failure = (code, msg, option) => {
            message.warning(msg);
            this.loadingView.refreshView(false);
        };
        HttpTool.request(HttpTool.typeEnum.POST,APIGYW.flightapi_flightDetail_query,success, failure, param,);
    }

    render() {
        var div = (
            <div className={css.main}>
                <div className={css.content}>
                    <LineHeadTitle dataSource = {this.myData}/>
                </div>
                <div className={css.refContent} style={{overflow:"hidden"}}>
                    {this.flightType==2?<div className={css.myCalendar}
                                             style={{width:"49.5%",float:"left"}}>
                        <div className={css.calendarTitle}>第一步：请选择去程日期</div>
                        <MyCalendar
                            ref={(a)=>{this.myCalendarLeft = a;}}
                            onSelectDate={(select_year, select_month , select_day,selDataItem)=>{
                                this.selectDate(select_year, select_month, select_day,selDataItem);
                            }}
                            onSelectMonth = {(selMonth,isLeft)=>{
                                this.loadLeftDay(selMonth);
                            }}
                            title={"去程月份:"}
                            current_Y_M={this.isShowRightCal}
                            year={this.year}
                            month={this.month}
                            day={this.day}
                            row_number = {6}
                            col_number = {7}
                        />
                    </div>:null}

                    <div className={css.myCalendar}
                         style={{width:this.flightType==2?"49.5%":"60%",float:this.flightType==2?"right":"none"}}>
                        {this.flightType==2?(<div className={css.calendarTitle}>第二步：请选择返程日期</div>)
                            :
                            <div style={{height:"15px"}}></div>
                        }
                        <MyCalendar
                            ref={(a)=>{this.myCalendarRight = a;}}
                            onSelectDate={(select_year, select_month , select_day,selDataItem)=>{
                                this.selectDate(select_year, select_month, select_day,selDataItem);
                            }}
                            onSelectMonth = {(selMonth,isLeft)=>{
                                if (this.flightType==2){
                                    this.loadRightDay(selMonth,this.date);
                                }else {
                                    this.loadLeftDay(selMonth);
                                }
                            }}
                            title={this.flightType==2?"返程月份:":""}
                            current_Y_M={this.isShowRightCal}
                            year={this.year}
                            month={this.month}
                            day={this.day}
                            row_number = {6}
                            col_number = {7}
                        />
                    </div>

                </div>

                <div className={css.thirdContent}
                     ref={(div)=>this.myflightCon = div}>
                    {(this.myLineData&&this.myLineData.length>0)?(<div className={css.title}>航班信息</div>):null}
                    {this.createFlightCompany(this.myLineData,this.flightType)}
                </div>
                <LoadingView ref={(a)=>this.loadingView = a}/>
            </div>
        );
        return div;
    }
    selectDate(selDataItem,isLeft){
        if (isLeft) {
            this.date = selDataItem?selDataItem.retDate:undefined;
            this.loadRightHeadMonthData(this.date);
        }else {
            if (this.flightType==2){
                let days = selDataItem?selDataItem.days:undefined;
                this.loadTripData(this.date, days);
            }else {
                let days = 0;
                this.loadTripData(selDataItem.retDate, days);
            }
        }
    }
    createFlightCompany(dataArr,flightType){
        if (!dataArr||dataArr.length<1){
            return null;
        }
        return dataArr.map((data,index)=>{
            return (<CellFlightCom key={index}
                                   isNewData={true}
                                   dataItem = {data}
                                   flightType={flightType==2}/>);
        });
    }
}
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;