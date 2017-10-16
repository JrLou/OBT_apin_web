/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import css from './OneWayDetail.less';
import { HttpTool } from '../../../../lib/utils/index.js';
import APIGYW from "../../../api/APIGYW.js";
import LineHeadTitle from "./line/LineHeadTitle.js";
import MyCalendar from "./line/MyCalendar.js";
import MyAlert from "./line/MyAlert.js";
class page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource:[]
        };
    }
    componentDidMount() {
        // this.loadTripData();
        this.loadDaysData();
    }
    loadDaysData() {
        var param = {
            "depCity":"上海",
            "arrCity":"北京",
            "depDate":"2017-10-14",
            "flightType":"2"
        };
        var success = (code, msg, json, option) => {
            this.myCalendarRight.refreshCalendar(false,json,["2017-10"]);
        };
        var failure = (code, msg, option) => {
            log(msg);
        };
        HttpTool.request(HttpTool.typeEnum.POST,APIGYW.flightapi_flights_query,success, failure, param,
            {
                ipKey:'hlIP'
            });
    }
    loadTripData() {
        var param = {
            "depCity":"上海",
            "day":"2",
            "arrCity":"北京",
            "depDate":"2017-10-14",
            "flightType":"2"
        };
        var success = (code, msg, json, option) => {
            this.myLineInfor.refreshView(json);
        };
        var failure = (code, msg, option) => {

        };
        HttpTool.request(HttpTool.typeEnum.POST,APIGYW.flightapi_flightDetail_query,success, failure, param,
            {
                ipKey:'hlIP'
            });
        // var myJson = [
        //     {
        //         flight:[
        //             {
        //                 type:1,
        //                 logo:require("../../../images/login_loading.gif"),
        //                 company:"东方航空1杭州萧山机场",
        //                 lineNum:"NX005",
        //                 startDay:"10月11日",
        //                 endDay:"10月16日",
        //                 startTime:"06:30",
        //                 endTime:"08:55",
        //                 startPlace:"杭州萧山机场",
        //                 endPlace:"素万那普机场",
        //                 totalTime:"3小时50分钟"
        //             },
        //             {
        //                 type:2,
        //                 logo:require("../../../images/login_loading.gif"),
        //                 company:"东方航空2",
        //                 lineNum:"NX005",
        //                 startDay:"10月11日",
        //                 endDay:"10月16日",
        //                 startTime:"06:30",
        //                 endTime:"08:55",
        //                 startPlace:"杭州萧山机场",
        //                 endPlace:"素万那普机场素万那普机场",
        //                 totalTime:"3小时50分钟"
        //             }
        //         ],
        //         days:"6天",
        //         price:"2333",
        //         isTax:true,
        //         remain:23,
        //         isType:1
        //     }
        // ];
        // this.myLineInfor.refreshView(myJson);
    }
    loadData() {
        var param = {
            "depCity":"上海",
            "arrCity":"北京",
            "depDate":"2017-10-14",
            "flightType":"1"
        };
        var success = (code, msg, json, option) => {
            log(json);
            log("gyw-------------");
        };
        var failure = (code, msg, option) => {
            log(msg);
        };
        HttpTool.request(HttpTool.typeEnum.POST,APIGYW.flightapi_flights_query,success, failure, param,
            {
                ipKey:'hlIP'
            });
    }
    render() {
        var div = (
            <div className={css.main}>
                <div className={css.content}>
                    <LineHeadTitle/>
                </div>
                <div className={css.content} style={{overflow:"hidden"}}>
                    <div className={css.myCalendar}
                         style={{width:"49%",float:"left"}}>
                        <MyCalendar
                            ref={(a)=>{this.myCalendarLeft = a;}}
                            onSelectDate={(select_year, select_month , select_day)=>{
                                this.selectDate(select_year, select_month, select_day);
                            }}
                            year={"2017"}
                            month={"10"}
                            day={"11"}
                            row_number = {6}
                            col_number = {7}
                            monthArr = {["2017-10","2017-11","2017-12","2018-01","2018-02","2018-03","2018-04","2018-05","2018-06"]}
                            tags = {[8,11,14,21,22,23]}
                        />
                    </div>
                    <div className={css.myCalendar}
                         style={{width:"49%",float:"right"}}>
                        <MyCalendar
                            ref={(a)=>{this.myCalendarRight = a;}}
                            onSelectDate={(select_year, select_month , select_day)=>{
                                this.selectDate(select_year, select_month, select_day);
                            }}
                            year={"2017"}
                            month={"10"}
                            day={"11"}
                            row_number = {6}
                            col_number = {7}
                            monthArr = {["2017-11","2017-12","2018-01","2018-02"]}
                            tags = {[5, 21]}
                        />
                    </div>

                </div>

                <div className={css.content}>
                    <div className={css.title}>
                        航班信息
                    </div>
                    <LineInfor ref={(lineInfor)=>this.myLineInfor = lineInfor} callBack={()=>{
                        this.myAlert.refreshView();
                    }}/>
                </div>

                <MyAlert ref={(a)=>this.myAlert = a}/>
            </div>
        );
        return div;
    }
    selectDate(y,m,d){
        alert(y+"年"+m+"月"+d+"日");
        this.myLineInfor.refreshView([]);
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