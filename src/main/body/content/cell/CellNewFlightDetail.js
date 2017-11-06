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
                 }}><span>{"航程详情 "}</span>
                <Icon type={this.state.isUp==true?"up":"down"}/>
            </div>

            {this.state.isUp?<div style={{paddingLeft:"35px"}}>
                {this.createCell(data||[])}
            </div>:null}
        </div>);
    }
    createCell(dataArr){
        return dataArr.map((data, index)=>{
            log(index==0);
            log("-------");
            return (<CellTransFlight key={index} data = {data} isNoFirst={index!=0}/>);
        });
    }
}
CellNewFlightDetail.contextTypes = {
    router: React.PropTypes.object
};
module.exports = CellNewFlightDetail;