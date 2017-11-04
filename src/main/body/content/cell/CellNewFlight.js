/**
 * Created by apin on 2017/10/30.
 */
import React, { Component } from 'react';
import {Button,Icon} from 'antd';
import css from './CellNewFlight.less';
import ClickHelp from '../../tool/ClickHelp.js';
import CellNewFlightDetail from './CellNewFlightDetail.js';
/**
 * dataSource: 数据源 是一个对象
 * flightType: 航程类型 {单程 往返 多程}
 * isOrder: 是否显示最右侧价格及"确定此航班"按钮
 */
class CellNewFlight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: props.dataSource,
            flightType:true,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.state = {
            dataSource: nextProps.dataSource,
        };
    }
    render() {
        let {dataSource} = this.state;
        let {flightType,isOrder} = this.props;
        if (!dataSource){
            return null;
        }
        return (<div className={css.main}>
            <div className={css.left}>
                {this.createCell(dataSource.obj)}
            </div>

            <div className={css.right}>{dataSource.rule}</div>
        </div>);
    }
    createCell(dataArr){
        if (!dataArr||dataArr.length<1){
            return null;
        }
        var viewArr = [];
        for (let i=0;i<dataArr.length;i++){
            let itemData = dataArr[i];
            let itemDiv = (
                <CellLine key={i} obj = {itemData}/>);
            viewArr.push(itemDiv);
        }
        return viewArr;
    }
}
CellNewFlight.contextTypes = {
    router: React.PropTypes.object
};

class CellLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUp:false,
            data:props.obj
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            data:nextProps.obj,
        });
    }
    render(){
        let {data} = this.state;
        return (<div className={css.cellBg}>
            {this.createItemCell(data)}
            {data.data&&data.data.length>1?
                <div className={css.moreText}
                     onClick={()=>{
                         this.setState({
                             isUp:!this.state.isUp,
                         });
                     }}><span>{"航程详情 "}</span>
                    <Icon type={this.state.isUp==true?"up":"down"}/>
                </div>:null}

            <div style={{paddingLeft:"35px"}}>
                {this.createTransferFlight(this.state.isUp?data.data:undefined)}
            </div>

        </div>);
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
                    {data.isGo?"去程":"回程"}
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
                        <div className={css.line}></div>
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
                        <div className={css.line}></div>
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

    createTransferFlight(dataArr){
        if (!dataArr||dataArr.length<1){
            return null;
        }
        var viewArr = [];
        for (let i=0;i<dataArr.length;i++){
            let itemData = dataArr[i];
            let itemDiv = (<CellNewFlightDetail key={i} data = {itemData} flightType={2}/>);
            viewArr.push(itemDiv);
        }
        return viewArr;
    }
}

module.exports = CellNewFlight;