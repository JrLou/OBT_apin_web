/**
 * Created by apin on 2017/10/28.
 */
import React, { Component } from 'react';
import css from './MyDatePick.less';
import DatePick from "../DatePick/DatePick.js";
import MyDiv from "../MyDiv.js";
import TimeHelp from "../../tool/TimeHelp.js";
/**
 * myDate:默认显示的日期
 * beforeCur:关闭某月之前的的日期 例：2017-10-28
 * 注意⚠️: 外部引用时样式通过style进行改变 但唯一不可改变的就是height
 */
class MyDatePick extends Component {
    constructor(props) {
        super(props);
        //用于记录日期，显示的时候，根据dateObj中的日期的年月显示
        let dateStamp = Date.parse(new Date());
        let dateS = TimeHelp.getYMD(dateStamp);
        this.state = {
            myDate:props.myDate?props.myDate:dateS,
            beforeCur:props.beforeCur,
            isShowDate:false,
            leftDatePick_width:0
        };
    }

    componentWillReceiveProps(nextProps) {
        // todo
        this.setState({
            myDate:nextProps.myDate?nextProps.myDate:this.state.myDate,
            beforeCur:nextProps.beforeCur
        });
    }
    /**
     * 组件渲染完后执行
     */
    componentDidMount() {

    }

    render(){
        let {callBack} = this.props;
        return(<MyDiv div={
            <div className={css.defaultInput}
                 {...this.props}
                 onMouseLeave={()=>{
                this.setState({
                    isShowDate:false
                });
            }}>
                <div className={css.dateTitle}
                     ref={(a)=>{this.datePick = a;}}
                     onClick={()=>{
                         let width = this.datePick.offsetWidth;
                         this.setState({
                             isShowDate:true,
                             leftDatePick_width:width
                         });
                     }}>{this.state.myDate}</div>
                <div className={css.calendarRelative}>
                    <DatePick
                        onSelectDate={(select_year, select_month , select_day)=>{
                            let YMD = select_year+"-"+select_month+"-"+select_day;
                            this.setState({
                                isShowDate:false,
                                myDate:YMD
                            },()=>{
                                if (callBack){
                                    callBack(YMD);
                                }
                            });
                            // this.selectDate(select_year, select_month, select_day);
                        }}
                        myDate={this.state.myDate}
                        beforeCur = {this.state.beforeCur}
                        isShow={this.state.isShowDate}
                        datePick_width = {this.state.leftDatePick_width}
                        year='2017'
                        month='10'
                        day='11'
                        row_number = {6}
                        col_number = {7}/>
                </div>
            </div>}/>);
    }
}
module.exports = MyDatePick;