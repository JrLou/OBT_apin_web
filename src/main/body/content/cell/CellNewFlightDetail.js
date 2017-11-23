/**
 * Created by apin on 2017/11/2.
 */
import React, { Component } from 'react';
import {Button,Icon} from 'antd';
import css from './CellNewFlightDetail.less';
import CellTransFlight from './CellTransFlight.js';
import ClickHelp from '../../tool/ClickHelp.js';

class CellNewFlightDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUp:false,
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        let {data} = this.props;
        return (<div className={css.main}>
            <div className={css.moreText}
                 onClick={()=>{
                     this.setState({
                         isUp:!this.state.isUp,
                     });
                 }}><span>{"航程详情"}</span>
                <span style={{fontSize:"12px"}}>{" (中转) "}</span>
                <Icon type={this.state.isUp==true?"up":"down"}/>
            </div>

            {this.state.isUp?<div style={{paddingLeft:"35px"}}>
                {this.createCell(data||[])}
            </div>:null}
        </div>);
    }
    createCell(dataArr){
        return dataArr.map((data, index)=>{
            if (index < dataArr.length-1){
                data.transTime = this.getStamp(dataArr,index);
            }
            return (<CellTransFlight key={index} data = {data} isNoFirst={index!=0} isLast={index==(dataArr.length-1)}/>);
        });
    }
    getStamp(dataArr,index){
        let objStart= dataArr[index];
        let startTime = objStart.arrDate+" "+objStart.arrTime;
        let startStamp = new Date(startTime).getTime();


        let objEnd= dataArr[index+1];
        let endTime = objEnd.depDate+" "+objEnd.depTime;
        let endStamp = new Date(endTime).getTime();

        let timeStamp = (parseFloat(endStamp)-parseFloat(startStamp))/1000;

        let hour = parseInt(timeStamp/3600);
        let min = parseInt((timeStamp%3600)/60);
        return hour+"小时 "+min+"分钟";
    }
}
CellNewFlightDetail.contextTypes = {
    router: React.PropTypes.object
};
module.exports = CellNewFlightDetail;