/**
 * Created by apin on 2017/10/30.
 */
import React, {Component} from 'react';
import {Tooltip} from 'antd';
import css from './CellNewFlight.less';
import ClickHelp from '../../tool/ClickHelp.js';
import CellNewFlightDetail from './CellNewFlightDetail.js';
import NumTransToTextHelp from '../../tool/NumTransToTextHelp.js';
import DateHelp from '../../tool/DateHelp.js';
//0
class CellNewFlight extends Component {
    constructor(props) {
        super(props);

    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        let {dataSource, flightType, isNoShowRule} = this.props;
        if (!dataSource) {
            return null;
        }
        return (<div className={css.main}>
            <div className={css.left}>
                {this.createCell(dataSource.voyages || [], flightType, isNoShowRule)}
            </div>

            {isNoShowRule ? null : <div className={css.right}>
                <div className={css.ruleDiv}>
                    <Tooltip placement="bottom" title={<div>
                        {(dataSource.weightLimit && dataSource.weightLimit != 0) ? <div className={css.rule}>
                            {"免费托运: " + dataSource.freeBag + "件"}
                        </div> : null}
                        {(dataSource.freeBag && dataSource.freeBag != 0) ? <div className={css.rule}>
                            {"每件重量上限: "}
                            <span style={{color: "#ff6600", fontSize: "14px"}}>{dataSource.weightLimit + "kg"}</span>
                        </div> : null}
                        {(!dataSource.weightLimit || dataSource.weightLimit == 0) && (!dataSource.freeBag || dataSource.freeBag == 0) ?
                            <div className={css.rule}>
                                {"暂无行李规则"}
                            </div> : null}
                    </div>}>行李规则
                    </Tooltip>
                </div>
            </div>}

        </div>);
    }

    //计算历经总时间
    addTime(data) {
        let hour = 0;
        let min = 0;
        let childArr = data ? data : [];
        for (let i = 0; i < childArr.length; i++) {
            let timeObj = this.getMinAndHour(childArr[i].flightTime);
            hour = hour + timeObj.hour;
            min = min + timeObj.min;
        }

        let minZheng = parseInt(min / 60);
        let minYu = min % 60;
        hour = hour + minZheng;
        return hour + "小时 " + minYu + "分钟";
    }

    //提取分钟 小时
    getMinAndHour(time) {
        let minAndHourArr = time ? time.split(" ") : [];
        let hour = minAndHourArr[0] ? parseInt(minAndHourArr[0]) : 0;
        let min = minAndHourArr[1] ? parseInt(minAndHourArr[1]) : 0;

        let obj = {
            hour: hour,
            min: min
        };
        return obj;
    }

    createCell(dataArr, flightType, isNoShowRule) {
        return dataArr.map((data, index) => {
            let isHasTrans = data.child && data.child.length > 0;
            let myChildArr = [];
            if (isHasTrans) {
                myChildArr.push(data);
                data.child.map((data, index) => {
                    myChildArr.push(data);
                });

                let obj = myChildArr[myChildArr.length - 1];
                data.myArrAirport = obj.arrAirport;
                data.myArrTime = obj.arrTime;

                data.myCityArr = obj.cityArr;
                data.myflightTime = this.addTime(myChildArr);
            } else {
                myChildArr = data.child;
            }
            data.myChild = myChildArr;
            return (<div key={index} className={css.cellBg}
                         style={{
                             paddingLeft: isNoShowRule ? "8%" : "0",
                             paddingRight: isNoShowRule ? "8%" : "0",
                             borderBottomWidth: (index == dataArr.length - 1) ? "0px" : "1px"
                         }}>
                {this.createItemCell(data, index, flightType)}
                {data.myChild && data.myChild.length > 0 ? <CellNewFlightDetail data={data.myChild}/> : null}
            </div>);
        });
    }

    //提交代码
    createItemCell(data, index, flightType) {
        if (!data) {
            return null;
        }
        data.cityDep = data.cityDep ? data.cityDep : "";
        let cityArr = data.myCityArr ? data.myCityArr : data.cityArr;

        let cityDep_len = data.cityDep && data.cityDep.length > 3;
        let cityArr_len = cityArr && cityArr.length > 3;
        let city = (cityDep_len ? (data.cityDep.substring(0, 3) + "...") : data.cityDep) + " - " + cityArr;
        let arrAir = data.myArrAirport ? data.myArrAirport : data.arrAirport;
        var itemView = (<div className={css.table}>
            {flightType == 1 ? null : <div className={css.type_super}>
                <div className={css.typeText}>
                    {flightType == 3 ? ("第" + NumTransToTextHelp.getValue(index + 1) + "程") : (data.tripIndex == 0 ? "去程" : "回程")}
                </div>
            </div>}


            <div className={css.date_super}>
                <div className={css.city}>
                    {(cityDep_len || cityArr_len) ?
                        <Tooltip placement="bottom" title={data.cityDep + " - " + cityArr}>{city}</Tooltip>
                        : city}
                </div>

                <div className={css.date}>{data.depDate + " " + NumTransToTextHelp.getWeek(data.week)}</div>
            </div>

            <div className={css.flightLine_super}>
                <div className={css.flightLine}>
                    <div className={css.placeLine}>

                        <div className={css.placeLineItem}>
                            <Tooltip placement="bottom" title={data.depAirport}>{data.depAirport}</Tooltip>
                        </div>

                        <div className={css.time}>
                            <span>{data.depTime}</span>
                        </div>
                    </div>

                    <div className={css.lineBg}>
                        <div className={css.line_item}>
                            <div className={css.line}>
                                <div className={css.line_line}></div>
                            </div>
                        </div>
                    </div>


                    <div className={css.company_super}>
                        <div className={css.logoCompany_super}>
                            <div className={css.logoBg}>
                                <img className={css.logo}
                                     src={data.logo ? data.logo : require("../../../../images/logo.png")}/>
                            </div>
                            <div className={css.logoCompany}>
                                <div className={css.logoCompanyText}>{data.compName}</div>
                            </div>
                        </div>
                        <div
                            className={css.totalTimeText}>{"约" + (data.myflightTime ? data.myflightTime : data.flightTime)}</div>
                        <div className={css.flightLineNum}>
                            <span>{data.num}</span>
                            {data.isStop == 1 ?
                                <span style={{fontSize: "12px", color: "#FF5841"}}>{" 经停"}</span> : null}
                        </div>
                    </div>


                    <div className={css.lineBg}>
                        <div className={css.line_item}>
                            <div className={css.line}>
                                <div className={css.line_line}></div>
                            </div>
                            <div className={css.line_icon}>
                                <div className={css.line_icon_icon}></div>
                            </div>
                        </div>
                    </div>

                    <div className={css.placeLine}>
                        <div className={css.refPlaceLineItem}>
                            <Tooltip placement="bottom"
                                     title={arrAir}>{arrAir}</Tooltip>
                        </div>
                        <div className={css.time}>
                            <span>{data.myArrTime ? data.myArrTime : data.arrTime}</span>
                            {flightType == 3 ? null :
                                <span style={{fontSize: "12px", color: "#FF5841"}}>{data.tag == 1 ? "+1天" : ""}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>);
        return itemView;
    }
}
CellNewFlight.contextTypes = {
    router: React.PropTypes.object
};
module.exports = CellNewFlight;