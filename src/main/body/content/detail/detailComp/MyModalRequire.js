/**
 * Created by apin on 2017/11/6.
 */
/**
 * visible 控制是否显示
 * option{
 *      title:标题 默认undefine,
 *      desc:副标题 默认undefine,
 *      totalTitle:总计标题 默认undefine,
 *      sit:总计数 默认0,
 *      myNumTitle:填写标题 默认undefine,
 *      myNum:填写的数 默认为"",
 * }
 */

/**
 * 引入头文件 在render中写入
 * <MyModal ref={(a) => this.partnerDetail = a}
 callBack={(myNum)=>{
                        this.commitSit(myNum);
            }}/>

 callBack :回调函数 把输入结果值回调出去
 * 显示时调用 showModal(visible,option)
 * eg：this.partnerDetail.showModal(visible, option)
 */

import React, { Component } from 'react';
import {Button, Input, Modal,} from 'antd';
import css from './MyModalRequire.less';
class MyModalRequire extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            title:"",
            desc:"",
        };
    }
    showModal(visible,option) {
        option = option?option:{};
        this.setState({
            visible:visible,
            title:option.title?option.title:undefined,
            desc:option.desc?option.desc:undefined
        });
    }

    render() {
        var {callBack}=this.props;
        return (
            <Modal width="500" visible={this.state.visible}
                   onOk={()=>{
                       this.handleOk(callBack);
                   }}
                   onCancel={()=>{
                       this.handleCancel();
                   }}
                   footer={null}>
                <div className={css.modalTitle}>{this.state.title}</div>
                <div className={css.modalDesc}>{this.state.desc}</div>
                <div style={{height:5}}></div>
                <div className={css.line}></div>

                <div style={{height:"80px",backgroundColor:"lightBlue"}}></div>



                <div className={css.bottom}>
                    <Button type="primary" className={css.commit}
                            onClick={() => {
                                this.handleOk(callBack);
                            }}>提交需求</Button>
                </div>
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
}

module.exports = MyModalRequire;