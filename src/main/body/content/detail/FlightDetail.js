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
import PubRequirement from "./detailComp/PubRequirement.js";

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
        this.cellFlight.refreshView(this.par.data,2,true,true);
    }


    render() {
        var div = (
            <div className={css.main}>
                <div className={css.content}>
                    <StateProgress num = {1}/>
                </div>

                <div className={css.content}>
                    <div className={css.table}>
                        <div className={css.line_bg}>
                            <div className={css.line}></div>
                        </div>
                        <div className={css.title}>航班信息</div>
                    </div>
                    <CellFlight ref={(cellFlight)=>this.cellFlight = cellFlight}
                                callBack={(data)=>{
                                    // this.myAlert.showView();
                                    window.app_open(this, "/FlightDetail", {
                                        data:data
                                    },"new");
                                }}/>
                </div>

                <div className={css.content}>
                    <div className={css.table}>
                        <div className={css.line_bg}>
                            <div className={css.line}></div>
                        </div>
                        <div className={css.title}>订单信息</div>
                    </div>

                    <div className={css.orderCell}>
                        <div className={css.orderInforTitle}>成人价格:</div>
                        <div className={css.orderInforCon}>¥2333</div>
                        <div className={css.orderInforTitle}>儿童价格:</div>
                        <div className={css.orderInforCon}>¥2300</div>

                        <div className={css.orderInforTitle}>人数:</div>
                        <MyInput
                            ref="adult"
                            maxLength={4}
                            className={css.orderInforInput}
                            value={this.adultNum}
                            callBack={(val)=>{
                                this.adultNum = val?val:"";
                                let totalNum = parseInt(this.adultNum?this.adultNum:0)+parseInt(this.childNum?this.childNum:0);
                                this.setTotal(totalNum);
                            }}
                        />
                        <div className={css.orderInforTitle}>成人</div>

                        <MyInput
                            ref="child"
                            maxLength={4}
                            className={css.orderInforInput}
                            value={this.childNum}
                            callBack={(val)=>{
                                this.childNum = val?val:"";
                                let totalNum = parseInt(this.adultNum?this.adultNum:0)+parseInt(this.childNum?this.childNum:0);
                                this.setTotal(totalNum);
                            }}
                        />
                        <div className={css.orderInforTitle}>儿童</div>

                        <div className={css.orderInforTitle}>总人数:</div>
                        <div className={css.orderInforTitle}> {this.state.totalNum}</div>
                    </div>

                    <div className={css.orderCell}>
                        <div className={css.orderInforTitle}>直营余票:</div>
                        <div className={css.orderInforCon} style={{color:"#333"}}>1200</div>
                        <div className={css.orderInforTitle}>代售余票:</div>
                        <div className={css.orderInforCon} style={{color:"#333"}}>33</div>
                    </div>

                    <div className={css.priceText}>
                        <span>{"参考价（含税）"}</span>
                        <span className={css.priceTextColor}>{"¥"}</span>
                        <span className={css.priceTextFont}>{2300*this.childNum+2333*this.adultNum}</span>
                    </div>
                </div>

                <div className={css.content}>
                    <div className={css.table}>
                        <div className={css.line_bg}>
                            <div className={css.line}></div>
                        </div>
                        <div className={css.title}>联系人信息</div>
                    </div>

                    <div className={css.orderCell}>
                        <div className={css.orderInforTitle}>联系人信息:</div>
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
                            }}
                        />
                        <div className={css.space}></div>
                        <div className={css.orderInforTitle}>
                            <span>联系方式</span>
                            <span style={{fontSize:"20px",color:"red"}}>*</span>
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
                            }}
                        />
                    </div>
                </div>

                <div className={css.btnCon}>
                    <Button type="primary"
                            style={{height:"35",letterSpacing:"1px",fontSize:"14px"}}
                            onClick={()=>{
                        this.pubRequirement.showView(true);
                    }}>提交订单</Button>
                    <div className={css.alertText}>{"提交订单30分钟内，即可确认资源信息"}</div>
                </div>

                <div className={css.content}>
                    <div className={css.table}>
                        <div className={css.depositPriceBg}>
                            <span style={{fontSize:"14px",color:"#333"}}>订金</span>
                            <span style={{fontSize:"14px",color:"red"}}>￥</span>
                            <span style={{fontSize:"20px",color:"red"}}>23333</span>
                        </div>
                        <Button type="primary"
                                style={{height:"35",letterSpacing:"1px",fontSize:"14px"}}
                                onClick={()=>{
                                    this.pubRequirement.showView(true);
                                }}>立即支付</Button>
                    </div>
                </div>

                <PubRequirement ref={(a)=>this.pubRequirement = a}/>
            </div>
        );
        return div;
    }
}
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;