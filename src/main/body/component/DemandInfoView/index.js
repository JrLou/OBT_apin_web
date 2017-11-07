/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component} from "react";
import less from "./index.less";
import {DatePicker, Button, Select, Table} from "antd";
import CellNewFlight from "../../content/cell/CellNewFlight";

import OrderInfoView from '../../component/OrderInfoView/index';


class DemandInfoView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            itemNum: 3,
            upView: 1,
            index: -1,
        };

    }

    getUpView() {
        this.setState({
            upView: this.state.upView + 1
        });
    }

    render() {

        let {data, type} = this.props;
        return (
            <div className={less.top}>

                {type === "待出价多程"||type ==="询价中多程" ? this.getMultiPass(type, data) : this.getTop(type, data)}
                {type === "已确认" ? this.getCellNewFlight() : null}
                {type === "待出价单程"||type === "待出价多程" ? this.getMessage("预计在30分钟内为您处理需求") :
                    (type === "已关闭" ? this.getMessage("您的需求已经关闭，如有疑问，请联系客服／出行日期已超过，需求关闭") : null)}
                {type === "已关闭" ? this.getCloseReason() : null}
                {type === "待出价单程" || type === "已关闭" || type === "已取消" ? this.getButton(type) : null}
                {type === "已确认" ? <OrderInfoView type={0}/> : null}
                {type === "询价中多程" ||type === "询价中单程"? this.getFlightInfo(data) : null}
            </div>
        );
    }

    getCellNewFlight(data) {
        return (
            <div className={less.cellNewFlightLayout}>
                <h2 className={less.title}>航班信息</h2>
                <div className={less.line}/>
                <div className={less.cellNewFlight}>
                    <CellNewFlight dataSource={data.plans}/>
                </div>
            </div>
        );
    }


    getMessage(messge) {
        return (
            <div className={less.messageLayout}>
                <div className={less.img}>
                    <img src={require("../../../../images/login_check.png")}/>
                </div>
                <div className={less.messageText}>{messge}</div>
            </div>
        );
    }

    getButton(type) {
        return (
            <div className={less.buttonBottomLayout}>
                <div>
                    <Button className={less.buttonAgin}>{type === "待出价单程" ? "联系爱拼机客服处理需求" : "重新发布需求"}</Button>
                    {
                        type === "已关闭" ? <Button className={less.buttonContact}>联系爱拼机客服</Button> : null
                    }
                </div>
            </div>
        );
    }

    getCloseReason() {
        return (
            <div className={less.closeMessageLayout}>
                <h2 className={less.title}>关闭原因</h2>
                <div className={less.line}/>
                <div className={less.closeMessage}>
                    用户操作不规范，填写的信息有误
                    <br/>
                    需要较大的改动
                </div>
            </div>
        );
    }

    getDemandButton(type) {
        if (type === "待出价单程" || type === "待出价多程" || type === "询价中单程") {
            return (
                <div className={less.buttonLayout}>
                    <Button className={less.buttonCancel}>取消需求</Button>
                </div>
            );
        } else if (type === "已确认") {
            return (
                null
            );
        } else {
            return (
                <div className={less.buttonLayout}>
                    <Button className={less.buttonDelete}>删除需求</Button>
                </div>
            );
        }
    }

    getMultiPass(type, data) {
        return (
            <div className={less.topMessage}>
                <h2 className={less.title}>需求信息</h2>
                <div className={less.line}/>
                <div className={less.content}>
                    <div className={less.mainTextLayout}>
                        <div>
                            <font className={less.mainTitle}>需求状态：</font>
                            <font
                                className={type === "待出价单程" ? less.mainContentGreenStatus : (type === "已关闭" ? less.mainContentClose : less.mainContent)}>{data && data.status ? data.status : "暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>创建时间：</font>
                            <font
                                className={type === "已关闭" ? less.mainContentClose : less.mainContent}>{data && data.creatTime ? data.creatTime : "暂无"}</font>
                        </div>
                        {/*<div>*/}
                        {/*<font className={less.mainTitle}>航程类型：</font>*/}
                        {/*<font*/}
                        {/*className={type === "已关闭" ? less.mainContentClose : less.mainContent}>{data && data.vayageType ? data.vayageType : "暂无"}</font>*/}
                        {/*</div>*/}
                        <div>
                            <font className={less.mainTitle}>航班人数：</font>
                            <font
                                className={type === "已关闭" ? less.mainContentClose : less.mainContent}>{data && data.peopleNum ? data.peopleNum : "暂无"}</font>
                        </div>
                    </div>
                    {this.getDemandButton(type)}
                    <div className={less.tripLayout}>
                        {this.getTripList()}
                        <div style={{clear: "both"}}/>
                    </div>


                    <div style={{paddingTop: 17, paddingLeft: 20, marginBottom: 50}}>
                        <font className={less.mainTitle}>备注：</font>
                        <font
                            className={type === "已关闭" ? less.mainContentClose1 : less.mainContent1}>{data && data.mark ? data.mark : "暂无"}</font>
                    </div>
                </div>
            </div>
        );
    }

    getFlightInfo() {
        return (
            <div>
                {this.getConfirmButton()}
            </div>
        );
    }

    getConfirmButton() {
        let arr = [];
        for (let i = 0; i < 6; i++) {
            arr.push(i);
        }

        return (
            arr.map((data, index) => {
                return (
                    <div className={less.flightItem}>
                        {
                            index === 0 ? <div style={{paddingTop: 15}}><h2 className={less.title}>航班信息</h2>
                                <div className={less.line}/>
                            </div> : null
                        }
                        <div className={less.programmeLayout}>方案{index + 1}</div>

                        <div style={{marginTop: 20}} className={less.flightInfoLayout}>
                            <div className={less.flightButtonLeftLayout}>
                                <CellNewFlight dataSource={ this.listData}/>
                            </div>
                            <div className={less.flightButtonRightLayout}>
                                <div className={less.flightButtonRightContentLayout}>
                                    <div className={less.flightRightButton} style={{paddingRight: 30}}>
                                        <div style={{color: "#999", fontSize: 14, textAlign: "right"}}>含税价</div>
                                        <div style={{textAlign: "right"}}>
                                            <font className={less.monetSymbol}>¥</font>
                                            <font
                                                className={less.money}>{data && data.totalMoney ? data.totalMoney : "0"}</font>
                                            <font className={less.monetSymbol}>起</font>
                                        </div>
                                    </div>
                                    <div className={less.flightLeftButton}>
                                        <div
                                            className={this.state.index === index ? less.confirmFlightButton : less.uncertainFlightButton}
                                            onClick={() => {
                                                this.setState({index: index});
                                            }}>
                                            <div
                                                className={this.state.index === index ? less.confirmBtnImg : less.uncertainBtnImg}>
                                                <img src={
                                                    this.state.index === index ? require('../../../../images/confirm_check.png') : require('../../../../images/confirm_uncheck.png')}/>
                                            </div>
                                            <div
                                                className={this.state.index === index ? less.confirmBtnText : less.uncertainBtnText}>
                                                确定此航班
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            })
        );
    }


    getTop(type, data) {

        let img = require('../../../../images/flight_return.png');
        return (
            <div className={less.topMessage}>
                <h2 className={less.title}>需求信息</h2>
                <div className={less.line}/>
                <div className={less.content}>
                    <div className={less.mainTextLayout}>
                        <div>
                            <font className={less.mainTitle}>需求状态：</font>
                            <font
                                className={type === "待出价单程" || type === "询价中单程" ? less.mainContentGreenStatus : (type === "已关闭" ? less.mainContentClose : less.mainContent)}>{data && data.status ? data.status : "暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>创建时间：</font>
                            <font
                                className={type === "已关闭" ? less.mainContentClose : less.mainContent}>{data && data.creatTime ? data.creatTime : "暂无"}</font>
                        </div>
                        <div className={less.voyageLayout} style={{marginTop: 0}}>
                            <div className={less.voyageTitle}>航程：</div>
                            {/*<font*/}
                            {/*className={type === "已关闭" ? less.mainContentCloseBig : less.mainContentBig}>{data && data.vayage ? data.vayage : "暂无"}</font>*/}
                            <div className={less.voyageContentLayout}>
                                <div className={less.voyageContent}>
                                    <div className={type === "已关闭" ? less.voyageGray : less.voyage}
                                         style={{paddingLeft: 54, paddingRight: 10}}>杭州
                                    </div>
                                    <div
                                        className={less.voyageImg}
                                        style={{
                                            width: 19,
                                            height: 10,
                                            backgroundImage: "url(" + img + ")",
                                        }}
                                    >
                                    </div>
                                    <div className={type === "已关闭" ? less.voyageGray : less.voyage}
                                         style={{paddingLeft: 10}}>杭州
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div style={{clear: "both", marginTop: 0}}/>
                        <div style={{marginTop: 0}}>
                            <font className={less.mainTitle}>需求类型：</font>
                            <font
                                className={type === "已关闭" ? less.mainContentClose : less.mainContent}>{data && data.demandType ? data.demandType : "暂无"}</font>
                        </div>
                        {/*<div>*/}
                        {/*<font className={less.mainTitle}>航程类型：</font>*/}
                        {/*<font*/}
                        {/*className={type === "已关闭" ? less.mainContentClose : less.mainContent}>{data && data.vayageType ? data.vayageType : "暂无"}</font>*/}
                        {/*</div>*/}
                        <div>
                            <font className={less.mainTitle}>航班人数：</font>
                            <font
                                className={type === "已关闭" ? less.mainContentClose : less.mainContent}>{data && data.peopleNum ? data.peopleNum : "暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>出发日期：</font>
                            <font
                                className={type === "已关闭" ? less.mainContentClose : less.mainContent}>{data && data.startTime ? data.startTime : "暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>返程日期：</font>
                            <font
                                className={type === "已关闭" ? less.mainContentClose : less.mainContent}>{data && data.returnTime ? data.returnTime : "暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>备注：</font>
                            <font
                                className={type === "已关闭" ? less.mainContentClose1 : less.mainContent1}>{data && data.mark ? data.mark : "暂无"}</font>
                        </div>


                    </div>
                    {this.getDemandButton(type)}

                </div>
            </div>
        );
    }

    getTripList() {
        let arr = [];
        for (let i = 0; i < 6; i++) {
            arr.push(i);
        }
        return (
            arr.map((data, index) => {
                return (
                    this.getTripItem(data, index)
                );

            })
        );
    }

    getTripItem(data, index) {
        // if (!data)return null;
        // if(data.voyage){
        //     data.voyage = data.voyage.replace("<->","-");
        //     let arr = data.voyage.split("-");
        //     if(arr.length===2){
        //         data.from = arr[0];
        //         data.to = arr[1];
        //     }
        // }else{
        //     if(data.depCity){
        //         data.from = data.depCity;
        //         // delete  data.depCity;
        //     }
        //     if(data.arrCity){
        //         data.to = data.arrCity;
        //         // delete  data.arrCity;
        //     }
        // }
        // let img = null;
        // data.one = data.flightType===1;
        // if( data.one){
        let img = require('../../../../images/oneWay.png');
        // }else{
        //     img = require('../../../../images/return.png');
        // }
        return (
            <div
                className={less.cell}
            >
                <div className={less.bottom}>
                    <div className={less.bottomLeft}>

                        <div className={less.table}>
                            <div className={less.text}>杭州</div>


                            <div className={less.text2}>
                                <div className={less.icon}
                                     style={{
                                         backgroundImage: "url(" + img + ")"
                                     }}
                                >
                                </div>
                            </div>


                            <div className={less.text}>杭州</div>
                        </div>
                    </div>
                    <div className={less.bottomRight}>
                        <div className={less.date}>{"行程" + index}</div>
                        <div className={less.date} style={{marginTop: 5}}>{this.getTimeShow("2-10")}</div>
                    </div>
                </div>
            </div>
        );
    }

    getTimeShow(value) {
        if (!value) {
            return value;
        }
        let arr = value.split("-");
        if (arr) {
            if (arr.length < 3) {
                let p = ["月", "日"];
                let time = "";
                for (let i = 0; i < arr.length; i++) {
                    time += (arr[i] + p[i]);
                }
                return time;
            } else {
                return value;
            }
        } else {
            return value;
        }
    }


}

module.exports = DemandInfoView;