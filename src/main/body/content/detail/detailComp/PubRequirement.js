/**
 * Created by apin on 2017/10/25.
 */
import React, { Component } from 'react';
import {Button} from 'antd';
import css from './PubRequirement.less';
import ClickHelp from '../../../tool/ClickHelp.js';
import MyInput from '../../../component/MyInput.js';
import MyTextArea from '../../../component/MyTextArea.js';
import MyDiv from "../../../component/MyDiv.js";
import MyDatePick from "../../../component/DatePick/MyDatePick.js";
import TimeHelp from "../../../tool/TimeHelp.js";
class PubRequirement extends Component {
    constructor(props) {
        super(props);
        let dateStamp = Date.parse(new Date());
        let dateS = TimeHelp.getYMD(dateStamp);
        this.limitDate = dateS;

        this.state = {
            isShow:false,
            totalNum:1,
            isSelect:true,
            // myDate:"2017-10-12",
            // isShowDate:false,
            // leftDatePick_width:0
            right_LimitDate:dateS,
            right_MyDate:dateS,
        };
        this.adultNum = 1;
        this.childNum = 0;
        this.phoneNum = "";
    }
    componentDidMount() {

    }

    showView(isShow){
        this.setState({
            isShow:isShow
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({

        });
    }
    setTotal(totalNum){
        this.setState({
            totalNum:totalNum
        });
    }

    render() {
        let {isShow,isSelect} = this.state;
        var div = (<div className={isShow?css.main:css.mainHidden}>
            <div className={css.bgCon}>
                <div className={css.title}>需求信息</div>
                <div className={css.cell}>
                    <div className={css.cellTitle}>航程类型:</div>
                    <MyDiv div={<div className={isSelect?css.selCellInput:css.defaultInput}
                                     onClick={()=>{
                                         this.setState({
                                             isSelect:true
                                         });
                                     }}>单程</div>}/>

                    <div className={css.space}></div>
                    <MyDiv div={<div className={isSelect?css.defaultInput:css.selCellInput} onClick={()=>{
                        this.setState({
                            isSelect:false
                        });
                    }}>往返</div>}/>
                </div>

                <div className={css.cell}>
                    <div className={css.cellTitle}>出发城市:</div>
                    <div className={css.cellInput}>上海</div>
                    <div className={css.space}></div>
                    <div className={css.cellTitle}>目的城市:</div>
                    <div className={css.cellInput}> 大阪</div>
                </div>

                <div className={css.cell}>
                    <div className={css.cellTitle}>出发日期:</div>
                    <MyDatePick style={{width:"150px"}}
                                beforeCur={this.limitDate}
                                callBack={(YMD)=>{
                                    this.setState({
                                        right_LimitDate:YMD,
                                        right_MyDate:YMD
                                    });
                                }}
                    />
                    {/*<MyDiv div={*/}
                    {/*<div className={css.defaultInput} onMouseLeave={()=>{*/}
                    {/*this.setState({*/}
                    {/*isShowDate:false*/}
                    {/*});*/}
                    {/*}}>*/}
                    {/*<div className={css.dateTitle}*/}
                    {/*ref={(a)=>{this.datePick = a;}}*/}
                    {/*onClick={()=>{*/}
                    {/*let width = this.datePick.offsetWidth;*/}
                    {/*this.setState({*/}
                    {/*isShowDate:true,*/}
                    {/*leftDatePick_width:width*/}
                    {/*});*/}
                    {/*}}>{this.state.myDate}</div>*/}
                    {/*<div className={css.calendarRelative}>*/}
                    {/*<DatePick*/}
                    {/*onSelectDate={(select_year, select_month , select_day)=>{*/}
                    {/*this.setState({*/}
                    {/*isShowDate:false,*/}
                    {/*myDate:select_year+"-"+select_month+"-"+select_day*/}
                    {/*});*/}
                    {/*// this.selectDate(select_year, select_month, select_day);*/}
                    {/*}}*/}
                    {/*myDate={this.state.myDate}*/}
                    {/*beforeCur = {this.state.myDate}*/}
                    {/*isShow={this.state.isShowDate}*/}
                    {/*datePick_width = {this.state.leftDatePick_width}*/}
                    {/*year='2017'*/}
                    {/*month='10'*/}
                    {/*day='11'*/}
                    {/*row_number = {6}*/}
                    {/*col_number = {7}/>*/}
                    {/*</div>*/}
                    {/*</div>}/>*/}

                    <div className={css.space}></div>
                    <div className={css.cellTitle}>返回日期:</div>
                    <MyDatePick style={{width:"150px"}}
                                beforeCur={this.state.right_LimitDate}
                                myDate={this.state.right_MyDate}
                                callBack={(YMD)=>{
                                    alert(YMD);
                                }}/>
                </div>

                <div className={css.cell}>
                    <div className={css.cellTitle}>出行人数:</div>
                    <MyInput
                        ref="adult"
                        maxLength={4}
                        className={css.refCellInput}
                        value={this.adultNum}
                        callBack={(val)=>{
                            this.adultNum = val?val:"";
                            let totalNum = parseInt(this.adultNum?this.adultNum:0)+parseInt(this.childNum?this.childNum:0);
                            this.setTotal(totalNum);
                        }}
                    />
                    <div className={css.refCellTitle}>成人</div>

                    <MyInput
                        ref="child"
                        maxLength={4}
                        className={css.refCellInput}
                        value={this.childNum}
                        callBack={(val)=>{
                            this.childNum = val?val:"";
                            let totalNum = parseInt(this.adultNum?this.adultNum:0)+parseInt(this.childNum?this.childNum:0);
                            this.setTotal(totalNum);
                        }}
                    />
                    <div className={css.refCellTitle}>儿童</div>

                    <div className={css.space}></div>
                    <div className={css.refCellTitle}>总人数:</div>
                    <div className={css.refCellTitle}> {this.state.totalNum}</div>
                </div>

                <div className={css.cell}>
                    <div className={css.cellTitle} style={{verticalAlign: "top"}}>备注:</div>

                    <MyTextArea maxLength={100}
                                style={{width:"400px",height:"60px"}}
                                placeholder="如：价格、时间等"/>
                </div>

                <div className={css.cell}>
                    <div className={css.cellTitle}>
                        <span>联系电话</span>
                        <span style={{fontSize:"20px",color:"red"}}>*</span>
                    </div>
                    <MyInput
                        ref="phone"
                        placeholder={"请输入可联系的手机号码"}
                        obj = {{
                            regular:/^1\d{10}$/
                        }}
                        maxLength={11}
                        className={css.thirCellInput}
                        value={this.phoneNum}
                        callBack={(val)=>{
                            this.phoneNum = val;
                        }}
                    />
                </div>

                <div className={css.btnCon}>
                    <MyDiv div={<div className={css.btn}
                                     onClick={()=>{
                                         this.showView(false);
                                     }}>提交需求</div>}/>
                </div>
            </div>
        </div>);
        return div;
    }
}
PubRequirement.contextTypes = {
    router: React.PropTypes.object
};
module.exports = PubRequirement;