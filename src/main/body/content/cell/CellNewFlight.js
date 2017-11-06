/**
 * Created by apin on 2017/10/30.
 */
import React, { Component } from 'react';
import {Button,Icon} from 'antd';
import css from './CellNewFlight.less';
import ClickHelp from '../../tool/ClickHelp.js';
import CellNewFlightDetail from './CellNewFlightDetail.js';

class CellNewFlight extends Component {
    constructor(props) {
        super(props);

    }

    componentWillReceiveProps(nextProps) {

    }
    render() {
        let {dataSource} = this.props;
        if (!dataSource){
            return null;
        }
        return (<div className={css.main}>
            <div className={css.left}>
                {this.createCell(dataSource.obj||[])}
            </div>
            <div className={css.right}>{dataSource.rule}</div>
        </div>);
    }
    createCell(dataArr){
        return dataArr.map((data, index)=>{
           return (<div className={css.cellBg} style={{borderBottomWidth:(index==dataArr.length-1)?"0px":"1px"}}>
               {this.createItemCell(data)}
               {data.data&&data.data.length>1?<CellNewFlightDetail data = {data.data}/>:null}
           </div>);
        });
    }

    createItemCell(data){
        if (!data){
            return null;
        }
        let obj = data.obj;

        let startDate = obj.depDate?obj.depDate.substring(5):"";
        startDate = startDate.replace("-","月")+"日";


        let totalTime = obj.flightTime?obj.flightTime:"";
        let timeArr = totalTime.split(":");
        let totalText = "";
        if (timeArr[0]&&timeArr[0]>0){
            totalText = timeArr[0]+"小时";
        }
        if (timeArr[1]&&timeArr[1]>0){
            totalText = totalText + timeArr[1]+"分钟";
        }

        let endDate = obj.arrDate?obj.arrDate.substring(5):"";
        endDate = endDate.replace("-","月")+"日";
        var itemView = (<div className={css.table}>
            <div className={css.type_super}>
                <div className={css.typeText}>
                    {data.numFlight?("第"+data.numFlight+"程"):(data.flightType?"去程":"回程")}
                </div>
            </div>

            <div className={css.date_super}>
                <div className={css.date}>{obj.arrDate}</div>
                <div className={css.week}>{"周五"}</div>
            </div>

            <div className={css.flightLine_super}>
                <div className={css.flightLine}>
                    <div className={css.placeLine}>
                        <div className={css.placeLineItem}>{obj.depAirport}</div>
                        <div style={{fontSize:"22px",textAlign:"center"}}>{obj.depTime}</div>
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
                                     src ={obj.logo?obj.logo:require("../../../../images/logo.png")}/>
                            </div>
                            <div className={css.logoCompany}>
                                <div className={css.logoCompanyText}>{obj.compName}</div>
                            </div>
                        </div>
                        <div className={css.totalTimeText}>{"约"+totalText}</div>
                        <div className={css.flightLineNum}>{obj.num}</div>
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
                        <div className={css.refPlaceLineItem}>{obj.arrAirport}</div>
                        <div style={{textAlign:"center"}}>
                            <span style={{fontSize:"22px"}}>{obj.arrTime}</span>
                            <span style={{fontSize:"12px",color:"#FF5841"}}>{obj.tag==1?"+1天":""}</span>
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