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
            tableLoading:false,
            dataSource:[],
            total:0
        };
    }
    componentDidMount() {
        this.loadData();
    }
    loadDaysData() {
        var param = {
            "depCity":"上海",
            "arrCity":"北京",
            "depDate":"2017-10-14",
            "flightType":"1"
        };
        var success = (code, msg, json, option) => {
            log(json);
            log("gyw-------loadDaysData------");
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
        HttpTool.request(HttpTool.typeEnum.POST,APIGYW.flightapi_flightDetail_query,success, failure, param,
            {
                ipKey:'hlIP'
            });
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
                            onSelectDate={(select_year, select_month , select_day)=>{
                                this.selectDate(select_year, select_month, select_day);
                            }}
                            year={"2017"}
                            month={"11"}
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
                    <LineInfor ref={(a)=>this.myLineInfor = a} callBack={()=>{
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
                            {this.createItemCell(dataItem.flight)}
                        </div>
                    </div>
                    <div className={css.right}>
                        <div className={css.rightCenter}>
                            <div className={css.table}>
                                <div className={css.daysText}>
                                    <span>{dataItem.days}</span>
                                    <span>{" | 已团 233 "}</span>
                                    <span>{"余位 "}</span>
                                    <span style={{color:"#2db7f5"}}>{dataItem.remain}</span>
                                </div>
                                <div className={css.shuiText}>
                                    <div className={css.shuiTextTop}>
                                        {(dataItem.isType==1?"往返":"")+(dataItem.isTax?" 含税":"")}
                                        </div>
                                    <div className={css.priceText}>
                                        <span className={css.priceTextColor}>{"¥ "}</span>
                                        <span className={css.priceTextFont}>{dataItem.price}</span>
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
            var itemView = (<div key={i}>
                <div className={css.cellLine}>
                    <div className={css.type}>
                        <div className={css.typeText}>
                            {dataItem.type==1?"去":"返"}
                        </div>
                    </div>

                    <div className={css.type}>
                        <img className={css.logo} src ={dataItem.logo}/>
                    </div>

                    <div className={css.logoCompany_super}>
                        <div className={css.logoCompany}>{dataItem.company}</div>
                        <div className={css.lineNum}>{dataItem.lineNum}</div>
                    </div>

                    <div className={css.itemCenter}>
                        <div className={css.timeLine}>
                            <div className={css.timeLineItem}>
                                <span className={css.fontBase}>{dataItem.startDay+" "}</span>
                                <span style={{fontSize:"24px",textAlign:"right"}}>{dataItem.startTime}</span>
                            </div>

                            <div className={css.totalTime}>
                                <div className={css.totalTimeText}>
                                    {dataItem.totalTime}
                                </div>
                                <img className={css.line} src={require('../../../images/trip_line.png')}/>

                            </div>
                            <div className={css.timeLineItem} style={{textAlign:"left"}}>{dataItem.endTime}</div>
                        </div>
                        <div className={css.timeLine}>
                            <div className={css.placeLineItem}>{dataItem.startPlace}</div>
                            <div className={css.space}></div>
                            <div className={css.refPlaceLineItem}>{dataItem.endPlace}</div>
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


{/*<Button className={less.rightRow} icon={"back"}*/}
{/*onClick={() => {*/}
{/*window.app_open(this, "/", {title: "回首页"});*/}
{/*}}*/}
{/*>回首页</Button>*/}