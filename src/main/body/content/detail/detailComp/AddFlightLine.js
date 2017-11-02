/**
 * Created by apin on 2017/11/1.
 */
import React, { Component } from 'react';
import { Form, Input, Icon, Button ,DatePicker} from 'antd';
import moment from 'moment';

import css from './AddFlightLine.less';
import MyDatePick from "../../../component/DatePick/MyDatePick.js";
import TimeHelp from "../../../tool/TimeHelp.js";

const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
let uuid = 1;
class FlightLine extends Component {
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

    componentDidMount() {
        let uuid = 1;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        form.setFieldsValue({
            keys: nextKeys,
        });
    }
    add () {
        uuid++;
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

    handleSubmit(e,callBackParam) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
            if (!err&&callBackParam) {
                callBackParam(values);
                console.log('Received values of form: ', values);
            }
        });
    }


    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        let {isSelType}=this.state;
        let {numFlight,isNoCanDel,callBack,callBackParam}=this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');


        const formItems = keys.map((k, index) => {
            return (<div key={k}>
                    {isSelType==3?<div style={{
                        marginLeft:"11px",
                        marginBottom:"2px",
                        color:"#29A6FF",
                        fontSize:"13px"
                    }}>{"行程 "+(numFlight+1)}</div>:null}

                    <div className={css.cell}>
                        <div className={css.cellTitle}>
                            <FormItem
                                {...formItemLayout}>
                                {getFieldDecorator('depCity', {
                                    initialValue: "",
                                    rules: [{
                                        required: true,
                                        message: "请输入出发城市",
                                    },{
                                        pattern: /^[a-zA-Z\u4e00-\u9fa5]{2,20}$/,
                                        message: '输入汉字与英文长度2-20'
                                    }]
                                })
                                (<div >
                                        <div className={css.title}>出发城市:</div>
                                        <Input placeholder="上海" style={{minWidth:"200px", width: '100%'}} />
                                    </div>
                                )}
                            </FormItem>
                        </div>

                        <div className={css.refCellTitle}>
                            <FormItem
                                {...formItemLayout}>
                                {getFieldDecorator('arrCity', {
                                    initialValue: "",
                                    rules: [{
                                        required: true,
                                        message: "请输入到达城市",
                                    },{
                                        pattern: /^[a-zA-Z\u4e00-\u9fa5]{2,20}$/,
                                        message: '输入汉字与英文长度2-20'
                                    }]
                                })
                                (<div >
                                        <div className={css.title}>到达城市:</div>
                                        <Input placeholder="大阪" style={{minWidth:"200px", width: '100%'}} />
                                    </div>
                                )}
                            </FormItem>
                        </div>
                    </div>


                    <div className={css.cell}>
                        <div className={css.cellTitle}>
                            <FormItem
                                {...formItemLayout}>
                                {getFieldDecorator('depDate', {
                                    initialValue: "",
                                    rules: [{
                                        required: true,
                                        message: "请选择出发日期",
                                    },{
                                        pattern: /^[a-zA-Z\u4e00-\u9fa5]{2,20}$/,
                                        message: '输入汉字与英文长度2-20'
                                    }]
                                })
                                (<div >
                                        <div className={css.title}>出发日期:</div>
                                        <DatePicker
                                            style={{minWidth:"200px", width: '100%'}}
                                            defaultValue={moment(this.limitDate, dateFormat)}
                                            format='YYYY-MM-DD'
                                            id="CounterTime"
                                            // onChange={this.onChange4Date.bind(this)}
                                            // disabledDate={this.disabledDate}
                                        />
                                    </div>
                                )}
                            </FormItem>
                        </div>

                        <div className={css.refCellTitle}>
                            {(isSelType==2)?(<FormItem
                                {...formItemLayout}>
                                {getFieldDecorator('arrDate', {
                                    initialValue: "",
                                    rules: [{
                                        required: true,
                                        message: "请选择返回日期",
                                    },{
                                        pattern: /^[a-zA-Z\u4e00-\u9fa5]{2,20}$/,
                                        message: '输入汉字与英文长度2-20'
                                    }]
                                })
                                (<div >
                                        <div className={css.title}>返回日期:</div>
                                        <DatePicker
                                            style={{minWidth:"200px", width: '100%'}}
                                            defaultValue={moment(this.limitDate, dateFormat)}
                                            format='YYYY-MM-DD'
                                            id="CounterTime"
                                            // onChange={this.onChange4Date.bind(this)}
                                            // disabledDate={this.disabledDate}
                                        />
                                    </div>
                                )}
                            </FormItem>):(isSelType>=3?<div className={isNoCanDel?css.refDeleBtn:css.deleBtn} onClick={()=>{
                                if (!isNoCanDel&&callBack){
                                    callBack();
                                }
                            }}>{isSelType>=3?"删除":""}
                            </div>:null)}
                        </div>
                    </div>
                    <div className={css.myLine}></div>
                </div>
            );
        });
        return (
            <Form onSubmit={(e)=>{
                this.handleSubmit(e,callBackParam);
            }}>
                {formItems}
                {/*<FormItem {...formItemLayoutWithOutLabel}>*/}
                {/*<Button type="dashed" onClick={()=>{*/}
                {/*this.add();*/}
                {/*}} style={{ width: '60%' }}>*/}
                {/*<Icon type="plus" /> Add field*/}
                {/*</Button>*/}
                {/*</FormItem>*/}
                <FormItem {...formItemLayoutWithOutLabel}>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </FormItem>
            </Form>
        );
    }

    // render(){
    //     let {isSelType}=this.state;
    //     let {isNoCanDel,callBack}=this.props;
    //
    //     return (<div>
    //         <div className={css.refCell}>
    //             <div className={css.cellTitle}>出发城市:</div>
    //             <div className={css.space}></div>
    //             <div className={css.cellTitle}>目的城市:</div>
    //         </div>
    //         <div className={css.cell}>
    //             <input className={css.cellInput} defaultValue={"上海"}/>
    //             <div className={css.space}></div>
    //             <input className={css.cellInput} defaultValue={"大阪"}/>
    //         </div>
    //
    //         <div className={css.refCell}>
    //             <div className={css.cellTitle}>出发日期:</div>
    //             <div className={css.space}></div>
    //             {(isSelType==2)?(<div className={css.cellTitle}>返回日期:</div>):null}
    //         </div>
    //         <div className={css.cell}>
    //             <MyDatePick className={css.cellTitle} style={{textAlign:"center"}}
    //                         beforeCur={this.limitDate}
    //                         callBack={(YMD)=>{
    //                             this.setState({
    //                                 right_LimitDate:YMD,
    //                                 right_MyDate:YMD
    //                             });
    //                         }}
    //             />
    //             <div className={css.space}></div>
    //             {(isSelType==2)?
    //                 (<MyDatePick className={css.cellTitle} style={{textAlign:"center"}}
    //                     beforeCur={this.state.right_LimitDate}
    //                     myDate={this.state.right_MyDate}
    //                     callBack={(YMD)=>{
    //                         alert(YMD);
    //                     }}/>):<div className={css.spaceDatePick}>
    //                     {isSelType>=3?<div className={isNoCanDel?css.refDeleBtn:css.deleBtn} onClick={()=>{
    //                         if (!isNoCanDel&&callBack){
    //                             callBack();
    //                         }
    //                     }}>{isSelType>=3?"删除":""}
    //                     </div>:null}
    //                 </div>}
    //         </div>
    //         <div className={css.myLine}></div>
    //
    //
    //         <Button type="primary"
    //                 style={{float:"right",height:"32",letterSpacing:"1px",fontSize:"13px",borderRadius:"2px"}}
    //                 onClick={()=>{
    //                     alert("提交需求");
    //                 }}>提交需求</Button>
    //     </div>);
    // }
}
const AddFlightLine = Form.create()(FlightLine);
FlightLine.contextTypes = {
    router: React.PropTypes.object
};
module.exports = AddFlightLine;