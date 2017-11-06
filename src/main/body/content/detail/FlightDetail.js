/**
 * Created by apin on 2017/10/25.
 */
/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import {message,Button,Form,Input,Icon} from 'antd';
import css from './FlightDetail.less';
import { HttpTool } from '../../../../../lib/utils/index.js';
import APIGYW from "../../../../api/APIGYW.js";
import LoadingView from "../../component/LoadingView.js";
import StateProgress from "./detailComp/StateProgress.js";
import CellFlight from "../cell/CellFlight.js";
import CellNewFlight from "../cell/CellNewFlight.js";
import PayBottom from "./detailComp/PayBottom.js";
import MyModalRequire from "./detailComp/MyModalRequire.js";

import MyInput from '../../component/MyInput.js';

const FormItem = Form.Item;
class page extends Component {
    constructor(props) {
        super(props);
        this.par = window.app_getPar(this);

        this.state = {
            upData:0,
            adultNum:1,
            childNum:0,
            phone:""
        };
    }
    componentWillReceiveProps(nextProps) {

    }

    upView(){
        this.setState({
            upData:this.state.upData++
        });
    }

    componentDidMount() {
        this.loadData();
    }
    loadData() {
        var param = {};
        // this.loadingView.refreshView(true);
        var success = (code, msg, json, option) => {

        };
        var failure = (code, msg, option) => {
            message.warning(msg);
            // this.loadingView.refreshView(false);
        };
        // HttpTool.request(HttpTool.typeEnum.POST,
        //     APIGYW.flightapi_flightDetail_month_query,
        //     success,
        //     failure,
        //     param,
        //     {ipKey:'hlIP'});

        let dataArr = this.par.data&&this.par.data.airlineInfo?this.par.data.airlineInfo:{};
        let itemData = dataArr;


        let go = itemData[0];
        let back = itemData[1];

        let zhongZhuanObj=[{
            flightType:true,
            obj:go
        },{
            flightType:true,
            obj:go
        },{
            flightType:false,
            obj:back
        }];

        let flightTypeGo = [{
            flightType:true,
            obj:go,
            data:zhongZhuanObj
        }];

        let flightTypeGoAndBack = [{
            flightType:true,
            obj:go,
            data:zhongZhuanObj
        },{
            flightType:false,
            obj: back,
            data:zhongZhuanObj
        }];

        let moreFlightObj = [{
            numFlight:"一",
            obj:go,
        },{
            numFlight:"二",
            obj:go,
        },{
            numFlight:"三",
            obj: back,
        }];

        this.listData = [{
            rule:"1.行李规则行李规则行李规则行李规则行李",
            obj:flightTypeGo,
            flightType:1
        },{
            rule:"2.行李规则行李规则行李规则行李规则行李",
            obj:flightTypeGoAndBack,
            flightType:2
        },{
            rule:"3.行李规则行李规则行李规则行李规则行李",
            obj:moreFlightObj,
            flightType:3
        }];
        this.upView();
    }

    addAction(isAdult,isAdd){
        let {adultNum,childNum} = this.state;
        if (!adultNum){
            adultNum = 0;
        }
        if (!childNum){
            childNum = 0;
        }
        let num_Int = parseInt(isAdult?adultNum:childNum);
        if (isAdd){
            num_Int++;
        }else {
            num_Int--;
        }
        num_Int = num_Int<=0?"0":num_Int;
        if (isAdult){
            this.setState({
                adultNum:num_Int
            },()=>{
                this.setAdultNum(num_Int);
            });
        }else {
            this.setState({
                childNum:num_Int
            },()=>{
                this.setChildNum(num_Int);
            });
        }
    }

