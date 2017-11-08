/**
 * Created by apin on 2017/10/30.
 */
import React, { Component } from 'react';
import {Button,Icon} from 'antd';
import css from './CellNewFlight.less';
import ClickHelp from '../../tool/ClickHelp.js';
import CellNewFlightDetail from './CellNewFlightDetail.js';
import NumTransToTextHelp from '../../tool/NumTransToTextHelp.js';
import DateHelp from '../../tool/DateHelp.js';

class CellNewFlight extends Component {
    constructor(props) {
        super(props);

    }

    componentWillReceiveProps(nextProps) {

    }
    render() {
        let {dataSource,flightType} = this.props;
        if (!dataSource){
            return null;
        }
        return (<div className={css.main}>
            <div className={css.left}>
                {this.createCell(dataSource.voyages||[],flightType)}
            </div>
            <div className={css.right}>{"件数:"+dataSource.freeBag + " 重量:"+dataSource.weightLimit}</div>
        </div>);
    }
    createCell(dataArr,flightType){
        return dataArr.map((data, index)=>{
           return (<div key={index} className={css.cellBg} style={{borderBottomWidth:(index==dataArr.length-1)?"0px":"1px"}}>
               {this.createItemCell(data, index,flightType)}
               {data.child&&data.child.length>0?<CellNewFlightDetail data = {data.child}/>:null}
           </div>);
        });
    }

    createItemCell(data,index,flightType){
        if (!data){
            return null;
        }

        var itemView = (<div className={css.table}>
            <div className={css.type_super}>
                <div className={css.typeText}>
                    {flightType==3?("第"+ NumTransToTextHelp.getValue(index+1)+"程"):(data.tripIndex==0?"去程":"回程")}
                </div>
            </div>

            <div className={css.date_super}>
                <div className={css.date}>{data.arrDate}</div>
                <div className={css.week}>{NumTransToTextHelp.getWeek(data.week)}</div>
            </div>

            <div className={css.flightLine_super}>
                <div className={css.flightLine}>
                    <div className={css.placeLine}>
                        <div className={css.placeLineItem}>{data.depAirport}</div>
                        <div style={{fontSize:"22px",textAlign:"center"}}>{data.depTime}</div>
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
                                     src ={data.logo?data.logo:require("../../../../images/logo.png")}/>
                            </div>
                            <div className={css.logoCompany}>
                                <div className={css.logoCompanyText}>{data.compName}</div>
                            </div>
                        </div>
                        <div className={css.totalTimeText}>{"约"+data.flightTime}</div>
                        <div className={css.flightLineNum}>{data.num}</div>
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
                        <div className={css.refPlaceLineItem}>{data.arrAirport}</div>
                        <div style={{textAlign:"center"}}>
                            <span style={{fontSize:"22px"}}>{data.arrTime}</span>
                            <span style={{fontSize:"12px",color:"#FF5841"}}>{data.tag==1?"+1天":""}</span>
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