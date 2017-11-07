import React, {Component} from "react";

import {Carousel, Input, Button, Row, Col, message} from "antd";
import less from "./DemandDetail.less";
import OrderInfoView from '../component/OrderInfoView/index';
import CellNewFlight from "../content/cell/CellNewFlight";
import {HttpTool} from "../../../../lib/utils/index.js";
/**
 * 待出价      1
 * 询价中      2
 * 待确认      3
 *
 * 已确认      4
 * 已关闭      5
 * 已取消      0
 * 全部       -1
 */
class page extends Component {
    constructor(props) {
        super(props);

        this.state = {
            itemNum: 3,
            index: -1,
        };
        this.data=null;

    }
    componentDidMount() {
        this.loadData();
    }
    loadData(){
        let success = (code, msg, json, option) => {
            if(!json){
                this.data=null;
            }else {
                this.data=json;
            }
        };
        let failure = (code, msg, option) => {
            this.data=null;
        };
        HttpTool.request(HttpTool.typeEnum.GET, "/demandapi/v1.0/demands/81a366cd6c754cbcbbc978a8b956982b", success, failure, {},
            {
                ipKey: "hlIP"
            });
    }

    render() {
        if(this.date===null||this.data.demandStatus===null){
           return null;
        }else {
            return (
                <div className={less.top}>

                    {this.data.demandStatus === "待出价多程" || this.data.demandStatus === "询价中多程" ? this.getMultiPass(this.data.demandStatus, this.data) : this.getTop(this.data.demandStatus, this.data)}
                    {this.data.demandStatus === "已确认" ? this.getCellNewFlight(this.data && this.data.palns ? this.data.palns : []) : null}
                    {this.data.demandStatus === "待出价单程" || this.data.demandStatus === "待出价多程" ? this.getMessage("预计在30分钟内为您处理需求") :
                        (this.data.demandStatus === "已关闭" ? this.getMessage("您的需求已经关闭，如有疑问，请联系客服／出行日期已超过，需求关闭") : null)}
                    {this.data.demandStatus === "已关闭" ? this.getCloseReason() : null}
                    {this.data.demandStatus === "待出价单程" || this.data.demandStatus === "已关闭" || this.data.demandStatus === "已取消" ? this.getButton(this.data.demandStatus) : null}
                    {this.data.demandStatus === "已确认" ? <OrderInfoView type={0}/> : null}
                    {this.data.demandStatus === "询价中多程" || this.data.demandStatus === "询价中单程" ? this.getFlightInfo(this.data && this.data.palns ? this.data.palns : []) : null}
                </div>
            );
        }

    }

    getCellNewFlight(data) {
        return (
            <div className={less.cellNewFlightLayout}>
                <h2 className={less.title}>航班信息</h2>
                <div className={less.line}/>
                <div className={less.cellNewFlight}>
                    {this.createViewCell(data || [])}
                </div>
            </div>
        );
    }

    createViewCell(dataArr) {
        alert(dataArr.cityArr);

        return dataArr.map((data, index) => {
            return (<CellNewFlight key={index} dataSource={data}/>);
        });
    }

