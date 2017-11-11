import React, {Component} from "react";

import {Button, Modal,message} from "antd";
import less from "./DemandDetail.less";
import OrderInfoView from '../component/OrderInfoView/index';
import CellNewFlight from "../content/cell/CellNewFlight";
import {HttpTool} from "../../../../lib/utils/index.js";
import LoadingView from "../component/LoadingView.js";
import NumTransToTextHelp from '../tool/NumTransToTextHelp.js';
import {hasKey,getFlightData} from '../tool/LXDHelp.js';
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
            visibleCancle: false,
            visibleDelete: false,
            visibleConfirm: false,
            flightData:null,

        };
    }

    getUpData() {
        this.setState({
            upData: this.state.upData + 1
        });
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        // 往返 81a366cd6c754cbcbbc978a8b956982b
        // 多程 c374da99311144058a1d8d7382de5d8a
        // 单程 9cb5a2cd48104e3385f330aec6b3d196
        let param = {
            id: "65a7a041bcab4cd9b32d26178def4759",
        };
        let success = (code, msg, json, option) => {
            this.setState({
                data: json,
            });
        };
        let failure = (code, msg, option) => {
            message.warning(msg);
            this.data = null;
        };
        HttpTool.request(HttpTool.typeEnum.POST, "/boyw/demandapi/v1.0/demands/find", success, failure, param,
            {
                ipKey: "hlIP"
            });
    }

    cancelDemand() {
        let param = {
            id: "9d9f42b6b55c4bdda80c3600f0fddc3a",
        };
        let success = (code, msg, json, option) => {
            this.setState({
                data: json,
            });
        };
        let failure = (code, msg, option) => {
            message.warning(msg);
            this.data = null;
        };
        HttpTool.request(HttpTool.typeEnum.POST, "/boyw/demandapi/v1.0/demands/cancel", success, failure, param,
            {
                ipKey: "hlIP"
            });
    }

    deleteDemand() {
        let param = {
            id: "4c0a82d59ff24262a8e8495c6eff44b0",
        };
        let success = (code, msg, json, option) => {
            this.setState({
                data: json,
            });
        };
        let failure = (code, msg, option) => {
            message.warning(msg);
            this.data = null;
        };
        HttpTool.request(HttpTool.typeEnum.POST, "/boyw/demandapi/v1.0/demands/remove", success, failure, param,
            {
                ipKey: "hlIP"
            });
    }

    flightDemand() {
        let param = {
            demandId: "4c0a82d59ff24262a8e8495c6eff44b0",
            id: "4c0a82d59ff24262a8e8495c6eff44b0",
        };
        let success = (code, msg, json, option) => {
            window.app_open(this, "/OrderFormDetail", {
                data: {orderNo:json.orderNo}
            });
        };
        let failure = (code, msg, option) => {
            message.warning(msg);
            this.data = null;
        };
        HttpTool.request(HttpTool.typeEnum.POST, "/boyw/demandapi/v1.0/demands/plans", success, failure, param,
            {
                ipKey: "hlIP"
            });
    }

    render() {
        let {data} = this.state;
        if (!data) {
            return(<div className={less.top}>

            </div>);
        }

        return (
            <div className={less.top}>

                {(data.demandStatus === 1 && data.flightType === 3) || (data.demandStatus === 2 && data.flightType === 3) ?
                    this.getMultiPass(data.demandStatus, data) : this.getTop(data.demandStatus, data)}
                {data.demandStatus === 4 ? this.getCellNewFlight(data && data.plans ? data.plans : []) : null}
                {data.demandStatus === 1 ? this.getMessage("预计在30分钟内为您处理需求") :
                    (data.demandStatus === 5 ? this.getMessage("您的需求已经关闭，如有疑问，请联系客服／出行日期已超过，需求关闭") : null)}
                {data.demandStatus === 5 ? this.getCloseReason() : null}
                {data.demandStatus === 1 || data.demandStatus === 5 || data.demandStatus === 0 ? this.getButton(data.demandStatus) : null}
                {data.demandStatus === 4 ? this.getOrderDetail(data) : null}
                {data.demandStatus === 2 ? this.getConfirmButton(data && data.plans ? data.plans : [], data.flightType) : null}
                <LoadingView ref={(a)=>this.loadingView = a}/>
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
        return dataArr.map((data, index) => {
            let resultData = getFlightData(data.voyages,dataArr.flightType,data.freeBag,data.weightLimit);

            return (<CellNewFlight key={index} dataSource={resultData}/>);
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

    showCancleModal() {
        this.setState({
            visibleCancle: true,
        });
    }
    showDeleteModal() {
        this.setState({
            visibleDelete: true,
        });
    }
    showConfirmModal() {
        this.setState({
            visibleConfirm: true,
        });
    }

    handleDeleteOk() {
        this.deleteDemand();
        this.setState({
            visibleDelete: false
        });
    }

    handleFlightOk() {
        this.flightDemand();
        this.setState({
            visibleConfirm: false
        });
    }

    handleCancelOk() {
        this.cancelDemand();
        this.setState({
            visibleCancle: false
        });
    }

    handleCancel() {
        this.setState({
            visibleCancle: false,
            visibleDelete: false,
            visibleConfirm: false,
        });
    }

    getDemandButton(type) {
        if (type === 1 || type === 2) {
            return (
                <div className={less.buttonLayout}>
                    <Button className={less.buttonCancel}
                            onClick={() => {
                                this.showCancleModal();
                            }}
                    >取消需求</Button>
                    <Modal
                        title="提示"
                        visible={this.state.visibleCancle}
                        onCancel={this.handleCancel.bind(this)}
                        onOk={this.handleCancelOk.bind(this)}
                        okText="是"
                        cancelText="否"
                        style={{width: '100px'}}
                        prefixCls="my-ant-modal"
                    >
                        <font style={{fontSize: 16, color: "#333"}}>是否确定取消此需求</font>

                    </Modal>
                </div>
            );
        } else if (type === 4) {
            return (
                null
            );
        } else {
            return (
                <div className={less.buttonLayout}>
                    <Button className={less.buttonDelete}
                            onClick={() => {
                                this.showDeleteModal();
                            }}
                    >删除需求</Button>
                    <Modal
                        title="提示"
                        visible={this.state.visibleDelete}
                        onCancel={this.handleCancel.bind(this)}
                        onOk={this.handleDeleteOk.bind(this)}
                        okText="是"
                        cancelText="否"
                        style={{width: '100px'}}
                        prefixCls="my-ant-modal"
                    >
                        <font style={{fontSize: 16, color: "#333"}}>是否确定删除此需求</font>

                    </Modal>
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
                                className={type === 1 || type === 2 ? less.mainContentGreenStatus : (type === 5 ? less.mainContentClose : less.mainContent)}>{data && data.demandStatus ? (data.demandStatus === -1 ? "全部" : status[data.demandStatus] ) : "暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>创建时间：</font>
                            <font
                                className={type === 5 ? less.mainContentClose : less.mainContent}>{data && data.createdTime ? data.createdTime : "暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>航程类型：</font>
                            <font
                                className={type === 5 ? less.mainContentClose : less.mainContent}>{data && data.flightType === 1 ? "单程" : data && data.flightType === 2 ? "往返" : data && data.flightType === 3 ? "多程" : "暂无"}</font>
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


    getConfirmButton(datas, flightType) {
        log(datas);
        log("-------gyw--------");
        return (
            datas.map((data, index) => {
                let resultData = getFlightData(data.voyages,flightType,data.freeBag,data.weightLimit);

                return (
                    <div key={index} className={less.flightItem}>
                        {
                            index === 0 ? <div style={{paddingTop: 15}}><h2 className={less.title}>航班信息</h2>
                                <div className={less.line}/>
                            </div> : null
                        }
                        <div className={less.programmeLayout}>方案{NumTransToTextHelp.getValue(index + 1)}</div>

                        <div style={{marginTop: 20}} className={less.flightInfoLayout}>
                            <div className={less.flightButtonLeftLayout}>
                                <CellNewFlight key={index} dataSource={resultData} flightType={flightType}/>
                            </div>
                            <div className={less.flightButtonRightLayout}>
                                <div className={less.flightButtonRightContentLayout}>
                                    <div className={less.flightRightButton} style={{paddingRight: 30}}>
                                        <div style={{color: "#999", fontSize: 14, textAlign: "right"}}>含税价</div>
                                        <div style={{textAlign: "right"}}>
                                            <font className={less.monetSymbol}>¥</font>
                                            <font
                                                className={less.money}>{data && data.adultPrice ? data.adultPrice : "0"}</font>
                                            <font className={less.monetSymbol}>起</font>
                                        </div>
                                    </div>
                                    <div className={less.flightLeftButton}>
                                        <div
                                            className={this.state.index === index ? less.confirmFlightButton : less.uncertainFlightButton}
                                            onClick={() => {
                                                this.setState({index: index});
                                                this.showConfirmModal();
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
                                            <Modal
                                                title="提示"
                                                visible={this.state.visibleConfirm}
                                                onCancel={this.handleCancel.bind(this)}
                                                onOk={this.handleFlightOk.bind(this)}
                                                okText="是"
                                                cancelText="否"
                                                style={{width: '100px'}}
                                                prefixCls="my-ant-modal"
                                            >
                                                <font style={{fontSize: 16, color: "#333"}}>是否确认选择该方案</font>

                                            </Modal>
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
                                className={type === 1 || type === 2 ? less.mainContentGreenStatus : (type === 5 ? less.mainContentClose : less.mainContent)}>{data.demandStatus === -1 ? "全部" : status[data.demandStatus]}</font>
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
        let voyage = JSON.parse(data.voyage).voyage;
        return (
            voyage.map((data, index) => {
                return (
                    this.getTripItem(data, index)
                );

            })
        );
    }

    getTripItem(data, index) {
        if (!data)return null;

        let img = require('../../../images/oneWay.png');

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

    getOrderDetail(data) {
        return (
            <div className={less.layout}>
                <div className={less.title}>订单信息</div>
                <div className={less.lineOrderInfo}/>
                <div className={less.content}>
                    <div className={less.mainTextLayout}>
                        <div style={{paddingTop: 10}}>
                            <font className={less.mainTitle}>订单号：</font>
                            <font className={less.mainContent2}>{data && data.orderNo ? data.orderNo : "暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>创建时间：</font>
                            <font
                                className={less.mainContent}>{data && data.createdTime ? data.createdTime : "暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>成人价格：</font>
                            <font className={less.mainContent}>{data && data.adultPrice ? data.adultPrice : "0"}</font>
                            <font style={{
                                color: "#333",
                                fontSize: 12,
                                marginLeft: 8
                            }}>x{data && data.adultCount ? data.adultCount : "0"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>儿童价格：</font>
                            <font
                                className={less.mainContent}>{data && data.childPrice ? data.childPrice : "0"}</font>
                            <font style={{
                                color: "#333",
                                fontSize: 12,
                                marginLeft: 8
                            }}>x{data && data.childCount ? data.childCount : "0"}</font>
                        </div>
                    </div>
                    <div className={less.moneyLayout}>
                        <font style={{
                            color: "#999",
                            fontSize: 12,
                        }}>参考总价（含税）</font>
                        <font style={{color: "#ff5841", fontSize: 10, marginLeft: 8}}>¥</font>
                        <font style={{
                            color: "#ff5841",
                            fontSize: 20
                        }}>{data && data.orderAmount ? data.orderAmount : "0"}</font>
                    </div>
                    <div className={less.buttonDetailLayout}>
                        <Button className={less.detailButton}
                                onClick={() => {
                                    window.app_open(this, "/OrderFormDetail", {
                                        data: {orderNo:data.orderNo}
                                    });
                                }}
                        >查看订单详情</Button>
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




