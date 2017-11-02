/**
 * Created by apin on 2017/11/1.
 */
import React, { Component } from 'react';
import {Button} from 'antd';
import css from './AddFlightLine.less';
import MyDatePick from "../../../component/DatePick/MyDatePick.js";
import TimeHelp from "../../../tool/TimeHelp.js";
class AddFlightLine extends Component {
    constructor(props){
        super(props);
        let dateStamp = Date.parse(new Date());
        let dateS = TimeHelp.getYMD(dateStamp);
        this.limitDate = dateS;
        this.state = {
            isSelType:props.isSelType?props.isSelType:1,
            right_LimitDate:dateS,
            right_MyDate:dateS,
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            isSelType:nextProps.isSelType?nextProps.isSelType:1,
        });
    }

    render(){
        let {isSelType}=this.state;
        let {isNoCanDel,callBack}=this.props;

        return (<div>
            <div className={css.refCell}>
                <div className={css.cellTitle}>出发城市:</div>
                <div className={css.space}></div>
                <div className={css.cellTitle}>目的城市:</div>
            </div>
            <div className={css.cell}>
                <input className={css.cellInput} defaultValue={"上海"}/>
                <div className={css.space}></div>
                <input className={css.cellInput} defaultValue={"大阪"}/>
            </div>

            <div className={css.refCell}>
                <div className={css.cellTitle}>出发日期:</div>
                <div className={css.space}></div>
                {(isSelType==2)?(<div className={css.cellTitle}>返回日期:</div>):null}
            </div>
            <div className={css.cell}>
                <MyDatePick className={css.cellTitle} style={{textAlign:"center"}}
                            beforeCur={this.limitDate}
                            callBack={(YMD)=>{
                                this.setState({
                                    right_LimitDate:YMD,
                                    right_MyDate:YMD
                                });
                            }}
                />
                <div className={css.space}></div>
                {(isSelType==2)?
                    (<MyDatePick className={css.cellTitle} style={{textAlign:"center"}}
                        beforeCur={this.state.right_LimitDate}
                        myDate={this.state.right_MyDate}
                        callBack={(YMD)=>{
                            alert(YMD);
                        }}/>):<div className={css.spaceDatePick}>
                        {isSelType>=3?<div className={isNoCanDel?css.refDeleBtn:css.deleBtn} onClick={()=>{
                            if (!isNoCanDel&&callBack){
                                callBack();
                            }
                        }}>{isSelType>=3?"删除":""}
                        </div>:null}
                    </div>}
            </div>
            <div className={css.myLine}></div>


            <Button type="primary"
                    style={{float:"right",height:"32",letterSpacing:"1px",fontSize:"13px",borderRadius:"2px"}}
                    onClick={()=>{
                        alert("提交需求");
                    }}>提交需求</Button>
        </div>);
    }
}
AddFlightLine.contextTypes = {
    router: React.PropTypes.object
};
module.exports = AddFlightLine;