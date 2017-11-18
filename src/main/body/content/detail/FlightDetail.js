/**
 * Created by apin on 2017/10/25.
 */
/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
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
            shouldFixed:true,  //底部支付条是否应该固定定位
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
        //启动页面滚动监听
        setTimeout(()=>{this.listenScroll();},0);
    }

    listenScroll(){
        let markDiv = document.getElementById('markDiv');
        let rootDiv = document.getElementById('root');
        // console.warn('启动监听---------------------');
        // log(markDiv);

        //支付条定位初始化  如果文档高度小于屏幕高度，则不固定定位
        if(parseInt(window.getComputedStyle(rootDiv,'').height)<parseInt(document.body.clientHeight)){
            this.setState({
                shouldFixed:false,
            });
        }
        //监听页面滚动
        window.onscroll = ()=>{
            markDiv = markDiv?markDiv:document.getElementById('markDiv');
            rootDiv = rootDiv?rootDiv:document.getElementById('root');
            //根元素的整个高度   （不是body）
            let rootDivHeight = parseInt(window.getComputedStyle(rootDiv,'').height);
            //标记div顶端 到 body顶端 的距离（body顶端 与root元素顶端位置相同）
            let markDivTop = parseInt(markDiv.offsetTop);
            //浏览器窗口可视高度
            let windowHeight = parseInt(document.body.clientHeight);
            //支付条自身的高度+固定定位的bottom值
            let payDiv = ReactDOM.findDOMNode(this.payBottom);
            let payDivHeight =
                parseInt(window.getComputedStyle(payDiv,'').height)
                +
                parseInt(window.getComputedStyle(payDiv,'').bottom);
            //支付条顶部到浏览器窗口顶部到高度
            let payTop = windowHeight - payDivHeight;
            //定位样式改变的临界滚动值
            let changeDistance = markDivTop - payTop;
            //网页滚动的距离
            let scrollDistance = parseInt(window.scrollY);
            //差值
            let distance = changeDistance-scrollDistance;
            log(distance);
            if(distance>0){
                this.setState({
                    shouldFixed:(distance>0),
                });
            }else{
                if(this.state.shouldFixed){
                    this.setState({
                        shouldFixed:(distance>0),
                    });
                }else{
                    this.setState({
                        shouldFixed:(distance>=-29),
                    });
                }
            }
        };
    }

    /**
     * 进入界面 初次请求数据
     */
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
        HttpTool.request(HttpTool.typeEnum.POST, APIGYW.flightapi_orderDetail_query, success, failure, param,);
    }

    /**
     *  请求接口后初始化数据
     */
    setData(json){
        this.data = json;
        this.adultPrice = json&&json.adultPrice?json.adultPrice:0;
        this.childPrice = json&&json.childPrice?json.childPrice:0;
        this.depositAmount = json&&json.depositAmount?json.depositAmount:0;
        // this.adultPrice =Math.round(parseFloat(adultPrice)*100)/100;
        // this.childPrice=Math.round(parseFloat(childPrice)*100)/100;
        // this.depositAmount = Math.round(parseFloat(depositAmount)*100)/100;


        this.cityArr = json&&json.cityArr?json.cityArr:"";
        this.cityDep = json&&json.cityDep?json.cityDep:"";
        let voyage = json&&json.plans?json.plans:{};
        this.flightType = voyage.flightType;

        let member = json.member?json.member:{};
        this.props.form.setFieldsValue({
            mobile:member.contactPhone?member.contactPhone:""
        });
        this.props.form.setFieldsValue({
            customerName:member.contactName?member.contactName:""
        });
        this.upView();
    }

    /**
     * 点击底部支付界面
     */
    payAction(){
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var param = values;
                let jsonParam = this.param?this.param:{};
                param.source = "Web";
                for(var i in jsonParam){
                    param[i] = jsonParam[i];
                }
                this.loadingView.refreshView(true);
                var success = (code, msg, json, option) => {
                    this.loadingView.refreshView(false,()=>{
                        if (json){
                            this.skipView(json);
                        }else {
                            message(msg);
                        }
                    });
                };
                var failure = (code, msg, option) => {
                    this.loadingView.refreshView(false);
                    message.warning(msg);
                };
                HttpTool.request(HttpTool.typeEnum.POST, APIGYW.orderapi_orders_create, success, failure, param);
            }
        });
    }
    /**
     * json {
     *          id:
     *          code:
     *    }    code  1 跳转订单页 只传订单id
     *               2 跳转支付页 只传订单id
     *               3 弹出发布需求窗并跳转需求详情页
     */
    skipView(json){
        let code = json.flag?json.flag:0;
        let id = json.id?json.id:"";
        if (code==1){
            window.app_open(this, "/OrderFormDetail", {id:id},"self");
        }else if (code==2){
            window.app_open(this, "/Pay", {id:id},"self");
        }else {
            //用来显示库存超出的时候 弹出module框添加已知数据
            this.requireParam = {
                lineType:this.flightType?this.flightType:1,
                lineNum:1,
                adultCount:this.state.adultNum,
                childCount:this.state.childNum,
                remark:"",
                isMult:this.flightType&&(this.flightType<3),
                listData:[{fromCity:this.cityArr,toCity:this.cityDep}]
            };
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
        param.source = "Web";
        this.loadingView.refreshView(true);
        let success = (code, msg, json, option) => {
            this.loadingView.refreshView(false,()=>{
                if (json&&json.id){
                    window.app_open(this, "/DemandDetail", {
                        data: {id:json.id}
                    }, "self");
                }
            });
        };
        let failure = (code, msg, option) => {
            message.error(msg);
            this.loadingView.refreshView(false);
        };
        HttpTool.request(HttpTool.typeEnum.POST, APIGYW.demandapi_demands, success, failure, param);
    }

    render() {
        let {childNum,adultNum}=this.state;
        let totolNum = childNum?childNum:0+adultNum?adultNum:0;

        let totalPrice = (this.childPrice*childNum*100+this.adultPrice*adultNum*100)/100;
        let depositAmount =(this.depositAmount*(childNum+adultNum)*100)/100;
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const adultCountError = getFieldError('adultCount');
        const childCountError = getFieldError('childCount');
        const mobileError = getFieldError('mobile');
        const customerNameError = getFieldError('customerName');
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
                <div className={css.content}
                     style={{marginBottom:"0px",borderWidth:"0px"}}>
                    <div className={css.cell}>
                        <div className={css.cell_left}>1</div>
                        <div className={css.cell_right}>确认乘机人数</div>
                    </div>
                    <div className={css.table}>
                        <div className={css.orderCellItem}>
                            <div className={css.i_cell}>
                                <div className={css.i_title}>{"成人(12岁以上):"}</div>
                                <FormItem prefixCls="my-ant-form"
                                          validateStatus={adultCountError ? 'error' : ''}
                                          help={adultCountError || ''}
                                          style={{float:"left"}}>
                                    {getFieldDecorator('adultCount', {
                                        rules: [{
                                            required: true,
                                            message: '人数不能为空',
                                        },{
                                            pattern: /^.{1,4}$/,
                                            message: '人数不能超过4位数',
                                        },{
                                            pattern: /^\+?[1-9]\d*$/,
                                            message: '人数必须大于0',

                                        }],
                                        initialValue: adultNum,
                                    })(<Input style={{width:"110px",height:"35px",textAlign:"center"}}
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
                                <div className={css.i_subtitle}>
                                    <span style={{fontSize:"12px"}}>{"¥"}</span>
                                    {this.adultPrice}
                                </div>
                            </div>


                            <div className={css.i_cell}>
                                <div className={css.i_title}>{"儿童(2-12岁):"}</div>
                                <FormItem
                                    validateStatus={childCountError ? 'error' : ''}
                                    help={childCountError || ''}
                                    prefixCls="my-ant-form" style={{float:"left"}}>
                                    {getFieldDecorator('childCount', {
                                        rules: [{
                                            required: false,
                                            message: '人数必须大于0',
                                        },{
                                            pattern: /^.{1,4}$/,
                                            message: '人数不能超过4位数',
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
                                <div className={css.i_subtitle}>
                                    <span style={{fontSize:"12px"}}>{"¥"}</span>
                                    {this.childPrice}
                                </div>
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
                            <FormItem prefixCls="my-ant-form"
                                      validateStatus={customerNameError ? 'error' : ''}
                                      help={customerNameError || ''}
                                      style={{float:"left"}}>
                                {getFieldDecorator('customerName', {
                                    rules: [{
                                        required: true,
                                        message: '姓名不能为空',
                                    },{
                                        pattern: /^[\u4e00-\u9fa5]{2,6}$|^[a-zA-Z]{2,12}$/,
                                        message: '请输入姓名(汉字2-6个字或英文2-12个字符)'
                                    }],
                                })(<Input style={{width:"220px"}}
                                          maxLength="20"
                                          placeholder={"请输入姓名"}/>)
                                }
                            </FormItem>
                        </div>


                        <div className={css.i_cell}>
                            <div className={css.i_title}>{"手机号码:"}</div>
                            <FormItem prefixCls="my-ant-form"
                                      validateStatus={mobileError ? 'error' : ''}
                                      help={mobileError || ''}
                                      style={{float:"left"}}>
                                {getFieldDecorator('mobile', {
                                    rules: [{
                                        required: true,
                                        message: '手机号不能为空',
                                    },{
                                        pattern: /^1\d{10}$/,
                                        message: '请输入正确的11位手机号码'
                                    }],
                                })(
                                    <Input style={{width:"220px"}}
                                           placeholder={"请输入手机号"}
                                           maxLength="11"/>
                                )}
                            </FormItem>
                        </div>
                    </div>
                </div>

                <div id={'markDiv'} ></div>
                <PayBottom
                    shouldFixed={this.state.shouldFixed}
                    ref={(payBottom)=>{this.payBottom = payBottom;}}
                    param={{
                        orderPrice:depositAmount,
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
                                {voyagesObj.freeBag?<div className={css.rule}>
                                    {"免费托运: "+voyagesObj.freeBag+"件"}
                                </div>:null}

                                {voyagesObj.weightLimit?<div className={css.rule}>
                                    {"每件重量上限: "}
                                    <span style={{color:"#ff6600",fontSize:"14px"}}>{voyagesObj.weightLimit+"kg"}</span>
                                </div>:null}

                                {!voyagesObj.weightLimit&&!voyagesObj.freeBag?<div className={css.rule}>
                                    {"暂无行李规则"}
                                </div>:null}
                            </div>}>行李规则</Tooltip>
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

        let value = num_Int.toString();
        if (value.length>=5){
            num_Int = parseInt(isAdult?adultNum:childNum);
        }


        if (isAdult){
            num_Int = num_Int<=0?"1":num_Int;
            this.setState({
                adultNum:num_Int
            },()=>{
                this.setAdultNum(num_Int);
            });
        }else {
            num_Int = num_Int<=0?"0":num_Int;
            this.setState({
                childNum:num_Int
            },()=>{
                this.setChildNum(num_Int);
            });
        }
    }

    verPhone(value){
        if(value>=11){
            value = value.substring(0,11);
        }
        if (value && (value!="")&& /^[0-9]*$/.test(value)){
            this.props.form.setFieldsValue({
                mobile:value
            });
        }else {
            alert(1);
            this.props.form.setFieldsValue({
                mobile:""
            });
        }
    }
    onChangeNumVal(isAdult,value){
        if (value && (value!="")&& /^[0-9]*$/.test(value)){
            if (value.length>=5){
                value = value.substring(0,4);
            }
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
            adultCount:value
        });
    }
    setChildNum(value){
        this.props.form.setFieldsValue({
            childCount:value
        });
    }
}
const FlightDetail = Form.create()(page);
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = FlightDetail;