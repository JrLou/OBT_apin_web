/**
 * Created by apin on 2017/10/11.
 */
import React, { Component } from 'react';
import css from './MyCalendar.less';
import { Icon,Button} from 'antd';
import CalendarHelp from './CalendarHelp';
import DealDate from './DealDate';
class page extends Component {
    constructor(props) {
        super(props);
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
            tags :[],
            monthArr:[],
            isLeft:true
        };
        //用于记录日期，显示的时候，根据dateObj中的日期的年月显示

    }
    refreshMonth(isLeft,monthArr){
        // let myDateArr = DealDate.dealDateArr(dataSource);

        this.setState({
            // tags:dataSource,
            monthArr:monthArr,
            isLeft:isLeft
        });
    }
    //刷新日历每天的数据
    refreshCalendarDay(isLeft,dataSource){
        this.setState({
            tags:dataSource,
            isLeft:isLeft
        });
    }
    componentWillReceiveProps(nextProps) {
        // todo
    }

    /**
     * 组件渲染完后执行
     */
    componentDidMount() {
        let { year, month, day} = this.props;

        // 初始化状态
        if(year && month && day) {
            let date_num_array = this._initMonthDayNumber(year),
                first_day = CalendarHelp.weekOfMonth(new Date(year, month - 1));

            this.setState({
                select_year : year,
                select_month : month - 1,
                select_day : day,
                date_num_array : date_num_array,
                first_day : first_day
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
    selectDate(s_day,tagDataItem) {
        let { select_year, select_month,isLeft} = this.state;
        this.setState({
            history_year : select_year,
            history_month : select_month,
            history_day : s_day,
            select_day : s_day
        }, () => {
            if (this.props.onSelectDate){
                this.props.onSelectDate(tagDataItem,isLeft);

                //返回年月日具体数字
                // this.props.onSelectDate(select_year, select_month +1 , s_day,tagDataItem,isLeft);
            }
        });
    }

    //选择的月份
    selectMonth(selMonth,isLeft) {
        let { current_year, current_month, current_day,
            select_year, select_month, select_day, date_num_array, first_day} = this.state;

        select_year = selMonth.substring(0,4);
        select_month = selMonth.substring(5,7);

        if (select_month === 12) {
            select_month = select_month-1;
            date_num_array = this._initMonthDayNumber(select_year);
        } else {
            select_month = select_month-1;
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
        }, () => {
            if (this.props.onSelectMonth){
                //返回年月
                this.props.onSelectMonth(selMonth,isLeft);
            }
        });
    }

    /**
     * 渲染页面
     * @returns {XML}
     */
    render() {
        let {current_Y_M, row_number, col_number,title} = this.props;

        let { current_year, current_month, current_day,
            select_year, select_month, select_day,
            history_year, history_month, history_day,
            date_num_array, first_day,tags ,monthArr,isLeft} = this.state;

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
            let itemView = (<div className={css.itemGray}>
                <div className={css.dayGray}>
                    {previous_month_days - (first_day - i) + 1}
                </div>
            </div>);

            let previous_link = (<CalendarItem
                key={'previous'+i+(isLeft?"left":"right")}
                itemView = {itemView}/>);
            previous_days.push(previous_link);
        }

        //在本月当中的
        let currentClassName = '',
            currentText = '';
        let current_link = null;
        for (let i = 0; i < month_day; i++) {
            // 今天样式
            if (current_year == select_year && current_month == select_month && current_day == (i + 1)) {
                currentClassName = css.itemRed;
                currentText = '今天';
            } else {
                currentText = i + 1;
                currentClassName = css.itemActive;
            }
            let itemView = (<div className={currentClassName}>
                <div className={css.dayActive}>
                    {currentText}
                </div>
            </div>);
            current_link = (<CalendarItem key={'current'+i} itemView = {itemView}/>);


            // 添加tag样式
            if (tags&&tags.length > 0) {
                for (let j = 0; j < tags.length; j++) {
                    let tagDataItem = tags[j];
                    let tagDay = tagDataItem.retDate;
                    tagDay = parseInt(tagDay.substring(8));
                    if ((i + 1) === tagDay) {
                        // 判断选择样式与历史样式是否相等，相等激活
                        if (select_year == history_year && select_month == history_month && history_day == (i + 1)) {
                            currentClassName = css.itemSelect;
                            let itemView = (
                                <div className={currentClassName}
                                     onClick={this.selectDate.bind(this, i + 1,tagDataItem)}>
                                    <img className={css.itemSelect_sign}
                                         src={require("../../../../images/select_sign.png")}/>
                                    <div className={css.dayActive}>
                                        {currentText}
                                    </div>
                                    <div className={css.price}> {"¥"+tagDataItem.basePrice}</div>
                                    {isLeft?null:<div className={css.sit}>{"余位"+tagDataItem.remainCount}</div>}
                                </div>);
                            current_link = (<CalendarItem key={'current'+i+(isLeft?"left":"right")} itemView = {itemView}/>);
                        } else {
                            currentClassName = css.itemTags;
                            log(tagDataItem);
                            log("---------");
                            let itemView = (
                                <div className={currentClassName}
                                     onClick={this.selectDate.bind(this, i + 1,tagDataItem)}>
                                    <div className={css.dayActive}>
                                        {currentText}
                                    </div>
                                    <div className={isLeft?css.refPrice:css.price}> {"¥"+tagDataItem.basePrice}</div>
                                    {isLeft?null:<div className={css.sit}>{"余位"+tagDataItem.remainCount}</div>}
                                </div>);

                            current_link = (<CalendarItem  key={'current'+i+(isLeft?"left":"right")} itemView={itemView}/>);
                            break;
                        }
                    }
                }
            }
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
            <div className={css.calendar}>
                <div className={css.calendarHeader}>
                    <div className={css.calendarHeader_title}
                         style={{width:title!=""?"12%":"0px"}}
                    >{title}</div>
                    <div className={css.calendarHeader_con} style={{width:title!=""?"88%":"100%"}}>
                        <MonthView
                            selectMonthAction={(selMonth)=>{
                                this.selectMonth(selMonth,isLeft);
                            }}
                            current_month={current_Y_M}
                            select_year = {select_year}
                            select_month = {select_month}
                            monthArr = {monthArr}
                        />
                    </div>

                </div>
                <div className={css.cBodyHead}>
                    <div className={css.cBodyItem}>日</div>
                    <div className={css.cBodyItem}>一</div>
                    <div className={css.cBodyItem}>二</div>
                    <div className={css.cBodyItem}>三</div>
                    <div className={css.cBodyItem}>四</div>
                    <div className={css.cBodyItem}>五</div>
                    <div className={css.cBodyItem}>六</div>
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
    render(){
        let {itemView} = this.props;

        return(<div className={this.state.isMounseSel?css.borderIsMounseSel:css.borderDefault}
                    onMouseEnter={()=>{
                        this.setState({
                            isMounseSel:true
                        });
                    }}
                    onMouseLeave={()=>{
                        this.setState({
                            isMounseSel:false
                        });
                    }}
        >
            {itemView}
        </div>);
    }

}


class MonthView extends Component{
    constructor(props) {
        super(props);
        let {current_month} = this.props;
        current_month = current_month.substring(0,7);
        this.state = ({
            current_month:current_month,
            remove_width:"0"
        });
        this.removeNum = 0;
        this.removeTotal = 0;
    }

    /**
     * 组件渲染完后执行
     */
    componentDidMount() {

    }
    render(){
        let {select_year,selectMonthAction,select_month,monthArr} = this.props;

        let month_width = 0;
        if (monthArr&&monthArr.length>0){
            month_width = monthArr.length*90;
        }

        var translateX = "translateX("+this.state.remove_width +"px)";
        var monthView_With = this.monthView?this.monthView.offsetWidth:0;
        var blurEffect = "-webkit-gradient(linear, "+(monthView_With!=0?(monthView_With-10):0)+" 0,"+ monthView_With+" 0, from(rgba(0, 0, 0, 10)), to(rgba(5, 5, 0, 0)))";

        return(<div className={css.monthView_bg}>
            <div className={css.calendarHeaderIcon}>

                <img className={css.icon} style={{float: "right"}}
                     onClick={()=>{
                         this.removeNum = this.removeNum-1;
                         this.removeTotal = this.removeTotal -90;
                         if (this.removeNum<0){
                             this.removeNum = this.removeNum+1;
                             this.removeTotal = this.removeTotal +90;
                             return;
                         }
                         var remove_width = this.state.remove_width;
                         var remove = remove_width+90;
                         setTimeout(()=>{
                             this.setState({
                                 remove_width:remove
                             });
                         },1000);
                     }}
                     src={require("../../../../images/select_left_icon.png")}/>

            </div>


            {/*<div className={css.blurEffect}></div>*/}
            <div ref={(a)=>this.monthView = a}
                 className={css.monthView}
                 style={{
                     WebkitMaskImage: blurEffect
                 }}
            >
                <div className={css.monthView_super}
                     style={{
                         width:month_width+"px",
                         transform:translateX
                     }}>
                    {this.createMonthItem(monthArr,selectMonthAction)}
                </div>
            </div>
            {/*<div className={css.blurEffect}></div>*/}

            <div className={css.refCalendarHeaderIcon}>
                <img className={css.icon}
                     src={require("../../../../images/select_right_icon.png")}
                     onClick={()=>{
                         //日期所占背景的宽度
                         let monthView_width = this.monthView.offsetWidth;
                         this.removeNum = this.removeNum+1;
                         this.removeTotal = this.removeTotal +90;

                         let remove_width = this.state.remove_width;
                         //此处减90是因为 第一个从零开始 然后减去最后一个的宽度
                         let isBeyond = month_width-(monthView_width+this.removeTotal-90);
                         if (!monthArr || isBeyond<0){
                             this.removeNum = this.removeNum-1;
                             this.removeTotal = this.removeTotal -90;
                             return;
                         }
                         let remove = remove_width-90;
                         this.setState({
                             remove_width:remove
                         });
                     }}/>
            </div>
        </div>);
    }
    createMonthItem(monthArr,selectMonthAction){
        if (!monthArr){
            return null;
        }
        var monthItemArr = [];
        for (let i = 0; i < monthArr.length; i++) {
            // 判断选择样式与历史样式是否相等，相等激活
            let item_MonthView = null;
            let monthData_item = monthArr[i];
            let isSelect = (monthData_item == this.state.current_month);
            // let myMonth = monthData_item?monthData_item.replace("-","年"):"";
            item_MonthView = (
                <div key={"current_month"+i}
                     onClick={()=>{
                         this.setState({
                             current_month:monthData_item
                         },()=>{
                             if (selectMonthAction){
                                 selectMonthAction(monthData_item);
                             }
                         });
                     }}
                     className={isSelect?css.select_monthItem:css.monthItem}>
                    {monthData_item}
                    {/*{monthData_item+"月"}*/}
                </div>);
            monthItemArr.push(item_MonthView);
        }
        return monthItemArr;
    }
}
module.exports = page;