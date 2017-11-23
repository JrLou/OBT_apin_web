/**
 * Created by apin on 2017/10/25.
 */
import React, { Component } from 'react';
import {Button} from 'antd';
import css from './PubRequirement.less';
import ClickHelp from '../../tool/ClickHelp.js';
import MyInput from '../../component/MyInput.js';
import MyTextArea from '../../component/MyTextArea.js';
import MyDiv from "../../component/MyDiv.js";
import AddFlightLine from "./detailComp/AddFlightLine.js";
class PubRequirement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow:false,
            totalNum:1,
            isSelect:true,
            isSelType:1,
            moreFlightNum:3,
            // myDate:"2017-10-12",
            // isShowDate:false,
            // leftDatePick_width:0
        };
        this.adultNum = 1;
        this.childNum = 0;
        this.phoneNum = "";
    }
    componentDidMount() {

    }

    showView(isShow){
        this.setState({
            isShow:isShow
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({

        });
    }
    setTotal(totalNum){
        this.setState({
            totalNum:totalNum
        });
    }

    render() {
        let {isShow,isSelect,moreFlightNum} = this.state;
        var div = (<div className={css.main}>
            <div className={css.content}>
                <div className={css.bgCon}>
                    <div className={css.headTitle}>
                        <div className={css.lineBg}>
                            <div className={css.headLine}></div>
                        </div>
                        <div className={css.headHitle}>需求信息</div>
                    </div>

                    {/*航程类型*/}
                    <TypeSel isSelType={this.state.isSelType}
                             typeArrLen={3}
                             callBack={(isSelType)=>{
                                 this.setState({
                                     isSelType:isSelType
                                 });
                             }}/>


                    {/*航程发布*/}
                    {this.createFlightItem(this.state.isSelType)}
                    {this.state.isSelType>=3?<div className={moreFlightNum>=5?css.refAddFlight:css.addFlight} onClick={()=>{
                        if (moreFlightNum>=5){
                            return;
                        }
                        let myNum = moreFlightNum +1;
                        this.setState({
                            moreFlightNum:myNum
                        });
                    }}>{"加一程"}</div>:null}




                    {/*出行人数*/}
                    <div className={css.refCell}>
                        <div className={css.cellTitle}>出行人数:</div>
                    </div>
                    <div className={css.cell}>
                        <div className={css.thirCellTitle}>
                            <MyInput
                                ref="adult"
                                maxLength={4}
                                className={css.refCellInput}
                                style={{width:"70%"}}
                                value={this.adultNum}
                                obj={{text:"成人"}}
                                callBack={(val)=>{
                                    this.adultNum = val?val:"";
                                    let totalNum = parseInt(this.adultNum?this.adultNum:0)+parseInt(this.childNum?this.childNum:0);
                                    this.setTotal(totalNum);
                                }}
                            />
                        </div>
                        <div className={css.space}></div>
                        <div className={css.thirCellTitle}>
                            <MyInput
                                ref="child"
                                maxLength={4}
                                className={css.refCellInput}
                                value={this.childNum}
                                obj={{text:"儿童(2~12周岁)"}}
                                callBack={(val)=>{
                                    this.childNum = val?val:"";
                                    let totalNum = parseInt(this.adultNum?this.adultNum:0)+parseInt(this.childNum?this.childNum:0);
                                    this.setTotal(totalNum);
                                }}
                            />
                        </div>
                        <div className={css.refCellTitle} style={{paddingLeft:"10px"}}>{"共: "+this.state.totalNum+"人"}</div>
                    </div>


                    <div className={css.refCell}>
                        <div className={css.cellTitle} style={{verticalAlign: "top"}}>备注:</div>
                    </div>
                    <div className={css.cell}>
                        <MyTextArea maxLength={100}
                                    style={{width:"100%",height:"60px"}}
                                    placeholder="如：价格、时间等"/>
                    </div>

                    <div className={css.refCell}>
                        <div className={css.cellTitle}>
                            <span>联系电话</span>
                            <span style={{fontSize:"20px",color:"red"}}>*</span>
                        </div>
                    </div>
                    <div className={css.cell}>
                        <MyInput
                            ref="phone"
                            placeholder={"请输入可联系的手机号码"}
                            obj = {{
                                regular:/^1\d{10}$/
                            }}
                            maxLength={11}
                            className={css.thirCellInput}
                            value={this.phoneNum}
                            callBack={(val)=>{
                                this.phoneNum = val;
                            }}
                        />
                    </div>

                    <div className={css.btnCon}>
                        <MyDiv div={<div className={css.btn}
                                         onClick={()=>{
                                             this.showView(false);
                                         }}>提交需求</div>}/>
                    </div>
                </div>
            </div>
        </div>);
        return div;
    }

    createFlightItem(isSelType){
        if (!isSelType){
            return null;
        }
        let num=isSelType<3?1:this.state.moreFlightNum;
        var flightItemArr=[];
        for (let i=0;i<num;i++){
            let item = (<AddFlightLine
                key={i}
                numFlight={i}
                isSelType={isSelType}
                callBackParam={(value)=>{

                }}


                isNoCanDel={i<num-1||i<2}
                callBack={()=>{
                let myNum = this.state.moreFlightNum -1;
                if (isSelType>=3){
                    this.setState({
                        moreFlightNum:myNum
                    });
                }
            }}/>);
            flightItemArr.push(item);
        }
        return flightItemArr;
    }
}
PubRequirement.contextTypes = {
    router: React.PropTypes.object
};



class TypeSel extends Component{
    constructor(props){
        super(props);
        this.state = {
            isSelType:props.isSelType?props.isSelType:1,
            typeArrLen:props.typeArrLen?props.typeArrLen:2
        };
        this.dataArr = ["单程","往返","多程"];
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            isSelType:nextProps.isSelType?nextProps.isSelType:1,
            typeArrLen:nextProps.typeArrLen?nextProps.typeArrLen:2
        });
    }

    render(){
        let {isSelType,typeArrLen}=this.state;
        let {callBack}=this.props;
        return (
            <div>
                <div className={css.refCell}>
                    <div className={css.cellTitle}>航程类型:</div>
                </div>
                <div className={css.cell}>
                    {this.createTypeItem(isSelType,typeArrLen,callBack)}
                </div>
            </div>);
    }
    createTypeItem(isSelType,typeArrLen,callBack){
        if (!isSelType||!typeArrLen){
            return null;
        }
        let myData = this.dataArr.slice(0,typeArrLen);
        var typeItemArr=[];
        for (let i=0;i<myData.length;i++){
            let item = (<div
                key={i}
                className={css.verticalMiddle}
                style={{float:"left"}}
                onClick={()=>{
                    this.setState({
                        isSelType:i+1
                    },()=>{
                        if (callBack){
                            callBack(i+1);
                        }
                    });
                }}>
                <div className={css.verticalMiddle} style={{width:"20px"}}>
                    <img className={css.typeBg}
                         src={this.state.isSelType==(i+1)?require("../../../../images/check.png"):
                             require("../../../../images/uncheck.png")}/>
                </div>
                <div className={css.verticalMiddle} style={{width:"40px"}}>
                    <div className={css.typeText}>{myData[i]}</div>
                </div>
            </div>);
            typeItemArr.push(item);
        }
        return typeItemArr;
    }
}
module.exports = PubRequirement;