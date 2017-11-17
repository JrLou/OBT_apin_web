/**
 * Created by apin on 2017/11/17.
 */
import React, { Component } from 'react';
import {
    Button,
    Input,
    Modal,
} from 'antd';
import css from './AlertView.less';
class AlertView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:true,
            title:"",
            desc:"",
            totalTitle:"",
            sit:0,
            myNumTitle:"",
            myNum:"",
        };
    }
    showModal(visible,option) {
        option = option?option:{};
        this.setState({
            visible:visible,
            title:option.title?option.title:undefined,
            desc:option.desc?option.desc:undefined,
            totalTitle:option.totalTitle?option.totalTitle:undefined,
            sit:option.sit?option.sit:0,
            myNumTitle:option.myNumTitle?option.myNumTitle:undefined,
            myNum:option.myNum?option.myNum:"",
        });
    }

    render() {
        var {callBack}=this.props;
        return (
            <Modal prefixCls={'my-ant-modal'}
                   width="450"
                   visible={this.state.visible}
                   onOk={()=>{
                       this.handleOk(callBack);
                   }}
                   onCancel={()=>{
                       this.handleCancel();
                   }}
                   footer={null}>
                {this.createAlert()}
            </Modal>
        );
    }
    handleOk(callBack){
        this.setState({
            visible:false,
        },()=>{
            if (callBack){
                callBack(this.state.myNum);
            }
        });
    }
    handleCancel(){
        this.setState({
            visible:false,
        });
    }
    recycleNum(value){
        if (value&value.replace("^[0-9]\d*$",)&parseInt(value)){
            this.setState({
                myNum:parseInt(value)<this.state.sit?parseInt(value):this.state.sit,
            });
        }else {
            this.setState({
                myNum:"",
            });
        }
    }
    decline(){
        this.setState({
            myNum:this.state.myNum>1?this.state.myNum-1:"",
        });
    }
    increase(){
        this.setState({
            myNum:(this.state.myNum>=this.state.sit)?this.state.sit:(this.state.myNum?this.state.myNum+1:1),
        });
    }

    createAlert(){
        return(<div>
            <div className={css.modalTitle}>{this.state.title}</div>
            <div className={css.modalDesc}>{this.state.desc}</div>

            <div className={css.btnDiv}>
                <Button style={{float:"left",backgroundColor:"#29A6FF",color:"#fff"}}>查询</Button>
                <Button style={{float:"right",backgroundColor:"#29A6FF",color:"#fff"}}>查询</Button>
            </div>

        </div>);
    }
}

module.exports = AlertView;