    verPhone(value){
        if (value && (value!="")&& /^[0-9]*$/.test(value)){
            this.setState({
                phone:value
            },()=>{
                this.props.form.setFieldsValue({
                    phone:value
                });
            });
        }else {
            this.setState({
                phone:""
            },()=>{
                this.props.form.setFieldsValue({
                    phone:""
                });
            });
        }
    }
    recycleNum(isAdult,value){
        if (value && (value!="")&& /^[0-9]*$/.test(value)){
            if (isAdult){
                let num = parseInt(value);
                this.setState({
                    adultNum:num,
                },()=>{
                    this.setAdultNum(num);
                });
            }else {
                let num = parseInt(value);
                this.setState({
                    childNum:num,
                },()=>{
                    this.setChildNum(num);
                });
            }
        }else {
            if (isAdult){
                this.setState({
                    adultNum:"",
                },()=>{
                    this.setAdultNum("");
                });
            }else {
                this.setState({
                    childNum:"0",
                },()=>{
                    this.setChildNum("");
                });
            }
        }
    }
    setAdultNum(value){
        this.props.form.setFieldsValue({
            adultNum:value
        });
    }
    setChildNum(value){
        this.props.form.setFieldsValue({
            childNum:value
        });
    }
    render() {
        let {childNum,adultNum}=this.state;
        this.totolNum = parseInt(childNum?childNum:0)+parseInt(adultNum?adultNum:0);
        this.totalPrice = 2300*childNum+2333*adultNum;
        const { getFieldDecorator } = this.props.form;
        let div = (
            <div className={css.main}>
                <div className={css.content} style={{paddingLeft:"100px",paddingRight:"100px"}}>
                    <StateProgress num = {1}/>
                </div>

                <div className={css.refContent}>
                    <div className={css.table}>
                        <div className={css.line_bg}>
                            <div className={css.line}></div>
                        </div>
                        <div className={css.title}>航班信息</div>
                    </div>
                    {this.createList(this.listData)}
                </div>

                <div className={css.title}>订单信息</div>
                <div className={css.content} style={{marginBottom:"0px",borderWidth:"0px"}}>
                    <div className={css.cell}>
                        <div className={css.cell_left}>1</div>
                        <div className={css.cell_right}>确认乘机人数</div>
                    </div>
                    <div className={css.table}>
                        <div className={css.orderCellItem}>
                            <div className={css.i_cell}>
                                <div className={css.i_title}>{"成人(12岁以上):"}</div>
                                <FormItem style={{float:"left"}}>
                                    {getFieldDecorator('adultNum', {
                                        rules: [{
                                            required: true,
                                            message: '人数必须大于0',
                                        }],
                                        initialValue: adultNum,
                                    })(<Input style={{width:"110px",height:"35px"}}
                                              placeholder={"人数"}
                                              addonBefore={<Icon type="minus"
                                                                 style={{color:"#FF6600"}}
                                                                 onClick={()=>{
                                                                     this.addAction(true,false);
                                                                 }}/>}
                                              addonAfter={<Icon type="plus"
                                                                style={{color:"#FF6600"}}
                                                                onClick={()=>{
                                                                    this.addAction(true,true);
                                                                }}/>}
                                              onChange={(e)=>{
                                                  let value = e.target.value;
                                                  this.recycleNum(true,value);
                                              }}/>)}
                                </FormItem>
                                <div className={css.i_subtitle}>{"¥2333"}</div>
                            </div>


                            <div className={css.i_cell}>
                                <div className={css.i_title}>{"儿童(2-12岁):"}</div>
                                <FormItem style={{float:"left"}}>
                                    {getFieldDecorator('childNum', {
                                        rules: [{
                                            required: false,
                                            message: '人数必须大于0',
                                        }],
                                        initialValue: childNum
                                    })(
                                        <Input style={{width:"110px"}}
                                               placeholder={"人数"}
                                               addonBefore={<Icon type="minus"
                                                                  style={{color:"#FF6600",}}
                                                                  onClick={()=>{
                                                                      this.addAction(false,false);
                                                                  }}/>}
                                               addonAfter={<Icon type="plus"
                                                                 style={{color:"#FF6600"}}
                                                                 onClick={()=>{
                                                                     this.addAction(false,true);
                                                                 }}/>}
                                               onChange={(e)=>{
                                                   let value = e.target.value;
                                                   this.recycleNum(false,value);
                                               }}/>
                                    )}
                                </FormItem>
                                <div className={css.i_subtitle}>{"¥2300"}</div>
                            </div>
                        </div>
                        <div className={css.refOrderCellItem}>
                            <div className={css.perTotal}>
                                <span>{"总人数: "}</span>
                                <span style={{color:"#29A6FF"}}>{this.totolNum}</span>
                            </div>
                            <div className={css.priceText}>
                                <span>{"参考价（含税）"}</span>
                                <span className={css.priceTextColor}>{"¥"}</span>
                                <span className={css.priceTextFont}>{this.totalPrice}</span>
                            </div>
                        </div>
                    </div>


                    <div className={css.cell}>
                        <div className={css.cell_left}>2</div>
                        <div className={css.cell_right} >填写联系人信息</div>
                    </div>
                    <div className={css.orderCellItem}>
                        <div className={css.i_cell}>
                            <div className={css.i_title}>{"姓名:"}</div>
                            <FormItem style={{float:"left"}}>
                                {getFieldDecorator('name', {
                                    rules: [{
                                        max:20,
                                        required: true,
                                        message: '姓名不能为空',
                                    },{
                                        pattern: /^[a-zA-Z\u4e00-\u9fa5]{2,20}$/,
                                        message: '输入汉字与英文长度2-20'
                                    }],
                                })(<Input style={{width:"220px"}}
                                          placeholder={"请输入姓名"}/>)
                                }
                            </FormItem>
                        </div>


                        <div className={css.i_cell}>
                            <div className={css.i_title}>{"手机号码:"}</div>
                            <FormItem style={{float:"left"}}>
                                {getFieldDecorator('phone', {
                                    rules: [{
                                        required: true,
                                        message: '手机号不能为空',
                                    },{
                                        pattern: /^1[3|5|7|8|][0-9]{9}$/,
                                        message: '请输入正确的11位手机号码'
                                    }],
                                })(
                                    <Input max={11} style={{width:"220px"}}
                                           placeholder={"请输入手机号"}
                                           onChange={(e)=>{
                                               let val = e.target.value;
                                               this.verPhone(val);
                                           }}/>
                                )}
                            </FormItem>
                        </div>
                    </div>
                </div>

                <PayBottom param={{
                    orderPrice:"2333",
                    adultPrice:"2333",
                    childPrice:"2000",
                    childNum:childNum,
                    adultNum:adultNum,
                    totalPrice:this.totalPrice,
                }}
                           isPay={true}
                           callBack={()=>{
                               this.props.form.validateFields((err, values) => {
                                   if (!err) {
                                       console.log('Received values of form: ', values);
                                   }
                               });

                               // this.myModalRequire.showModal(true,
                               //     {
                               //         title:"提示",
                               //         desc:"您下单的人数已超过库存余位,是否提交至客服处理?"
                               //     });
                           }}/>

                <MyModalRequire ref={(a) => this.myModalRequire = a}
                                callBack={(myNum)=>{
                                    // this.commitSit(myNum);
                                }}/>
            </div>);
        return div;
    }

