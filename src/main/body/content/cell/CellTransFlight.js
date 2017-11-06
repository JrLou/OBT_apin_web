/**
 * Created by apin on 2017/11/4.
 */
import React, { Component } from 'react';
import {Button,Icon} from 'antd';
import css from './CellTransFlight.less';
import ClickHelp from '../../tool/ClickHelp.js';

class CellTransFlight extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        let {data,isNoFirst} = this.props;
        if (!data){
            return null;
        }
        return (<div className={css.main}>{this.createCell(data||{},isNoFirst)}</div>);
    }
    createCell(data,isNoFirst){
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
        var itemView = (<div style={{width:"100%",overflow:"hidden"}}>
                <div className={css.type}>
                    <div className={css.refTypeLine} style={{borderColor:isNoFirst?"#888D99":"white"}}></div>
                    <div className={data.flightType?css.typeImg:css.refTypeImg}></div>
                    {data.flightType?<div className={css.typeLine}></div>:null}
                </div>
                <div className={css.cellLine}>
                    <div className={css.table}>
                        <div className={css.myCell}>
                            <div className={css.floatDiv}>
                                <div className={css.date_super}>
                                    <div className={css.date}>{obj.arrDate}</div>
                                </div>
                                <div className={css.placeLine_super}>
                                    <div className={css.placeLineItem}>{obj.depAirport}</div>
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
                                </div>
                            </div>

                            <div className={css.floatDiv}>
                                <div className={css.date_super}>
                                    <div className={css.date}>
                                        <span >{"11-05"+" "}</span>
                                        <span style={{fontWeight:"bold",}}>{"12:25"}</span>
                                    </div>
                                </div>
                                <div className={css.placeLine_super}>
                                    <div className={css.placeLineItem}>{obj.arrAirport}</div>
                                    {/*<div style={{fontSize:"22px",textAlign:"right"}}>{obj.depTime}</div>*/}
                                </div>
                                <div className={css.company_super}>
                                    <div className={css.logoCompanyText}>{obj.num}</div>
                                </div>
                            </div>

                        </div>
                        <div className={css.totalTime}>
                            <div className={css.totalTimeText}>{"约"+totalText}</div>
                        </div>
                    </div>
                </div>

                {data.flightType?<div className={css.table}>
                    <div className={css.trans}>
                        <div className={css.transLineTop}></div>
                        <div className={css.transImg}></div>
                        <div className={css.transLineBottom}></div>
                    </div>
                    <div className={css.transText}>
                        <span>{"中转"}</span>
                        <span style={{color:"#29A6FF"}}>{" 上海 "}</span>
                        <span>{"约"+totalText}</span>
                    </div>
                </div>:null}

            </div>
        );
        return itemView;
    }
}
CellTransFlight.contextTypes = {
    router: React.PropTypes.object
};
module.exports = CellTransFlight;