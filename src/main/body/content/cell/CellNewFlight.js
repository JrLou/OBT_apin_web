/**
 * Created by apin on 2017/10/30.
 */
import React, { Component } from 'react';
import {Button,Icon} from 'antd';
import css from './CellNewFlight.less';
import ClickHelp from '../../tool/ClickHelp.js';
/**
 * dataSource: 数据源 是一个对象
 * flightType: 航程类型 {单程 往返 多程}
 * isShowFlightLine: 是否显示航班线
 * isShowAdd: 是否显示航班出发及到达地址
 * isOrder: 是否显示最右侧价格及"确定此航班"按钮
 */
class CellNewFlight extends Component {
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
        let {dataSource,flightType,isShowFlightLine,isShowAdd,isOrder} = this.props;
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
            {this.createCell(dataSource,flightType,isShowAdd,isOrder)}
        </div>);
    }
    createCell(dataSource,flightType,isShowAdd,isOrder){
        if (!dataSource){
            return null;
        }
        let airlineInfo = (dataSource.airlineInfo&&dataSource.airlineInfo.length>0)?dataSource.airlineInfo:[];
        let obj = {go:[airlineInfo[0],airlineInfo[0],airlineInfo[0]],back:undefined};

        if (airlineInfo[1]){
            obj.back = [airlineInfo[1],airlineInfo[1],airlineInfo[1]];
        }
        let itemView = (<div className={css.cell}>
            <div className={css.sign}>直营</div>
            <div className={css.left}>
                <div className={css.table}>
                    {isShowAdd?<div style={{display:"table",marginTop:"10px"}}>
                        <div style={{display: "table-cell",verticalAlign: "middle",fontSize:"20px"}}>杭州——曼谷</div>
                        <div style={{display: "table-cell",verticalAlign: "middle",fontSize:"14px",paddingLeft:"60px"}}>2017-9-19</div>
                        <div style={{display: "table-cell",verticalAlign: "middle",fontSize:"14px",paddingLeft:"30px"}}>周六</div>
                    </div>:null}
                    {obj.go?<CellLine dataArr={obj.go} isGo={true} flightType={flightType}/>:null}
                    {isShowAdd?<div style={{display:"table",marginTop:"10px"}}>
                        <div style={{display: "table-cell",verticalAlign: "middle",fontSize:"20px"}}>曼谷——杭州</div>
                        <div style={{display: "table-cell",verticalAlign: "middle",fontSize:"14px",paddingLeft:"60px"}}>2017-9-19</div>
                        <div style={{display: "table-cell",verticalAlign: "middle",fontSize:"14px",paddingLeft:"30px"}}>周六</div>
                    </div>:null}
                    {obj.back?<CellLine dataArr={obj.back} isGo={false} flightType={flightType}/>:null}
                </div>
            </div>
            <div className={css.right}>
                <div className={css.rightCenter}>
                    <div className={css.table}>
                        <div className={css.daysText}>
                            行程规则
                        </div>

                        {isOrder?<div className={css.shuiText}>
                            <div className={css.shuiTextTop}>
                                {dataSource.flightType==2?"往返含税":"单程含税"}
                            </div>
                            <div className={css.priceText}>
                                <span className={css.priceTextColor}>{"¥ "}</span>
                                <span className={css.priceTextFont}>{dataSource.basePrice||"0"}</span>
                                <span >{" 起"}</span>
                            </div>
                        </div>:null}
                        {isOrder?<div className={css.itemCenter}>
                            <div className={css.btn} style={{cursor: 'pointer'}}
                                 onClick={() => {
                                     if (this.props.callBack){
                                         this.props.callBack(dataSource);
                                     }
                                 }}>{"确定此航班"}</div>
                        </div>:null}

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

class CellLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUp:false
        };
    }
    render(){
        let {dataArr,isGo,flightType} = this.props;
        return (<div>
            {this.createItemCell(dataArr,isGo,flightType)}
        </div>);

    }
    createItemCell(dataArr,isGo,flightType){
        if (!dataArr||dataArr.length<1){
            return null;
        }
        var viewArr = [];
        let myArr = this.state.isUp?[dataArr[0]]:dataArr;
        for (let i=0;i<myArr.length;i++){
            let dataItem = myArr[i];
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
            var itemView = (
                <div key={i}
                     className={css.cellLine}
                     style={{borderBottomWidth:(flightType&&i==0)?"1px":"1px"}}>

                    {flightType?<div className={css.type}>
                        <div className={css.typeText}>
                            {isGo?"去程":"回程"}
                        </div></div>:null}

                    <div className={css.date_super}>
                        <div className={css.date}>{dataItem.arrDate}</div>
                        <div className={css.week}>{"周五"}</div>
                    </div>

                    <div className={css.itemCenter}>
                        <div className={css.flightLine}>
                            <div className={css.placeLine}>
                                <div className={css.placeLineItem}>{dataItem.depAirport}</div>
                                <div style={{fontSize:"22px",textAlign:"right"}}>{dataItem.depTime}</div>
                            </div>

                            <div className={css.lineBg}>
                                <div className={css.line}></div>
                            </div>


                            <div className={css.totalTime}>
                                <div className={css.logoCompany_super}>
                                    <div className={css.logoBg}>
                                        <img className={css.logo}
                                             src ={dataItem.logo?dataItem.logo:require("../../../../images/logo.png")}/>
                                    </div>
                                    <div className={css.logoCompany}>
                                        <div className={css.logoCompanyText}>{dataItem.compName}</div>
                                    </div>
                                </div>
                                <div className={css.totalTimeText}>{"约"+totalText}</div>
                                <div className={css.flightLineNum}>{dataItem.num}</div>
                            </div>


                            <div className={css.lineBg}>
                                <div className={css.line}></div>
                            </div>



                            <div className={css.placeLine} style={{textAlign:"left"}}>
                                <div className={css.refPlaceLineItem}>{dataItem.arrAirport}</div>
                                <div>
                                    <span style={{fontSize:"22px"}}>{dataItem.arrTime}</span>
                                    <span style={{fontSize:"12px",color:"#FF5841"}}>{dataItem.tag==1?"+1天":""}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={css.isMore}
                         onClick={()=>{
                             if (dataArr.length>1&&i==0){
                                 this.setState({
                                     isUp:!this.state.isUp,
                                 });
                             }
                         }}>
                        <div className={css.isMoreTime}>{"中转3h15m"}</div>
                        {dataArr.length>1&&i==0?<Icon type={this.state.isUp==true?"up":"down"}
                                                      className={css.isMoreImg}/>:null}

                    </div>
                </div>);
            viewArr.push(itemView);
        }
        return viewArr;
    }
}

module.exports = CellNewFlight;