/**
 * Created by apin on 2017/10/25.
 */
/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import {message,Button,Form,Input} from 'antd';
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
            totalNum:1,
            upData:0
        };
        this.adultNum = 1;
        this.childNum = 0;
        this.phoneNum = "";
    }
    componentWillReceiveProps(nextProps) {

    }

    upView(){
        this.setState({
            upData:this.state.upData++
        });
    }
    setTotal(totalNum){
        this.setState({
            totalNum:totalNum
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
        // this.cellFlight.refreshView(this.par.data,2,true,true);

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

    render() {
        this.totalPrice = 2300*this.childNum+2333*this.adultNum;
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
                                <div className={css.i_inputCell}>
                                    <div style={{float:"left"}}>
                                        <div className={css.i_addItem}
                                             onClick={()=>{
                                                 // this.addAction(false);
                                             }}
                                        >{"-"}</div>
                                    </div>

                                    <FormItem style={{float:"left"}}>
                                        {getFieldDecorator('adultNum', {
                                            rules: [{
                                                required: true,
                                                message: '人数必须大于0',
                                            }],
                                            initialValue: this.state.adultNum
                                        })(
                                            <Input value={this.state.myNum}
                                                   style={{float:"left",width:"80px",height:"25px"}}
                                                   onChange={(e)=>{
                                                       let value = e.target.value;
                                                       this.setState({
                                                           myNum:value,
                                                       },()=>{

                                                       });
                                                   }}/>
                                        )}
                                    </FormItem>


                                    <div style={{float:"left"}}>
                                        <div className={css.i_addItem}
                                             onClick={()=>{
                                                 // this.addAction(true);
                                             }}
                                        >{"+"}</div>
                                    </div>
                                </div>
                                <div className={css.i_subtitle}>{"2333"}</div>
                            </div>





                            <MyInput
                                ref="adult"
                                maxLength={4}
                                className={css.orderInforInput}
                                value={this.adultNum}
                                obj = {{
                                    title:"成人(12岁以上):",
                                    subtitle:"¥2333",
                                    isAddOrSub:true,
                                }}
                                callBack={(val)=>{
                                    this.adultNum = val?val:"";
                                    let totalNum = parseInt(this.adultNum?this.adultNum:0)+parseInt(this.childNum?this.childNum:0);
                                    this.setTotal(totalNum);
                                }}/>

                            <MyInput
                                ref="child"
                                maxLength={4}
                                className={css.orderInforInput}
                                value={this.childNum}
                                obj = {{
                                    title:"儿童(2-12岁):",
                                    subtitle:"¥2300",
                                    isAddOrSub:true,
                                }}
                                callBack={(val)=>{
                                    this.childNum = val?val:"";
                                    let totalNum = parseInt(this.adultNum?this.adultNum:0)+parseInt(this.childNum?this.childNum:0);
                                    this.setTotal(totalNum);
                                }}/>
                        </div>
                        <div className={css.refOrderCellItem}>
                            <div className={css.perTotal}>
                                <span>{"总人数: "}</span>
                                <span style={{color:"#29A6FF"}}>{this.state.totalNum}</span>
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
                        <MyInput ref="name"
                                 placeholder={"请输入姓名"}
                                 obj = {{
                                     title:"姓名:",
                                     isRandom:true,
                                 }}
                                 maxLength={12}
                                 className={css.perInfor}
                                 value={this.name}
                                 callBack={(val)=>{
                                     this.name = val;
                                 }}/>
                        <MyInput ref="phone"
                                 placeholder={"请输入可联系的手机号码"}
                                 obj = {{
                                     title:"手机号码:",
                                     regular:/^1\d{10}$/
                                 }}
                                 maxLength={11}
                                 className={css.perInfor}
                                 value={this.phoneNum}
                                 callBack={(val)=>{
                                     this.phoneNum = val;
                                 }}/>
                    </div>
                </div>

                <div className={css.content} style={{padding: "0px",backgroundColor:"#EFF7FD",paddingTop:"8px",paddingBottom:"8px"}}>
                    <div className={css.orderCell} style={{padding: "0px"}}>
                        <div className={css.orderInforTitle} style={{paddingRight: "30px"}}>{"直营余票: "+1200}</div>
                        <div className={css.orderInforTitle} style={{textAlign:"left",paddingLeft: "30px",}}>{"代售余票: "+33}</div>
                    </div>
                </div>

                <PayBottom
                    param={{
                        orderPrice:"2333",
                        adultPrice:"2333",
                        childPrice:"2000",
                        childNum:this.childNum,
                        adultNum:this.adultNum,
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