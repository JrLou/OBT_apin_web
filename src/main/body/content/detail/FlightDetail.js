/**
 * Created by apin on 2017/10/25.
 */
/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component,Input} from 'react';
import {message,Button} from 'antd';
import css from './FlightDetail.less';
import { HttpTool } from '../../../../../lib/utils/index.js';
import APIGYW from "../../../../api/APIGYW.js";
import LoadingView from "../../component/LoadingView.js";
import StateProgress from "./detailComp/StateProgress.js";
import CellFlight from "../cell/CellFlight.js";
import CellNewFlight from "../cell/CellNewFlight.js";

import MyInput from '../../component/MyInput.js';

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
    }


    render() {
        this.totalPrice = 2300*this.childNum+2333*this.adultNum;
        var div = (
            <div className={css.main}>
                <div className={css.content} style={{paddingLeft:"100px",paddingRight:"100px"}}>
                    <StateProgress num = {1}/>
                </div>

                <div className={css.content}>
                    <div className={css.table}>
                        <div className={css.line_bg}>
                            <div className={css.line}></div>
                        </div>
                        <div className={css.title}>航班信息</div>
                    </div>
                    {/*<CellFlight ref={(cellFlight)=>this.cellFlight = cellFlight}*/}
                    {/*callBack={(data)=>{*/}
                    {/*// this.myAlert.showView();*/}
                    {/*window.app_open(this, "/FlightDetail", {*/}
                    {/*data:data*/}
                    {/*},"new");*/}
                    {/*}}/>*/}
                    <CellNewFlight
                        dataSource = {this.par.data}
                        flightType={2}
                        isShowFlightLine={true}
                        isShowAdd={true}
                        isOrder={true}
                    />
                </div>

                <div className={css.title}>订单信息</div>
                <div className={css.content} style={{marginBottom:"0px",borderWidth:"0px"}}>
                    <div className={css.cell}>
                        <div className={css.cell_left}>1</div>
                        <div className={css.cell_right}>确认乘机人数</div>
                    </div>
                    <div className={css.table}>
                        <div className={css.orderCellItem}>
                            <div className={css.orderCell}>
                                <div className={css.orderInforTitle}>成人(12岁以上):</div>
                                <MyInput
                                    ref="adult"
                                    maxLength={4}
                                    className={css.orderInforInput}
                                    value={this.adultNum}
                                    obj = {{
                                        isAddOrSub:true,
                                    }}
                                    callBack={(val)=>{
                                        this.adultNum = val?val:"";
                                        let totalNum = parseInt(this.adultNum?this.adultNum:0)+parseInt(this.childNum?this.childNum:0);
                                        this.setTotal(totalNum);
                                    }}/>
                                <div className={css.orderInforCon}>¥2333</div>
                            </div>

                            <div className={css.orderCell} style={{marginTop:"20px"}}>
                                <div className={css.orderInforTitle}>儿童(2-12岁):</div>
                                <MyInput
                                    ref="child"
                                    maxLength={4}
                                    className={css.orderInforInput}
                                    value={this.childNum}
                                    obj = {{
                                        isAddOrSub:true,
                                    }}
                                    callBack={(val)=>{
                                        this.childNum = val?val:"";
                                        let totalNum = parseInt(this.adultNum?this.adultNum:0)+parseInt(this.childNum?this.childNum:0);
                                        this.setTotal(totalNum);
                                    }}/>
                                <div className={css.orderInforCon}>¥2300</div>
                            </div>
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
                        <div className={css.cell_left} style={{backgroundColor:"#EFF7FD",color:"#CBD3E5"}}>2</div>
                        <div className={css.cell_right} >填写联系人信息</div>
                    </div>
                    <div className={css.orderCell}>
                        <div className={css.orderInforTitle}>姓名:</div>
                        <MyInput
                            ref="phone"
                            placeholder={"请输入您的姓名"}
                            obj = {{
                                isRandom:true,
                            }}
                            maxLength={12}
                            className={css.perInfor}
                            value={this.phoneNum}
                            callBack={(val)=>{
                                this.phoneNum = val;
                            }}/>
                    </div>
                    <div className={css.orderCell}>
                        <div className={css.orderInforTitle}>
                            <span>手机号码:</span>
                            {/*<span style={{fontSize:"20px",color:"red"}}>*</span>*/}
                        </div>
                        <MyInput
                            ref="phone"
                            placeholder={"请输入可联系的手机号码"}
                            obj = {{
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



                <div className={css.btnCon}>
                    <Button type="primary"
                            style={{height:"35",letterSpacing:"1px",fontSize:"14px"}}
                            onClick={()=>{
                                window.app_open(this, "/PubRequirement", {
                                    data:{}
                                },"new");
                            }}>提交订单</Button>
                    <div className={css.alertText}>{"提交订单30分钟内，即可确认资源信息"}</div>
                </div>

                <div className={css.bottomDiv}>
                    <div className={css.bottomDiv_left}>
                        <div className={css.bottomBtn}>{"<返回上一级"}</div>
                    </div>
                    <div className={css.bottomDiv_center}>
                        <div className={css.depositPriceBg}>
                            <span style={{fontSize:"14px",color:"#333"}}>订金</span>
                            <span style={{fontSize:"14px",color:"red"}}>￥</span>
                            <span style={{fontSize:"20px",color:"red"}}>23333</span>
                        </div>
                        <div className={css.depositPriceBg}>
                            <span style={{fontSize:"12px",color:"#888D99"}}>{"(成人¥"+"2333"+"*"+this.adultNum+"+"+"儿童¥"+"2300"+
                            "*"+this.childNum+"=价格(含税)"+"¥"+this.totalPrice+")"}</span>
                        </div>
                    </div>
                    <div className={css.bottomDiv_right} onClick={()=>{
                        alert("立即支付");
                    }}>{"立即支付"}</div>
                </div>
            </div>
        );
        return div;
    }
}
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;