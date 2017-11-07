/**
 * Created by apin on 2017/11/4.
 */
import React, { Component } from 'react';
import {Button,Icon} from 'antd';
import css from './CellTransFlight.less';
import ClickHelp from '../../tool/ClickHelp.js';
import DateHelp from '../../tool/DateHelp.js';

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
        var itemView = (<div style={{width:"100%",overflow:"hidden"}}>
                <div className={css.type}>
                    <div className={css.refTypeLine} style={{borderColor:isNoFirst?"#888D99":"white"}}></div>
                    <div className={data.flightType?css.typeImg:css.refTypeImg}></div>
                    {data.tripIndex==0?<div className={css.typeLine}></div>:null}
                </div>
                <div className={css.cellLine}>
                    <div className={css.table}>
                        <div className={css.myCell}>
                            <div className={css.floatDiv}>
                                <div className={css.date_super}>
                                    <div className={css.date}>{data.arrDate}</div>
                                </div>
                                <div className={css.placeLine_super}>
                                    <div className={css.placeLineItem}>{data.depAirport}</div>
                                </div>
                                <div className={css.company_super}>
                                    <div className={css.logoCompany_super}>
                                        <div className={css.logoBg}>
                                            <img className={css.logo}
                                                 src ={data.logo?data.logo:require("../../../../images/logo.png")}/>
                                        </div>
                                        <div className={css.logoCompany}>
                                            <div className={css.logoCompanyText}>{data.compName}</div>
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
                                    <div className={css.placeLineItem}>{data.arrAirport}</div>
                                    {/*<div style={{fontSize:"22px",textAlign:"right"}}>{data.depTime}</div>*/}
                                </div>
                                <div className={css.company_super}>
                                    <div className={css.logoCompanyText}>{data.num}</div>
                                </div>
                            </div>

                        </div>
                        <div className={css.totalTime}>
                            <div className={css.totalTimeText}>{"约"+data.flightTime}</div>
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
                        <span>{"约"+data.flightTime}</span>
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