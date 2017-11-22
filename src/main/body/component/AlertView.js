/**
 * Created by apin on 2017/11/17.
 */
import React, { Component } from 'react';
import {
    Button,
    Modal,
} from 'antd';
import css from './AlertView.less';

/**
 * visible:是否显示 不需要传值
 * typeIndex 当一个界面过多调用此modal时 typeIndex为其索引
 * json 用来传值 一般与typeIndex同时使用
 * title 标题
 * desc 提示描述
 * con 提示内容
 * hideCancel 隐藏取消按钮
 * okText 确定按钮的文字
 * noText 取消按钮的文字
 */
class AlertView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:props.visible?props.visible:false,
            typeIndex:props.typeIndex?props.typeIndex:0,
            json:props.json?props.json:{},
            title:props.title?props.title:"提示",
            desc:props.desc?props.desc:"",
            con:props.con?props.con:"",
            hideCancel:props.hideCancel?props.hideCancel:false,
            okText:props.okText?props.okText:'是',
            noText:props.noText?props.noText:'否',
        };
    }
    showModal(option) {
        option = option?option:{};
        this.setState({
            visible:true,
            title:option.title?option.title:"提示",
            desc:option.desc?option.desc:"",
            con:option.con?option.con:"",
            typeIndex:option.typeIndex?option.typeIndex:0,
            json:option.json?option.json:{},
            hideCancel:option.hideCancel?option.hideCancel:false,
            okText:option.okText?option.okText:'是',
            noText:option.noText?option.noText:'否',
        });
    }

    render() {
        var {callBack,cancelCallBack}=this.props;
        return (<Modal prefixCls={'my-ant-modal'}
                       width="450"
                       visible={this.state.visible}
                       onCancel={()=>{
                           this.handleCancel();
                       }}
                       footer={null}>
            <div className={css.modalTitle}>{this.state.title}</div>
            <div className={css.modalDesc}>{this.state.desc}</div>
            <div className={css.modalCon}>{this.state.con}</div>
            <div className={css.btnDiv}>
                <Button type="primary"
                        className={this.state.hideCancel?css.centerBtn:css.btn}
                        onClick={()=>{
                            this.handleOk(callBack);
                        }}>{this.state.okText}</Button>
                <Button className={this.state.hideCancel?css.hidden:css.refBtn}
                        onClick={()=>{
                            this.handleCancel(cancelCallBack);
                        }}>{this.state.noText}</Button>
            </div>
        </Modal>);
    }
    handleOk(callBack){
        this.setState({
            visible:false,
        },()=>{
            if (callBack){
                callBack(this.state.typeIndex,this.state.json);
            }
        });
    }
    handleCancel(cancelCallBack){
        this.setState({
            visible:false,
        },()=>{
            if (cancelCallBack){
                cancelCallBack();
            }
        });
    }
}
module.exports = AlertView;