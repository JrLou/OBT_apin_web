/**
 * Created by apin on 2017/10/25.
 */
import React, { Component } from 'react';
import {Button} from 'antd';
import css from './CellFlight.less';
import ClickHelp from '../../tool/ClickHelp.js';
class CellFlight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            flightType:true,
            isShowAdd:false,
            isShowFlightLine:false
        };
    }
    refreshView(dataSource,flightType,isShowFlightLine,isShowAdd) {
        this.setState({
            dataSource:dataSource,
            flightType:flightType==2,
            isShowAdd:isShowAdd,
            isShowFlightLine:isShowFlightLine
        });
    }
    render() {
        let {dataSource,flightType,isShowFlightLine,isShowAdd} = this.state;
        return (<div>
            {isShowFlightLine?<div className={css.themeLine}>
                <div className={css.themeTitle}>出发城市:</div>
                <div className={css.themeCon}>杭州</div>
                <div className={css.themeTitle}>目的城市:</div>
                <div className={css.themeCon}>曼谷</div>
                <div className={css.themeTitle}>出发日期:</div>
                <div className={css.themeCon}>2017-9-19</div>
                <div className={css.themeTitle}>返程日期:</div>
                <div className={css.themeCon}>2017-9-19</div>
                <div className={css.themeTitle}>行程天数:</div>
                <div className={css.themeCon}>6天5晚</div>
            </div>:null}
            {this.createCell(dataSource,flightType,isShowAdd)}
        </div>);
    }
    createCell(dataItem,flightType,isShowAdd){
        let airlineInfo = (dataItem.airlineInfo&&dataItem.airlineInfo.length>0)?dataItem.airlineInfo:[];
        let airlineInfo_One = airlineInfo[0]?airlineInfo[0]:{};
        let desc = (airlineInfo_One.depDate||"")+" "+(airlineInfo_One.depTime||"")+" --> "+(airlineInfo_One.arrDate||"")+" "+(airlineInfo_One.arrTime||"")+" "+(airlineInfo_One.depAirport||"")+"-->"+(airlineInfo_One.arrAirport||"");
        let itemView = (<div className={css.cell}>
            <div className={css.sign}>直营</div>
            <div className={css.left}>
                <div className={css.table}>
                    {this.createItemCell(airlineInfo,flightType,isShowAdd)}
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
                                <span className={css.priceTextFont}>{dataItem.basePrice||"0"}</span>
                                <span >{" 起"}</span>
                            </div>
                        </div>
                        <div className={css.itemCenter}>
                            <div className={css.table}>
                                <div className={css.btn} style={{cursor: 'pointer'}}
                                     onClick={() => {
                                         if (this.props.callBack){
                                             this.props.callBack(dataItem);
                                         }
                                     }}>{"预订"}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>行李规则</div>
            </div>
        </div>);
        return itemView;
    }

    createItemCell(data,flightType,isShowAdd){
        if (!data||data.length<1){
            return null;
        }
        var viewArr = [];
        for (let i=0;i<data.length;i++){
            let dataItem = data[i];
            let startDate = dataItem.depDate?dataItem.depDate.substring(5):"";
            startDate = startDate.replace("-","月")+"日";


            let totalTime = dataItem.flightTime?dataItem.flightTime:"";
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
                {isShowAdd?<div style={{display:"table",marginTop:"10px"}}>
                    <div style={{display: "table-cell",verticalAlign: "middle",fontSize:"20px"}}>杭州——曼谷</div>
                    <div style={{display: "table-cell",verticalAlign: "middle",fontSize:"14px",paddingLeft:"60px"}}>2017-9-19</div>
                    <div style={{display: "table-cell",verticalAlign: "middle",fontSize:"14px",paddingLeft:"30px"}}>周六</div>
                </div>:null}

                <div className={css.cellLine} style={{borderBottomWidth:(flightType&&i==0)?"1px":"0px"}}>
                    {flightType?<div className={css.type}>
                        <div className={css.typeText}>
                            {i==0?"去":"返"}
                        </div>
                    </div>:null}

                    <div className={css.type}>
                        <img className={css.logo}
                             src ={dataItem.logo?dataItem.logo:require("../../../../images/logo.png")}
                        />
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
                                <img className={css.line} src={require('../../../../images/trip_line.png')}/>
                            </div>
                            <div className={css.timeLineItem} style={{textAlign:"left"}}>
                                {/*<span className={css.fontBase}>{endDate+" "}</span>*/}
                                <span style={{fontSize:"24px"}}>{dataItem.arrTime}</span>
                                <span style={{fontSize:"12px",color:"#FF5841"}}>{dataItem.tag==1?"+1天":""}</span>
                            </div>
                        </div>
                        <div className={css.timeLine}>
                            <div className={css.placeLineItem}>{dataItem.depAirport}</div>
                            <div className={css.space}></div>
                            <div className={css.refPlaceLineItem}>{dataItem.arrAirport}</div>
                        </div>
                    </div>

                </div>
            </div>);
            viewArr.push(itemView);
        }
        return viewArr;
    }
}
CellFlight.contextTypes = {
    router: React.PropTypes.object
};
module.exports = CellFlight;