    createList(dataArr){
        if (!dataArr||dataArr.length<1){
            return null;
        }
        var viewArr = [];
        for (let i=0;i<dataArr.length;i++){
            let itemData = dataArr[i];
            let itemDiv = (
                <div key={i} className={css.flightLineCell}>
                    <div className={css.schemeDiv}>{"方案 "+(i+1)}</div>
                    <div className={css.sign}>直营</div>

                    <div className={css.tableCell}>
                        <div className={css.left}>
                            <CellNewFlight dataSource = {itemData}/>
                        </div>

                        <div className={css.right}>
                            <div className={css.table}>
                                <div className={css.itemCenter} style={{width:"52%"}}>
                                    <div className={css.priceText}>{"含税价"}</div>
                                    <div className={css.priceText}>
                                        <span className={css.priceTextColor}>{"¥ "}</span>
                                        <span className={css.priceTextFont}>{itemData.basePrice||"0"}</span>
                                        <span >{" 起"}</span>
                                    </div>
                                </div>
                                <div className={css.itemCenter} style={{width:"48%"}}>
                                    <div className={css.btn} style={{cursor: 'pointer'}}
                                         onClick={() => {
                                             alert("确定航班");
                                         }}>{"确定此航班"}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>);
            viewArr.push(itemDiv);
        }
        return viewArr;
    }
}
const FlightDetail = Form.create()(page);
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = FlightDetail;