/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-01 14:09:48 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-06 11:02:21
 */

import React, { Component } from 'react';
import { Modal } from 'antd';
import Froms from './Forms';
import {log} from 'debug';

class SignUpView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            mode: 0, // 弹框类型 对应title索引
            title: ['登录账号', '账户注册', '忘记密码']
        };
        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChangeMode = this.handleChangeMode.bind(this);
    }
    render() {
        const { visible, confirmLoading, title, mode } = this.state;
        return (
            <Modal
                title={title[mode]}
                visible={visible}
                onCancel={this.handleCancel}
                footer={null}
                style={{width:'100px'}}
                prefixCls="my-ant-modal"
            >
                <Froms mode={mode} handleChangeMode={this.handleChangeMode} onOK={this.handleOk}></Froms>
            </Modal>
        );
    }

    /**
     * 修改弹框展示内容
     * @param {0-2} mode 
     */
    handleChangeMode(mode){
        this.setState({
            mode
        });
    }

    /**
     * 打开模态框
     * @param {0-2} mode 
     */
    showModal(mode) {
        this.setState({
            mode,
            visible: true
        });
    }

    /**
     * 模态框确定回调
     */
    handleOk() {
        this.setState({
            visible: false
        });
    }

    /**
     * 模态框取消回调
     */
    handleCancel() {
        this.setState({
            visible: false
        });
    }

}

module.exports = SignUpView;
