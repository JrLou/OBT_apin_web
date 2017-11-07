import React, {Component} from "react";

import {Carousel, Input, Button, Row, Col, message} from "antd";
import less from "./DemandDetail.less";
import OrderInfoView from '../component/OrderInfoView/index';
import CellNewFlight from "../content/cell/CellNewFlight";
import {HttpTool} from "../../../../lib/utils/index.js";
/**
 * 需求已取消                    0
 * 需求处理中 （单程）       1    1
 * 需求处理中（多程）        7    1
 *
 * 待用户确认 （单程）       8    2
 * 待用户确认 （多程）       9    2
 * 处理完成                     4
 * 需求已关闭                   5
 *
 *
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
            upData: 1,
            data: null,
        };

    }

    getUpData() {
        this.setState({
            upData: this.state.upData + 1
        });
    }

    componentDidMount() {
        this.loadData();
        this.getUpData();

    }

    loadData() {
        let param = {
            id: "c374da99311144058a1d8d7382de5d8a",
        };
        let success = (code, msg, json, option) => {
            this.setState({
                data: json,
            });
        };
        let failure = (code, msg, option) => {
            this.data = null;
        };
        HttpTool.request(HttpTool.typeEnum.POST, "/demandapi/v1.0/demands/read", success, failure, param,
            {
                ipKey: "hlIP"
            });
    }

    render() {
        if (!this.state.data) return null;
        return (
            <div className={less.top}>

                {(this.state.data.demandStatus === 1 && this.state.data.flightType === 3) || (this.state.data.demandStatus === 2 && this.data.flightType === 3) ?
                    this.getMultiPass(this.state.data.demandStatus, this.state.data) : this.getTop(this.state.data.demandStatus, this.state.data)}
                {this.state.data.demandStatus === 4 ? this.getCellNewFlight(this.state.data && this.state.data.palns ? this.state.data.palns : []) : null}
                {this.state.data.demandStatus === 1 ? this.getMessage("预计在30分钟内为您处理需求") :
                    (this.state.data.demandStatus === 5 ? this.getMessage("您的需求已经关闭，如有疑问，请联系客服／出行日期已超过，需求关闭") : null)}
                {this.state.data.demandStatus === 5 ? this.getCloseReason() : null}
                {this.state.data.demandStatus === 1  || this.state.data.demandStatus === 5 || this.state.data.demandStatus === 0 ? this.getButton(this.state.data.demandStatus) : null}
                {this.state.data.demandStatus === 4 ? <OrderInfoView type={0}/> : null}
                {this.state.data.demandStatus === 2 ? this.data(this.state.data && this.state.data.palns ? this.state.data.palns : []) : null}
            </div>
        );
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
                    <img src={require("../../../images/icon_exclamation.png")}/>
                </div>
                <div className={less.messageText}>{messge}</div>
            </div>
        );
    }

    getButton(type) {
        return (
            <div className={less.buttonBottomLayout}>
                <div>
                    <Button className={less.buttonAgin}>{type === 1 ? "联系爱拼机客服处理需求" : "重新发布需求"}</Button>
                    {
                        type === 5 ? <Button className={less.buttonContact}>联系爱拼机客服</Button> : null
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
        if (type === 1 || type === 2) {
            return (
                <div className={less.buttonLayout}>
                    <Button className={less.buttonCancel}>取消需求</Button>
                </div>
            );
        } else if (type === 4) {
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
        let status = ["需求已取消", "需求处理中", "待用户确认", "待确认", "处理完成", "需求已关闭"];
        return (
            <div className={less.topMessage}>
                <h2 className={less.title}>需求信息</h2>
                <div className={less.line}/>
                <div className={less.content}>
                    <div className={less.mainTextLayout}>
                        <div>
                            <font className={less.mainTitle}>需求状态：</font>
                            <font
                                className={type === 5 ? less.mainContentClose : less.mainContent}>{data && data.demandStatus ? (data.demandStatus === -1 ? "全部" : status[data.demandStatus] ) : "暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>创建时间：</font>
                            <font
                                className={type === 5 ? less.mainContentClose : less.mainContent}>{data && data.createdTime ? data.createdTime : "暂无"}</font>
                        </div>
                        <div>
                        <font className={less.mainTitle}>航程类型：</font>
                        <font
                        className={type === 5 ? less.mainContentClose : less.mainContent}>{data && data.flightType === 1 ? "单程" : data && data.flightType === 2 ? "往返" :data && data.flightType === 3 ? "多程" : "暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>航班人数：</font>
                            <font
                                className={type === 5 ? less.mainContentClose : less.mainContent}>{data && data.totalPeople ? data.totalPeople : "0"}人（{data && data.adultCount ? data.adultCount : "0"}成人,{data && data.childCount ? data.childCount : "0"}儿童）</font>
                        </div>
                    </div>
                    {this.getDemandButton(type)}
                    <div className={less.tripLayout}>
                        {this.getTripList(data)}
                        <div style={{clear: "both"}}/>
                    </div>


                    <div style={{paddingTop: 17, paddingLeft: 20, marginBottom: 50}}>
                        <font className={less.mainTitle}>备注：</font>
                        <font
                            className={type === 5 ? less.mainContentClose1 : less.mainContent1}>{data && data.remark ? data.remark : "暂无"}</font>
                    </div>
                </div>
            </div>
        );
    }


    getConfirmButton(datas) {
        return (
            datas.map((data, index) => {
                return (
                    <div key={index} className={less.flightItem}>
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
        let status = ["需求已取消", "需求处理中", "待用户确认", "待确认", "处理完成", "需求已关闭"];
        if (!data)return null;
        let img = null;
        if (data.flightType === 1) {
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
                                className={type === 1 || type === 2 ? less.mainContentGreenStatus : (type === 5 ? less.mainContentClose : less.mainContent)}>{data && data.demandStatus ? (data.demandStatus === -1 ? "全部" : status[data.demandStatus] ) : "暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>创建时间：</font>
                            <font
                                className={type === 5 ? less.mainContentClose : less.mainContent}>{data && data.createdTime ? data.createdTime : "暂无"}</font>
                        </div>
                        <div className={less.voyageLayout} style={{marginTop: 0}}>
                            <div className={less.voyageTitle}>航程：</div>
                            {/*<font*/}
                            {/*className={type === 5 ? less.mainContentCloseBig : less.mainContentBig}>{data && data.vayage ? data.vayage : "暂无"}</font>*/}
                            <div className={less.voyageContentLayout}>
                                <div className={less.voyageContent}>
                                    <div className={type === 5 ? less.voyageGray : less.voyage}
                                         style={{
                                             paddingLeft: 54,
                                             paddingRight: 10
                                         }}>{data && data.cityDep ? data.cityDep : "暂无"}
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
                                    <div className={type === 5 ? less.voyageGray : less.voyage}
                                         style={{paddingLeft: 10}}>{data && data.cityArr ? data.cityArr : "暂无"}
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div style={{clear: "both", marginTop: 0}}/>
                        <div style={{marginTop: 0}}>
                            <font className={less.mainTitle}>需求类型：</font>
                            <font
                                className={type === 5 ? less.mainContentClose : less.mainContent}>{data && data.flightType === 1 ? "单程" : data && data.flightType === 2 ? "往返" : "暂无"}</font>
                        </div>
                        {/*<div>*/}
                        {/*<font className={less.mainTitle}>航程类型：</font>*/}
                        {/*<font*/}
                        {/*className={type === 5 ? less.mainContentClose : less.mainContent}>{data && data.vayageType ? data.vayageType : "暂无"}</font>*/}
                        {/*</div>*/}
                        <div>
                            <font className={less.mainTitle}>航班人数：</font>
                            <font
                                className={type === 5 ? less.mainContentClose : less.mainContent}>{data && data.totalPeople ? data.totalPeople : "0"}人（{data && data.adultCount ? data.adultCount + "成人" : "0"}{"，" + data && data.childCount ? data.childCount + "儿童）" : "0"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>出发日期：</font>
                            <font
                                className={type === 5 ? less.mainContentClose : less.mainContent}>{data && data.dateDep ? data.dateDep : "暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>返程日期：</font>
                            <font
                                className={type === 5 ? less.mainContentClose : less.mainContent}>{data && data.dateRet ? data.dateRet : "暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>备注：</font>
                            <font
                                className={type === 5 ? less.mainContentClose1 : less.mainContent1}>{data && data.remark ? data.remark : "暂无"}</font>
                        </div>


                    </div>
                    {this.getDemandButton(type)}

                </div>
            </div>
        );
    }

    getTripList(data) {
        let voyage=JSON.parse(data.voyage);

        let arr = [];
        for (let i = 0; i < 7; i++) {
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
        if (data.flightType === 1) {
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
                            <div className={less.text}>{data && data.cityDep ? data.cityDep : "暂无"}</div>


                            <div className={less.text2}>
                                <div className={less.icon}
                                     style={{
                                         backgroundImage: "url(" + img + ")"
                                     }}
                                >
                                </div>
                            </div>


                            <div className={less.text}>{data && data.cityArr ? data.cityArr : "暂无"}</div>
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




