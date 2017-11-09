/**
 * Created by apin on 2017/10/25.
 */
/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import {Tooltip,message,Form,Input,Icon} from 'antd';
import css from './FlightDetail.less';
import { HttpTool } from '../../../../../lib/utils/index.js';
import APIGYW from "../../../../api/APIGYW.js";
import LoadingView from "../../component/LoadingView.js";
import CellNewFlight from "../cell/CellNewFlight.js";
import PayBottom from "./detailComp/PayBottom.js";
import MyModalRequire from "./detailComp/MyModalRequire.js";

import MyInput from '../../component/MyInput.js';

const FormItem = Form.Item;
class page extends Component {
    constructor(props) {
        super(props);
        let par = window.app_getPar(this);
        this.param = par.data?par.data:{};
        this.isPay = this.param&&this.param.isDirect&&this.param.isDirect?this.param.isDirect:0;

        this.adultPrice = "";
        this.childPrice = "";
        this.state = {
            upData:0,
            adultNum:1,
            childNum:0,
            phone:""
        };

        //用来显示库存超出的时候 弹出module框添加已知数据
        this.requireParam = {
            lineType:2,
            lineNum:1,
            adultCount:"0",
            childCount:"0",
            remark:"",
            phone:"",
            listData:[{}]};
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
        var param = this.param;
        this.loadingView.refreshView(true);
        var success = (code, msg, json, option) => {
            this.loadingView.refreshView(false,()=>{
                this.setData(json);
            });
        };
        var failure = (code, msg, option) => {
            message.warning(msg);
            this.loadingView.refreshView(false);
        };
        HttpTool.request(HttpTool.typeEnum.POST, APIGYW.flightapi_orderDetail_query, success, failure, param,
            {ipKey:'hlIP'});
    }
    setData(json){
        this.data = json;
        this.adultPrice = json&&json.adultPrice?parseInt(json.adultPrice):0;
        this.childPrice = json&&json.childPrice?parseInt(json.childPrice):0;
        this.upView();
    }

