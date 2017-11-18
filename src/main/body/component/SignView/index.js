/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-01 14:09:48 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-18 15:33:01
 */

import React, { Component } from 'react';
import { Modal } from 'antd';
import Forms from './Forms';
import { CookieHelp } from '../../../../../lib/utils/index';

class SignUpView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            mode: 0, // 弹框类型 对应title索引
            title: ['登录账号', '账户注册', '忘记密码'],
            callback: null
        };
        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChangeMode = this.handleChangeMode.bind(this);
    }

    render() {
        const { visible, confirmLoading, title, mode, callback } = this.state;
        return (
            <Modal
                title={title[mode]}
                visible={visible}
                // key={(Math.random()*100000).toFixed()}
                onCancel={this.handleCancel}
                footer={null}
                style={{ width: '100px' }}
                prefixCls="my-ant-modal"
                afterClose={() => {
                    const user = CookieHelp.getUserInfo();
                    const isLogin = CookieHelp.getCookieInfo('IS_LOGIN');
                    if (user && user.Authorization && isLogin && callback && (typeof(callback) == 'function')) {
                        callback();
                    }
                }}
            >
                <Forms
                    mode={mode}
                    handleChangeMode={this.handleChangeMode}
                    onOK={this.handleOk}
                    setLogin={this.props.setLogin}
                    callback={(e) => this.loginCallback = e}
                ></Forms>
            </Modal>
        );
    }

    /**
     * 修改弹框展示内容
     * @param {*} mode 
     */
    handleChangeMode(mode) {
        this.setState({
            mode
        });
    }

    /**
     * 打开模态框
     * @param {*} mode 
     */
    showModal(mode, callback) {
        this.setState({
            mode,
            visible: true,
            callback
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
