/**
 * Created by apin on 2017/11/17.
 */
import React, { Component } from 'react';
import {
    Button,
    Modal,
} from 'antd';
import css from './AlertView.less';
class AlertView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            typeIndex:0,
            json:{},
            title:"",
            desc:"",
        };
    }
    showModal(option) {
        option = option?option:{};
        this.setState({
            visible:true,
            title:option.title?option.title:undefined,
            desc:option.desc?option.desc:undefined,
            typeIndex:option.typeIndex?option.typeIndex:0,
            json:option.json?option.json:{},
        });
    }

    render() {
        var {callBack}=this.props;
        return (<Modal prefixCls={'my-ant-modal'}
                       width="450"
                       visible={this.state.visible}
                       onCancel={()=>{
                           this.handleCancel();
                       }}
                       footer={null}>
            <div className={css.modalTitle}>{this.state.title}</div>
            <div className={css.modalDesc}>{this.state.desc}</div>
            <div className={css.btnDiv}>
                <Button type="primary"
                        className={css.btn}
                        onClick={()=>{
                            this.handleOk(callBack);
                        }}>是</Button>
                <Button className={css.refBtn}
                        onClick={()=>{
                            this.handleCancel();
                        }}>否</Button>
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
    handleCancel(){
        this.setState({
            visible:false,
        });
    }
}
module.exports = AlertView;