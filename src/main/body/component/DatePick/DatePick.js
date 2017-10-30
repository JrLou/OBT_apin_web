/**
 * Created by apin on 2017/10/27.
 */
import React, { Component } from 'react';
import {Icon} from "antd";
import css from './DatePick.less';
import CalendarHelp from './CalendarHelp';

/*
 beforeCur: 限制此日期之前的不能点击

 */
class page extends Component {
    constructor(props) {
        super(props);
        //用于记录日期，显示的时候，根据dateObj中的日期的年月显示
        this.state = {
            current_year : CalendarHelp.getFullYear(),
            current_month : CalendarHelp.getMonth(),
            current_day : CalendarHelp.getDate(),
            select_year : CalendarHelp.getFullYear(),
            select_month : CalendarHelp.getMonth(),
            select_day : CalendarHelp.getDate(),
            history_year : undefined,
            history_month : undefined,
            history_day : undefined,
            date_num_array : [],
            isShow:false,
            datePick_width:0
        };
        this.weekArr = ["日","一","二","三","四","五","六"];
    }

    componentWillReceiveProps(nextProps) {
        // todo
        this.setShow(nextProps.isShow,nextProps.datePick_width);
        let beforeCur = nextProps.beforeCur;
        this.initbeforeCurYMD(beforeCur);

        let date = nextProps.myDate;
        let dateArr = date.split("-");
        this.initYMD(dateArr[0]?dateArr[0]:"", dateArr[1]?dateArr[1]:"", dateArr[2]?dateArr[2]:"");
    }
    /**
     * 组件渲染完后执行
     */
    componentDidMount() {
        let {myDate,beforeCur,isShow,datePick_width} = this.props;
        this.setShow(isShow);
        this.initbeforeCurYMD(beforeCur);
        let dateArr = myDate.split("-");
        this.initYMD(dateArr[0]?dateArr[0]:"", dateArr[1]?dateArr[1]:"", dateArr[2]?dateArr[2]:"");
    }
    setShow(isShow,datePick_width){
        this.setState({
            isShow:isShow,
            datePick_width:datePick_width?datePick_width:0
        });
    }
    // 初始化当前年月日之前的状态
    initbeforeCurYMD(beforeCur){
        if (beforeCur){
            let beforeDateArr = beforeCur.split("-");
            let beforeCurY=beforeDateArr[0]?beforeDateArr[0]:0;
            let beforeCurM=beforeDateArr[1]?(parseInt(beforeDateArr[1])):0;
            let beforeCurD=beforeDateArr[2]?beforeDateArr[2]:0;
            this.beforeCur = beforeCurY+"-"+beforeCurM+"-"+beforeCurD;
        }
    }
    // 初始化当前年月日状态
    initYMD(year,month,day){
        if(year && month && day) {
            let date_num_array = this._initMonthDayNumber(year),
                first_day = CalendarHelp.weekOfMonth(new Date(year, month - 1));

            this.setState({
                select_year : year,
                select_month : month - 1,
                select_day : day,
                history_year : year,
                history_month : month - 1,
                history_day : day,
                date_num_array : date_num_array,
                first_day : first_day,
            });
        }
    }
    /**
     * 给月份数组附上每月天数
     * @param year 年份
     * @private
     */
    _initMonthDayNumber(year) {
        let _date_array = [];

        for (var i = 0; i < 12; i++) {
            switch (i + 1) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    _date_array.push(31);
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    _date_array.push(30);
                    break;
                case 2:
                    if (CalendarHelp.isLeapYear(year)) {
                        _date_array.push(29);
                    } else {
                        _date_array.push(28);
                    }
                    break;
                default:
                    break;
            }
        }
        return _date_array;
    }

    /**
     * 组件将要挂载
     * 设置月份数组以及计算出每月的第一天星期几
     */
    componentWillMount() {
        let date_num_array = this._initMonthDayNumber(this.state.current_year),
            first_day = CalendarHelp.weekOfMonth();

        this.setState({date_num_array : date_num_array, first_day : first_day});
    }

    /**
     * 日期选择
     * @param s_day
     */
    selectDate(s_day) {
        let { select_year, select_month} = this.state;
        this.setState({
            history_year : select_year,
            history_month : select_month,
            history_day : s_day,
            select_day : s_day,
        }, () => {
            if (this.props.onSelectDate){
                //返回年月日具体数字
                this.props.onSelectDate(select_year, select_month +1 , s_day);
            }
        });
    }

    //选择的月份
    /**
     * 前一个月
     */
    previousMonth() {
        let { current_year, current_month, current_day,
            select_year, select_month, select_day, date_num_array, first_day} = this.state;

        if (select_month === 0) {
            select_year = +select_year - 1;
            select_month = 11;
            date_num_array = this._initMonthDayNumber(select_year);
        } else {
            select_month = +select_month - 1;
        }

        first_day = CalendarHelp.weekOfMonth(new Date(select_year, select_month));

        if (current_year === select_year &&
            current_month === select_month) {
            select_day = current_day;
        } else {
            select_day = undefined;
        }

        this.setState({
            select_year : select_year,
            select_month : select_month,
            select_day : select_day,
            date_num_array : date_num_array,
            first_day : first_day
        });
    }

    /**
     * 之后一个月
     */
    nextMonth() {
        let { current_year, current_month, current_day,
            select_year, select_month, select_day, date_num_array, first_day} = this.state;

        if (select_month === 11) {
            select_year = +select_year + 1;
            select_month = 0;
            date_num_array = this._initMonthDayNumber(select_year);
        } else {
            select_month = +select_month + 1;
        }

        first_day = CalendarHelp.weekOfMonth(new Date(select_year, select_month));

        if (current_year === select_year &&
            current_month === select_month) {
            select_day = current_day;
        } else {
            select_day = undefined;
        }

        this.setState({
            select_year : select_year,
            select_month : select_month,
            select_day : select_day,
            date_num_array : date_num_array,
            first_day : first_day
        });
    }

    /**
     * 渲染页面
     */
    render() {
        let {row_number, col_number} = this.props;

        let { current_year, current_month, current_day,
            select_year, select_month, select_day,
            history_year, history_month, history_day,
            date_num_array, first_day,isShow,datePick_width} = this.state;

        let month_day = date_num_array[select_month],
            n_day = row_number * col_number - first_day - month_day,
            previous_month_days = undefined,
            previous_days = [],
            current_days = [],
            next_days = [],
            total_days = [],
            previous_month = undefined;

        if (select_month === 0) {
            previous_month = 11;
        } else {
            previous_month = select_month - 1;
        }

        previous_month_days = date_num_array[previous_month];
        //在本月之前的
        for (let i = 0; i < first_day; i++) {
            let itemView =
                (<div className={css.itemGray}
                      key={'previousItem'+i}>
                    <div className={css.dayGray}>
                        {previous_month_days - (first_day - i) + 1}
                    </div>
                </div>);

            let previous_link = (<CalendarItem
                key={'previous'+i}
                itemView = {itemView}/>);
            previous_days.push(previous_link);
        }

        //在本月当中的
        let currentClassName = '',
            currentText = '';
        let itemView = null;
        let textColor = null;
        let beforeCur = this.beforeCur;
        for (let i = 0; i < month_day; i++) {
            let isBeforeCur= false;
            if (beforeCur){
                let day = i+1;
                let month = select_month+1;
                let forCircle_YMD = select_year+"-"+(select_month>11?select_month:(month<10?("0"+month.toString()):month))+"-"+(day<10?("0"+day.toString()):day);

                beforeCur = this.beforeCur.replace(/-/g,'/');
                forCircle_YMD = forCircle_YMD.replace(/-/g,'/');
                let beforeCur_stamp = new Date(beforeCur);
                let forCircle_YMD_stamp = new Date(forCircle_YMD);
                beforeCur_stamp = beforeCur_stamp.getTime();
                forCircle_YMD_stamp = forCircle_YMD_stamp.getTime();

                isBeforeCur= beforeCur&&(beforeCur_stamp>forCircle_YMD_stamp);

                if (isBeforeCur){
                    currentClassName = css.itemGray;
                    textColor = css.dayGray;
                }else {
                    currentClassName = css.itemActive;
                    textColor = css.dayTitle;
                }
            }else {
                currentClassName = css.itemActive;
                textColor = css.dayTitle;
            }

            // 今天样式
            if (current_year == select_year && current_month == select_month && current_day == (i + 1)) {
                currentText = '今';
                currentClassName = css.itemToday;
                textColor = css.todayColor;
            } else {
                currentText = i + 1;
                // currentClassName = css.itemActive;
                // textColor = css.dayTitle;
            }

            itemView = (<div className={currentClassName}
                             key={'currentItem'+i}
                             style={{cursor:isBeforeCur?"auto": 'pointer'}}
                             onClick={()=>{
                                 if (!isBeforeCur){
                                     this.selectDate( i + 1);
                                 }
                             }}>
                <div className={textColor}>
                    {currentText}
                </div>
            </div>);

            // 判断选择样式与历史样式是否相等，相等激活
            let isSelect = (select_year == history_year && select_month == history_month && history_day == (i + 1));
            if (isSelect){
                currentClassName = css.itemTags;
                itemView = (
                    <div className={currentClassName}
                         key={'currentItem'+i}
                         style={{cursor:isBeforeCur?"auto": 'pointer'}}
                         onClick={()=>{
                             if (!isBeforeCur){
                                 this.selectDate( i + 1);
                             }
                         }}>
                        <div className={css.daySelect}>
                            {currentText}
                        </div>
                    </div>);
            }

            let current_link = (<CalendarItem key={'calendarItem'+i} itemView = {itemView}/>);
            current_days.push(current_link);
        }

        //紧随本月之后的
        for (let i = 0; i < n_day; i++) {
            let itemView = (
                <div className={css.itemGray} >
                    <div className={css.dayGray}>{i + 1}</div>
                </div>);
            let next_link = (<CalendarItem key={'next'+i} itemView={itemView}/>);
            next_days.push(next_link);
        }

        total_days = previous_days.concat(current_days, next_days);

        let ul_list = [];
        if (total_days.length > 0) {
            for (let i = 0; i < row_number; i++) {
                let li_list = [],
                    start_index = i * col_number,
                    end_index = (i + 1) * col_number;
                for (let j = start_index; j < end_index; j++) {
                    li_list.push(total_days[j]);
                }
                ul_list.push(li_list);
            }
        }

        return (
            <div className={isShow?css.calendar:css.hidden} style={{left:(0.5*(datePick_width-200))+"px"}}>
                <div className={css.calendarHeader}>
                    <Icon type="left" onClick={()=>{
                        this.previousMonth();
                    }}/>
                    <span className={css.calendarTitle}>{select_year} 年 {select_month + 1} 月</span>
                    <Icon type="right" onClick={()=>{
                        this.nextMonth();
                    }}/>
                </div>

                <div className={css.cBodyHead}>
                    {this.createWeekItem()}
                </div>
                <div className={css.cBodyHead}>
                    {
                        ul_list.map((u, index) => {
                            return (<div key={'ul'+index} className={css.contentRow}>{u}</div>);
                        })
                    }
                </div>
            </div>
        );
    }
    createWeekItem(){
        let weekArrView=[];
        let data = this.weekArr;
        for (let i=0;i<data.length;i++){
            let dataItem = data[i];
            let div = (<div className={css.cBodyItem} key={i+"week"}>{dataItem}</div>);
            weekArrView.push(div);
        }
        return weekArrView;
    }
}
page.contextTypes = {
    router: React.PropTypes.object
};

//日历小Item
class CalendarItem extends Component{
    constructor(props) {
        super(props);
        this.state = ({
            isMounseSel:false
        });
    }
    /**
     * 组件渲染完后执行
     */
    componentDidMount() {

    }
    isMounseIn(isIn){
        this.setState({
            isMounseSel:isIn
        });
    }
    render(){
        let {itemView} = this.props;
        return(<div className={this.state.isMounseSel?css.borderIsMounseSel:css.borderDefault}
                    onMouseEnter={()=>{
                        this.isMounseIn(true);
                    }}
                    onMouseLeave={()=>{
                        this.isMounseIn(false);
                    }}>
            {itemView}
        </div>);
    }
}
module.exports = page;