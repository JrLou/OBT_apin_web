/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component} from "react";
import less from "./index.less";
import {DatePicker,Button,Select,Table} from "antd";

import OrderInfoView from '../../component/OrderInfoView/index';
/**
 * 需求处理中        1
 * 需求已确认        2
 * 需求已关闭        3
 * 需求已取消        4
 * 处理完成          5
 * 需求确认          6
 * 需求处理中（多程）  7
 * 待用户确认        8
 *
 */

class DemandInfoView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            itemNum:3
        };
    }

    componentDidMount() {
    }

    render() {
        let {data, type} = this.props;
        return (
            <div className={less.top}>

                {type===7?this.getMultiPass(type,data):this.getTop(type,data)}
                {type===1?this.getMessage("预计在30分钟内为您处理需求"):
                    (type===3?this.getMessage("您的需求已经关闭，如有疑问，请联系客服／出行日期已超过，需求关闭"):null)}
                {type===3?this.getCloseReason():null}
                {type===1||type===3||type===4?this.getButton(type):null}
                {type===2||type===5?<OrderInfoView type={0}/>:null}
                {type===7?this.getFlightInfo():null}
            </div>
        );
    }


    getMessage(messge){
        return(
            <div className={less.messageLayout}>
                <div  className={less.img}>
                    <img src={require("../../../../images/login_check.png")}/>
                </div>
                <div className={less.messageText}>{messge}</div>
            </div>
        );
    }

    getButton(type){
        return(
            <div className={less.buttonBottomLayout}>
                <div>
                    <Button className={less.buttonAgin}>{type===1?"联系爱拼机客服":"重新发布需求"}</Button>
                    {
                        type===3?<Button className={less.buttonContact}>联系爱拼机客服</Button>:null
                    }
                    </div>
            </div>
        );
    }

    getCloseReason(){
        return(
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

    getDemandButton(type){
        if(type===1||type===5||type===7||type===8){
           return(
               <div className={less.buttonLayout}>
                   <Button className={less.buttonCancel}>取消需求</Button>
               </div>
           );
        }else if(type===2){
            return(
               null
            );
        }else {
            return(
                <div className={less.buttonLayout}>
                    <Button className={less.buttonDelete}>删除需求</Button>
                </div>
            );
        }
    }

    getMultiPass(type,data){
        return(
            <div className={less.topMessage}>
                <h2 className={less.title}>需求信息</h2>
                <div className={less.line}/>
                <div className={less.content}>
                    <div className={less.mainTextLayout}>
                        <div>
                            <font className={less.mainTitle}>需求状态：</font>
                            <font className={type===1?less.mainContentGreenStatus:(type===3?less.mainContentClose:less.mainContent)}>{data&&data.status?data.status:"暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>创建时间：</font>
                            <font className={type===3?less.mainContentClose:less.mainContent}>{data&&data.creatTime?data.creatTime:"暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>航程类型：</font>
                            <font className={type===3?less.mainContentClose:less.mainContent}>{data&&data.vayageType?data.vayageType:"暂无"}</font>
                        </div>
                        <div>
                            <font className={less.mainTitle}>航班人数：</font>
                            <font className={type===3?less.mainContentClose:less.mainContent}>{data&&data.peopleNum?data.peopleNum:"暂无"}</font>
                        </div>
                    </div>
                    {this.getDemandButton(type)}
                    <div className={less.tripLayout}>
                        {this.getTripList()}
                        <div style={{clear:"both"}}/>
                    </div>


                    <div style={{paddingTop:17,paddingLeft:20,marginBottom:50}}>
                        <font className={less.mainTitle}>备注：</font>
                        <font className={type===3?less.mainContentClose1:less.mainContent1}>{data&&data.mark?data.mark:"暂无"}</font>
                    </div>
                </div>
            </div>
        );
    }

    getFlightInfo(){
        return(
            <div className={less.topMessage}>
                <h2 className={less.title}>航班信息</h2>
                <div className={less.line}/>

                <div>
                    {this.getConfirmButton()}
                </div>

            </div>
        );
    }
    getConfirmButton(){
        let arr=[];
        for(let i=0;i<6;i++){
            arr.push(i);
        }
        return(
            arr.map((data, index) => {
                return (
                   <div style={{marginTop:20}}>
                       <div className={less.uncertainFlightButton}>
                           <div className={less.uncertainBtnImg}>
                               <img src={require("../../../../images/login_check.png")}/>
                           </div>
                           <div className={less.uncertainBtnText}>确定此航班</div>
                       </div>
                   </div>
                );

            })
        );
    }


    getTop(type,data){
        return(
           <div className={less.topMessage}>
               <h2 className={less.title}>需求信息</h2>
               <div className={less.line}/>
               <div className={less.content}>
                   <div className={less.mainTextLayout}>
                       <div>
                           <font className={less.mainTitle}>需求状态：</font>
                           <font className={type===1||type===8?less.mainContentGreenStatus:(type===3?less.mainContentClose:less.mainContent)}>{data&&data.status?data.status:"暂无"}</font>
                       </div>
                       <div>
                           <font className={less.mainTitle}>创建时间：</font>
                           <font className={type===3?less.mainContentClose:less.mainContent}>{data&&data.creatTime?data.creatTime:"暂无"}</font>
                       </div>
                       <div>
                           <font className={less.mainTitle}>航程：</font>
                           <font className={type===3?less.mainContentCloseBig:less.mainContentBig}>{data&&data.vayage?data.vayage:"暂无"}</font>
                       </div>
                       <div>
                           <font className={less.mainTitle}>需求类型：</font>
                           <font className={type===3?less.mainContentClose:less.mainContent}>{data&&data.demandType?data.demandType:"暂无"}</font>
                       </div>
                       <div>
                           <font className={less.mainTitle}>航程类型：</font>
                           <font className={type===3?less.mainContentClose:less.mainContent}>{data&&data.vayageType?data.vayageType:"暂无"}</font>
                       </div>
                       <div>
                           <font className={less.mainTitle}>航班人数：</font>
                           <font className={type===3?less.mainContentClose:less.mainContent}>{data&&data.peopleNum?data.peopleNum:"暂无"}</font>
                       </div>
                       <div>
                           <font className={less.mainTitle}>出发日期：</font>
                           <font className={type===3?less.mainContentClose:less.mainContent}>{data&&data.startTime?data.startTime:"暂无"}</font>
                       </div>
                       <div>
                           <font className={less.mainTitle}>返程日期：</font>
                           <font className={type===3?less.mainContentClose:less.mainContent}>{data&&data.returnTime?data.returnTime:"暂无"}</font>
                       </div>
                       <div>
                           <font className={less.mainTitle}>备注：</font>
                           <font className={type===3?less.mainContentClose1:less.mainContent1}>{data&&data.mark?data.mark:"暂无"}</font>
                       </div>


                   </div>
                   {this.getDemandButton(type)}

               </div>
           </div>
        );
    }

    getTripList(){
        let arr=[];
        for(let i=0;i<6;i++){
            arr.push(i);
        }
        return(
            arr.map((data, index) => {
                return (
                    this.getTripItem(data,index)
                );

            })
    );
    }

    getTripItem(data,index){
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
        return(
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
                        <div className={less.date}>{"行程"+index}</div>
                        <div className={less.date} style={{marginTop:5}}>{this.getTimeShow("2-10")}</div>
                    </div>
                </div>
            </div>
        );
    }
    getTimeShow(value){
        if(!value){
            return value;
        }
        let arr= value.split("-");
        if (arr) {
            if (arr.length < 3) {
                let p = [ "月", "日"];
                let time = "";
                for (let i=0;i<arr.length;i++) {
                    time+=(arr[i]+p[i]);
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