    /**
     * 点击底部支付界面
     */
    payAction(){
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form------------------: ', values);
                var param = values;
                let json = this.param?this.param:{};
                for(var i in json){
                    param[i] = json[i];
                }
                let voyage = this.data&&this.data.plans?this.data.plans:{};
                if (voyage.flightType){
                    param.flightType = voyage.flightType;
                }

                this.loadingView.refreshView(true);
                var success = (code, msg, json, option) => {
                    this.loadingView.refreshView(false,()=>{
                        this.skipView(code);
                    });
                };
                var failure = (code, msg, option) => {
                    this.loadingView.refreshView(false);
                    message.warning(msg);
                };
                // HttpTool.request(HttpTool.typeEnum.POST, APIGYW.orderapi_orders_create, success, failure, param, {ipKey:'hlIP'});

                this.loadingView.refreshView(false,()=>{
                    this.skipView(3);
                });
            }
        });
    }
    /**
     * code:    1 跳转订单页 只传订单id
     *          2 跳转支付页 只传订单id
     *          3 弹出发布需求窗并跳转需求详情页
     */
    skipView(code){
        if (code==1){
            window.app_open(this.props.obj, "/OrderFormDetail", {
                data:{
                    id:""
                }
            },"new");
        }else if (code==2){
            window.app_open(this.props.obj, "/Pay", {
                data:{
                    id:""
                }
            },"new");
        }else {
            this.myModalRequire.showModal(true,
                {
                    title:"提示",
                    desc:"您下单的人数已超过库存余位,是否提交至客服处理?",
                    param:this.requireParam,
                });
        }
    }
    /**
     * 点击发布需求回调函数  传参
     */
    commit(value){
        var param = value;
        this.loadingView.refreshView(true);

        var success = (code, msg, json, option) => {
            this.myModalRequire.hiddenModal(()=>{
                this.loadingView.refreshView(false);
                window.app_open(this, "/DemandDetail", {
                    data: {id:""}
                }, "new");
            });
        };
        var failure = (code, msg, option) => {
            message.warning(msg);
            this.loadingView.refreshView(false);
        };
        // HttpTool.request(HttpTool.typeEnum.POST, APIGYW.demandapi_demands, success, failure, param,{ipKey:'hlIP'});

        window.app_open(this, "/DemandDetail", {
            data: {
                id:""
            }
        }, "new");
    }

    render() {
        let {childNum,adultNum}=this.state;
        let totolNum = parseInt(childNum?childNum:0)+parseInt(adultNum?adultNum:0);

        let totalPrice = this.childPrice*childNum+this.adultPrice*adultNum;
        const { getFieldDecorator } = this.props.form;
        let div = (
            <div className={css.main}>
                {this.data?<div className={css.refContent}>
                    <div className={css.table}>
                        <div className={css.line_bg}>
                            <div className={css.line}></div>
                        </div>
                        <div className={css.title}>航班信息</div>
                    </div>
                    {this.createList(this.data&&this.data.plans)}
                </div>:null}


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
                                            message: '人数不能为空',
                                        },{
                                            pattern: /^\+?[1-9]\d*$/,
                                            message: '人数必须大于0',
                                        }],
                                        initialValue: adultNum,
                                    })(<Input style={{width:"110px",height:"35px"}}
                                              placeholder={"人数"}
                                              addonBefore={<Icon type="minus"
                                                                 style={{cursor: "pointer",color:"#FF6600"}}
                                                                 onClick={()=>{
                                                                     this.addAction(true,false);
                                                                 }}/>}
                                              addonAfter={<Icon type="plus"
                                                                style={{cursor: "pointer",color:"#FF6600"}}
                                                                onClick={()=>{
                                                                    this.addAction(true,true);
                                                                }}/>}
                                              onChange={(e)=>{
                                                  let value = e.target.value;
                                                  this.onChangeNumVal(true,value);
                                              }}/>)}
                                </FormItem>
                                <div className={css.i_subtitle}>{this.adultPrice}</div>
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
                                                                  style={{cursor: "pointer",color:"#FF6600",}}
                                                                  onClick={()=>{
                                                                      this.addAction(false,false);
                                                                  }}/>}
                                               addonAfter={<Icon type="plus"
                                                                 style={{cursor: "pointer",color:"#FF6600"}}
                                                                 onClick={()=>{
                                                                     this.addAction(false,true);
                                                                 }}/>}
                                               onChange={(e)=>{
                                                   let value = e.target.value;
                                                   this.onChangeNumVal(false,value);
                                               }}/>
                                    )}
                                </FormItem>
                                <div className={css.i_subtitle}>{this.childPrice}</div>
                            </div>
                        </div>
                        <div className={css.refOrderCellItem}>
                            <div className={css.perTotal}>
                                <span>{"总人数: "}</span>
                                <span style={{color:"#29A6FF"}}>{totolNum}</span>
                            </div>
                            <div className={css.priceText}>
                                <span>{"参考价（含税）"}</span>
                                <span className={css.priceTextColor}>{"¥"}</span>
                                <span className={css.priceTextFont}>{totalPrice}</span>
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
                                    <Input style={{width:"220px"}}
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

                <PayBottom
                    param={{
                        orderPrice:"2333",
                        adultPrice:this.adultPrice,
                        childPrice:this.childPrice,
                        childNum:childNum,
                        adultNum:adultNum,
                        totalPrice:totalPrice,
                    }} isPay={this.isPay==1?true:false}
                    callBack={()=>{
                        this.payAction();
                    }}/>

                <MyModalRequire ref={(a) => this.myModalRequire = a}
                                callBack={(value)=>{
                                    this.commit(value);
                                }}/>
                <LoadingView ref={(a)=>this.loadingView = a}/>
            </div>);
        return div;
    }

    createList(voyagesObj){
        let itemDiv = (
            <div className={css.tableCell}>
                <div className={css.left}>
                    <CellNewFlight dataSource = {voyagesObj} flightType={voyagesObj.flightType?voyagesObj.flightType:1} isNoShowRule={true}/>
                </div>

                <div className={css.right}>
                    <div className={css.itemCenter} style={{width:"100%"}}>
                        <div className={css.ruleDiv}>
                            <Tooltip placement="bottom" title={<div>
                                <div className={css.rule}>
                                    {"免费托运: "+voyagesObj.freeBag+"件"}
                                </div>
                                <div className={css.rule}>
                                    {"每件重量上限: "}
                                    <span style={{color:"#ff6600",fontSize:"14px"}}>{voyagesObj.weightLimit+"kg"}</span>
                                </div>
                            </div>}>行李规则
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>);
        return itemDiv;
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
    onChangeNumVal(isAdult,value){
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
                    childNum:"",
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
}
const FlightDetail = Form.create()(page);
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = FlightDetail;