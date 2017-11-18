/**
 * Created by apin on 2017/11/14.
 */
import React, { Component } from 'react';
import css from './CellFlightCom.less';
import {CookieHelp } from '../../../../../lib/utils/index.js';

class CellFlightCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAn:false
        };
        setTimeout(()=>{
            this.setState({
                isAn:true
            });
        },300);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isNewData){
            this.setState({
                isAn:false
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        isAn:true
                    });
                },300);
            });
        }

    }
    render(){
        let {dataItem,flightType} = this.props;
        if (!dataItem){
            return null;
        }
        let airlineInfo = (dataItem.voyages&&dataItem.voyages.length>0)?dataItem.voyages:[];
        let itemView = (<div className={css.cellBg}>
            <div className={this.state.isAn?css.cell:css.hiddenCell} >
                {dataItem.isDirect&&dataItem.isDirect==1?<div className={css.sign}>直营</div>:null}
                <div className={css.left}>
                    <div className={css.table}>
                        {this.createItemCell(airlineInfo,flightType)}
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
                                             let voyagesArr = dataItem.voyages?dataItem.voyages:[];
                                             let obj= {
                                                 airlineId:dataItem.airlineId?dataItem.airlineId:"",
                                                 depDate:voyagesArr[0]&&voyagesArr[0].depDate?voyagesArr[0].depDate:"",
                                                 retDate:voyagesArr[1]&&voyagesArr[1].depDate?voyagesArr[1].depDate:"",
                                                 isDirect:dataItem.isDirect,
                                             };
                                             const isLogin = CookieHelp.getCookieInfo('IS_LOGIN');
                                             if (isLogin){
                                                 window.app_open(this, "/FlightDetail", {
                                                     type:dataItem.isDirect&&dataItem.isDirect==1?1:2,
                                                     step:1,
                                                     data:obj
                                                 },"self");
                                             }else {
                                                 window.modal.showModal(0,()=>{
                                                     window.app_open(this, "/FlightDetail", {
                                                         type:dataItem.isDirect&&dataItem.isDirect==1?1:2,
                                                         step:1,
                                                         data:obj
                                                     },"self");
                                                 });
                                             }
                                         }}>{"预订"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);

        return itemView;
    }
    createItemCell(data,flightType){
        if (!data||data.length<1){
            return null;
        }
        var viewArr = [];
        for (let i=0;i<data.length;i++){
            let dataItem = data[i];
            let startDate = dataItem.depDate?dataItem.depDate.substring(5):"";
            startDate = startDate.replace("-","月")+"日";let endDate = dataItem.arrDate?dataItem.arrDate.substring(5):"";
            endDate = endDate.replace("-","月")+"日";
            var itemView = (<div key={i} className={css.cellLine} style={{borderBottomWidth:(flightType&&i==0)?"1px":"0px"}}>
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
                                <div className={css.totalTimeText}>{dataItem.flightTime?dataItem.flightTime:""}</div>
                                <img className={css.line} src={require('../../../../images/trip_line.png')}/>
                                {dataItem.isStop==1?<div className={css.totalTimeText} style={{marginTop:2,color:"#FF5841"}}>{"经停"}</div>:null}
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

                </div>);
            viewArr.push(itemView);
        }
        return viewArr;
    }
}
module.exports = CellFlightCom;