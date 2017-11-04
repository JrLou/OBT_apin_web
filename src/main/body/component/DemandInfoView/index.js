/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component} from "react";
import less from "./index.less";
import {DatePicker,Button,Select,Table} from "antd";

import OrderInfoView from '../../component/OrderInfoView/index';
/**
 * 需求处理中   1
 * 需求已确认   2
 * 需求已关闭   3
 * 需求已取消   4
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

                {this.getTop(type,data)}
                {this.getMessage()}
                {type===3?this.getCloseReason():null}
                {this.getButton(type)}
                {type===2?<OrderInfoView type={0}/>:null}
            </div>
        );
    }


    getMessage(){
        return(
            <div className={less.messageLayout}>
                <div  className={less.img}>
                    <img src={require("../../../../images/login_check.png")}/>
                </div>
                <div className={less.messageText}>预计在30分钟内为您处理需求</div>
            </div>
        );
    }

    getButton(type){
        return(
            <div className={less.buttonBottomLayout}>
                <div>
                    <Button className={less.buttonAgin}>联系爱拼机客服</Button>
                    {type===3?<Button className={less.buttonContact}>{type===4?"重新发布需求":"联系爱拼机客服"}</Button>:null}
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
        if(type===1){
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

                        <div >



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


    getTop(type,data){
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
    getMessageInfo(){
        this.arr = [];
        for (let i = 1; i < this.state.itemNum + 1; i++) {
            this.arr.push(
                <div className={less.itemLayout}>
                    <div>
                        <Button className={less.itemButton}>
                            行程{i}
                        </Button>
                        {
                            i != this.state.itemNum || this.state.itemNum === 2 ?
                                <Button className={less.deleteNoButton} disabled>删除</Button>
                                : <Button className={less.deleteButton}
                                          onClick={() => {
                                              if (this.state.itemNum === 2) {
                                                  return;
                                              }
                                              this.setState({
                                                  itemNum: this.state.itemNum - 1
                                              });
                                          }
                                          }
                            >删除</Button>
                        }

                    </div>
                    <div style={{marginTop: 20}}>
                        出发城市：<input ref="from" key={i}/>
                    </div>
                </div>
            );
        }
        return (
            <div style={{width: 250, textAlign: "center"}}>
                {this.arr}
                <Button style={{width: 100, backgroundColor: "#cc0", color: "#fff", marginTop: 20}}
                        onClick={() => {
                            this.setState({
                                itemNum: this.state.itemNum + 1
                            });
                        }}
                >
                    加一程
                </Button>
                <Button style={{width: 100, backgroundColor: "#0aa", color: "#fff", marginTop: 20}}
                        onClick={() => {
                            let item=[];
                            this.arr.map((obj, index) => {
                                return item.push(this.refs.from.getValue());
                            });
                            alert(this.refs.from.getValue());
                        }}
                >
                    提交
                </Button>
            </div>
        );
    }


}

module.exports = DemandInfoView;