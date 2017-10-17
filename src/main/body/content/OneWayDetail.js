/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import {message} from 'antd';
import css from './OneWayDetail.less';
import { HttpTool } from '../../../../lib/utils/index.js';
import APIGYW from "../../../api/APIGYW.js";
import LineHeadTitle from "./line/LineHeadTitle.js";
import MyCalendar from "./line/MyCalendar.js";
import MyAlert from "./line/MyAlert.js";
import LoadingView from "../component/LoadingView.js";
class page extends Component {
    constructor(props) {
        super(props);
        this.myData = this.props.data;

        alert(JSON.stringify(this.myData));
        let date = new Date();
        this.year = date.getFullYear();
        this.month = date.getMonth()+1;
        this.day = date.getDate();
    }
    componentDidMount() {
        this.loadLeftHeadMonthData();
    }

    //左日历的headMonth
    loadLeftHeadMonthData() {
        var param = {
            "depCity":"上海",
            "arrCity":"北京",
            "flightType":"2"
        };
        this.loadingView.refreshView(true);
        var success = (code, msg, json, option) => {
            this.loadingView.refreshView(false);
            this.myCalendarLeft.refreshMonth(true,json);
            this.loadLeftDay(json[0]);
        };
        var failure = (code, msg, option) => {
            this.loadingView.refreshView(false);
        };
        HttpTool.request(HttpTool.typeEnum.POST,APIGYW.flightapi_flightDetail_month_query,success, failure, param,
            {
                ipKey:'hlIP'
            });
    }

    //右日历的headMonth
    loadRightHeadMonthData(depDate) {
        var param = {
            "depCity":"上海",
            "arrCity":"北京",
            "flightType":"2",
            "depDate":depDate
        };
        var success = (code, msg, json, option) => {
            this.myCalendarRight.refreshMonth(false,json);
            this.loadRightDay(json[0],depDate);
        };
        var failure = (code, msg, option) => {
            this.loadingView.refreshView(false);
        };
        HttpTool.request(HttpTool.typeEnum.POST,APIGYW.flightapi_retFlight_month_query,success, failure, param,
            {
                ipKey:'hlIP'
            });
    }

    //左边日历每天的数据
    loadLeftDay(month) {
        var param = {
            "depCity":"上海",
            "arrCity":"北京",
            "flightType":"2",
            "month":month
        };

        var success = (code, msg, json, option) => {
            this.myCalendarLeft.refreshCalendarDay(true,json);
        };
        var failure = (code, msg, option) => {
            this.loadingView.refreshView(false);
        };
        HttpTool.request(HttpTool.typeEnum.POST,APIGYW.flightapi_flightDetail_day_query,success, failure, param,
            {
                ipKey:'hlIP'
            });
    }

    //右日历每天的数据
    loadRightDay(month,depDate) {
        var param = {
            "depCity":"上海",
            "arrCity":"北京",
            "flightType":"2",
            "month":month,
            "depDate":depDate
        };

        var success = (code, msg, json, option) => {
            this.myCalendarRight.refreshCalendarDay(false,json);
        };
        var failure = (code, msg, option) => {
            this.loadingView.refreshView(false);
        };
        HttpTool.request(HttpTool.typeEnum.POST,APIGYW.flightapi_flights_query,success, failure, param,
            {
                ipKey:'hlIP'
            });
    }

    loadTripData(date,days) {
        if (!date||!days){
            message.warning("航程不存在");
            return;
        }
        this.loadingView.refreshView(true);
        var param = {
            "depCity":"上海",
            "arrCity":"北京",
            "day":days,
            "depDate":date,
            "flightType":"2"
        };
        var success = (code, msg, json, option) => {
            this.myLineInfor.refreshView(json);
            this.loadingView.refreshView(false);
        };
        var failure = (code, msg, option) => {
            this.loadingView.refreshView(false);
        };
        HttpTool.request(HttpTool.typeEnum.POST,APIGYW.flightapi_flightDetail_query,success, failure, param,
            {
                ipKey:'hlIP'
            });
    }

    render() {
        var div = (
            <div className={css.main}>
                <div className={css.content}>
                    <LineHeadTitle dataSource = {this.myData}/>
                </div>
                <div className={css.content} style={{overflow:"hidden"}}>
                    <div className={css.myCalendar}
                         style={{width:"49%",float:"left"}}>
                        <MyCalendar
                            ref={(a)=>{this.myCalendarLeft = a;}}
                            onSelectDate={(select_year, select_month , select_day,selDataItem)=>{
                                this.selectDate(select_year, select_month, select_day,selDataItem);
                            }}
                            onSelectMonth = {(selMonth,isLeft)=>{
                                this.loadLeftDay(selMonth);
                            }}
                            title={"去程月份"}
                            current_Y_M={this.year+"-"+this.month+"-"+this.day}
                            year={this.year}
                            month={this.month}
                            day={this.day}
                            row_number = {6}
                            col_number = {7}
                        />
                    </div>
                    <div className={css.myCalendar}
                         style={{width:"49%",float:"right"}}>
                        <MyCalendar
                            ref={(a)=>{this.myCalendarRight = a;}}
                            onSelectDate={(select_year, select_month , select_day,selDataItem)=>{
                                this.selectDate(select_year, select_month, select_day,selDataItem);
                            }}
                            title={"返程月份"}
                            current_Y_M={this.year+"-"+this.month+"-"+this.day}
                            year={"2017"}
                            month={"10"}
                            day={"11"}
                            row_number = {6}
                            col_number = {7}
                        />
                    </div>

                </div>

                <div className={css.content}>
                    <div className={css.title}>航班信息</div>
                    <LineInfor ref={(lineInfor)=>this.myLineInfor = lineInfor} callBack={()=>{
                        this.myAlert.refreshView();
                    }}/>
                </div>

                <MyAlert ref={(a)=>this.myAlert = a}/>
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
            let days = selDataItem?selDataItem.days:undefined;
            this.loadTripData(this.date, days);
        }
    }
}

class LineInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: []
        };
    }
    refreshView(dataSource) {
        this.setState({
            dataSource:dataSource
        });
    }
    render() {
        let {dataSource} = this.state;
        return (<div>
            {this.createCell(dataSource)}
        </div>);
    }
    createCell(dataSource){
        if (!dataSource||dataSource.length<1){
            return null;
        }
        var viewArr = [];
        for (let i=0;i<dataSource.length;i++){
            let dataItem = dataSource[i];
            var itemView = (<div key={i}>
                <div className={css.cell}>
                    <div className={css.left}>
                        <div className={css.table}>
                            {this.createItemCell(dataItem.airlineInfo)}
                        </div>
                    </div>
                    <div className={css.right}>
                        <div className={css.rightCenter}>
                            <div className={css.table}>
                                <div className={css.daysText}>
                                    <span>{dataItem.days+"天"}</span>
                                    <span>{" | 已售"+dataItem.soldCount}</span>
                                    <span>{" 余位"}</span>
                                    <span style={{color:"#2db7f5"}}>{dataItem.remainCount}</span>
                                </div>
                                <div className={css.shuiText}>
                                    <div className={css.shuiTextTop}>
                                        {dataItem.flightType==2?"往返含税":"单程含税"}
                                    </div>
                                    <div className={css.priceText}>
                                        <span className={css.priceTextColor}>{"¥ "}</span>
                                        <span className={css.priceTextFont}>{dataItem.basePrice}</span>
                                        <span >{" 起"}</span>
                                    </div>

                                </div>
                                <div className={css.itemCenter}>
                                    <div className={css.table}>
                                        <div className={css.btn} onClick={()=>{
                                            if (this.props.callBack){
                                                this.props.callBack();
                                            }
                                        }}>预定</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
            viewArr.push(itemView);
        }

        return viewArr;
    }

    createItemCell(data){
        if (!data||data.length<1){
            return null;
        }
        var viewArr = [];
        for (let i=0;i<data.length;i++){
            let dataItem = data[i];
            let startDate = dataItem.depDate?dataItem.depDate.substring(5):"";
            startDate = startDate.replace("-","月")+"日";


            let totalTime = dataItem.flightTime;
            let timeArr = totalTime.split(":");
            let totalText = "";
            if (timeArr[0]&&timeArr[0]>0){
                totalText = timeArr[0]+"小时";
            }
            if (timeArr[1]&&timeArr[1]>0){
                totalText = totalText + timeArr[1]+"分钟";
            }


            let endDate = dataItem.arrDate?dataItem.arrDate.substring(5):"";
            endDate = endDate.replace("-","月")+"日";
            var itemView = (<div key={i}>
                <div className={css.cellLine}>
                    <div className={css.type}>
                        <div className={css.typeText}>
                            {dataItem.flightType==1?"去":"返"}
                        </div>
                    </div>

                    <div className={css.type}>
                        <img className={css.logo} src ={dataItem.logo}/>
                    </div>

                    <div className={css.logoCompany_super}>
                        <div className={css.logoCompany}>{dataItem.compName}</div>
                        <div className={css.lineNum}>{dataItem.num}</div>
                    </div>

                    <div className={css.itemCenter}>
                        <div className={css.timeLine}>
                            <div className={css.timeLineItem}>
                                <span className={css.fontBase}>{startDate+" "}</span>
                                <span style={{fontSize:"24px",textAlign:"right"}}>{dataItem.depTime}</span>
                            </div>

                            <div className={css.totalTime}>
                                <div className={css.totalTimeText}>
                                    {totalText}
                                </div>
                                <img className={css.line} src={require('../../../images/trip_line.png')}/>
                            </div>
                            <div className={css.timeLineItem} style={{textAlign:"left"}}>
                                <span className={css.fontBase}>{endDate+" "}</span>
                                <span style={{fontSize:"24px",textAlign:"right"}}>{dataItem.arrTime}</span>
                            </div>
                        </div>
                        <div className={css.timeLine}>
                            <div className={css.placeLineItem}>{dataItem.arrAirport}</div>
                            <div className={css.space}></div>
                            <div className={css.refPlaceLineItem}>{dataItem.depAirport}</div>
                        </div>
                    </div>

                </div>
            </div>);
            viewArr.push(itemView);
        }

        return viewArr;
    }

}

page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;