    getMessage(messge) {
        return (
            <div className={less.messageLayout}>
                <div className={less.img}>
                    <img src={require("../../../images/login_check.png")}/>
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
                                className={type === "待出价单程" ? less.mainContentGreenStatus : (type === "已关闭" ? less.mainContentClose : less.mainContent)}>{data && data.demandStatus ? data.demandStatus : "暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>创建时间：</font>
                            <font
                                className={type === "已关闭" ? less.mainContentClose : less.mainContent}>{data && data.createdTime ? data.createdTime : "暂无"}</font>
                        </div>
                        {/*<div>*/}
                        {/*<font className={less.mainTitle}>航程类型：</font>*/}
                        {/*<font*/}
                        {/*className={type === "已关闭" ? less.mainContentClose : less.mainContent}>{data && data.vayageType ? data.vayageType : "暂无"}</font>*/}
                        {/*</div>*/}
                        {/*<div>*/}
                        {/*<font className={less.mainTitle}>航班人数：</font>*/}
                        {/*<font*/}
                        {/*className={type === "已关闭" ? less.mainContentClose : less.mainContent}>{data.adultCount+data.childCount}人（{data&&data.adultCount?data.adultCount:"0"}成人,{data&&data.childCount?data.childCount:"0"}儿童）</font>*/}
                        {/*</div>*/}
                    </div>
                    {this.getDemandButton(type)}
                    <div className={less.tripLayout}>
                        {this.getTripList()}
                        <div style={{clear: "both"}}/>
                    </div>


                    <div style={{paddingTop: 17, paddingLeft: 20, marginBottom: 50}}>
                        <font className={less.mainTitle}>备注：</font>
                        <font
                            className={type === "已关闭" ? less.mainContentClose1 : less.mainContent1}>{data && data.remark ? data.remark : "暂无"}</font>
                    </div>
                </div>
            </div>
        );
    }

    getFlightInfo(datas) {
        return (
            <div>
                {this.getConfirmButton(datas)}
            </div>
        );
    }

    getConfirmButton(datas) {
        return (
            datas.map((data, index) => {
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
                                <CellNewFlight key={index} dataSource={data}/>
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
                                                    this.state.index === index ? require('../../../images/confirm_check.png') : require('../../../images/confirm_uncheck.png')}/>
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
        if (!data)return null;
        let img = null;
        if (data.flightType===1) {
            img = require('../../../images/oneWay.png');
        } else {
            img = require('../../../images/return.png');
        }
        return (
            <div className={less.topMessage}>
                <h2 className={less.title}>需求信息</h2>
                <div className={less.line}/>
                <div className={less.content}>
                    <div className={less.mainTextLayout}>
                        <div>
                            <font className={less.mainTitle}>需求状态：</font>
                            <font
                                className={type === "待出价单程" || type === "询价中单程" ? less.mainContentGreenStatus : (type === "已关闭" ? less.mainContentClose : less.mainContent)}>{data && data.flightType ? data.flightType : "暂无"}</font>
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
                                         style={{paddingLeft: 54, paddingRight: 10}}>{data&&data.cityDep?data.cityDep:"暂无"}
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
                                         style={{paddingLeft: 10}}>{data&&data.cityArr?data.cityArr:"暂无"}
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div style={{clear: "both", marginTop: 0}}/>
                        <div style={{marginTop: 0}}>
                            <font className={less.mainTitle}>需求类型：</font>
                            <font
                                className={type === "已关闭" ? less.mainContentClose : less.mainContent}>{data && data.flightType === 1 ? "单程" : data && data.flightType === 2 ? "往返" : "暂无"}</font>
                        </div>
                        {/*<div>*/}
                        {/*<font className={less.mainTitle}>航程类型：</font>*/}
                        {/*<font*/}
                        {/*className={type === "已关闭" ? less.mainContentClose : less.mainContent}>{data && data.vayageType ? data.vayageType : "暂无"}</font>*/}
                        {/*</div>*/}
                        {/*<div>*/}
                        {/*<font className={less.mainTitle}>航班人数：</font>*/}
                        {/*<font*/}
                        {/*className={type === "已关闭" ? less.mainContentClose : less.mainContent}>{data&&data.adultCount&&data.childCount?data.adultCount+data.childCount:""}人{"（"+data&&data.adultCount?data.adultCount+"成人":""}{"，"+data&&data.childCount?data.childCount+"儿童）":""}</font>*/}
                        {/*</div>*/}
                        <div>
                            <font className={less.mainTitle}>出发日期：</font>
                            <font
                                className={type === "已关闭" ? less.mainContentClose : less.mainContent}>{data && data.dateDep ? data.dateDep : "暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>返程日期：</font>
                            <font
                                className={type === "已关闭" ? less.mainContentClose : less.mainContent}>{data && data.dateRet ? data.dateRet : "暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>备注：</font>
                            <font
                                className={type === "已关闭" ? less.mainContentClose1 : less.mainContent1}>{data && data.remark ? data.remark : "暂无"}</font>
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
        if (!data)return null;

        let img = null;
        if (data.flightType===1) {
            img = require('../../../images/oneWay.png');
        } else {
            img = require('../../../images/return.png');
        }
        return (
            <div key={index}
                 className={less.cell}
            >
                <div className={less.bottom}>
                    <div className={less.bottomLeft}>

                        <div className={less.table}>
                            <div className={less.text}>{data&&data.cityDep?data.cityDep:"暂无"}</div>


                            <div className={less.text2}>
                                <div className={less.icon}
                                     style={{
                                         backgroundImage: "url(" + img + ")"
                                     }}
                                >
                                </div>
                            </div>


                            <div className={less.text}>{data&&data.cityArr?data.cityArr:"暂无"}</div>
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

page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;




