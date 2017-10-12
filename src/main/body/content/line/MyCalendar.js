/**
 * Created by apin on 2017/10/11.
 */
import React, { Component } from 'react';
import css from './MyCalendar.less';
import { Icon} from 'antd';
import CalendarHelp from './CalendarHelp';
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
            date_num_array : []
        }
        //用于记录日期，显示的时候，根据dateObj中的日期的年月显示

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
    selectDate(s_day) {
        let { select_year, select_month} = this.state;
        this.setState({
            history_year : select_year,
            history_month : select_month,
            history_day : s_day,
            select_day : s_day
        }, () => {
            this.props.onSelectDate(select_year, select_month + 1, s_day);
        });
    }

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
        })
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
        })
    }

    /**
     * 渲染页面
     * @returns {XML}
     */
    render() {
        let { row_number, col_number } = this.props;
        let { current_year, current_month, current_day,
            select_year, select_month, select_day,
            history_year, history_month, history_day,
            date_num_array, first_day} = this.state;

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
            log(i)
            let previous_link = (<div className={css.itemGray} key={'previous'+i}>
                <div className={css.dayGray}>{previous_month_days - (first_day - i) + 1}</div>
            </div>);
            previous_days.push(previous_link);
        }

        //在本月当中的
        let currentClassName = '',
            currentText = '';
        for (let i = 0; i < month_day; i++) {

            // 今天样式
            if (current_year == select_year && current_month == select_month && current_day == (i + 1)) {
                currentClassName = css.itemRed;
                currentText = '今天';
            } else {
                currentText = i + 1;

                // 判断选择样式与历史样式是否相等，相等激活
                if (select_year == history_year && select_month == history_month && history_day == (i + 1)) {
                    currentClassName = css.itemSelect;
                } else {
                    currentClassName = css.itemActive;
                }
            }

            let current_link = (<div className={currentClassName} key={'current'+i}>
                <div className={css.dayActive} onClick={this.selectDate.bind(this, i + 1)}>
                    {currentText}
                </div>
            </div>);
            current_days.push(current_link);
        }

        //紧随本月之后的
        for (let i = 0; i < n_day; i++) {
            let next_link = (<div className={css.itemGray} key={'next'+i}>
                <div className={css.dayGray}>{i + 1}</div>
            </div>);
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
                    <Icon type="left" onClick={()=>{
                        this.previousMonth();
                    }}/>

                    <span className={css.calendarTitle}>{select_year} 年 {select_month + 1} 月</span>
                    <Icon type="right" onClick={()=>{
                        this.nextMonth();
                    }}/>
                </div>
                <div className={css.calendarBody}>
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
            </div>
        );
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;