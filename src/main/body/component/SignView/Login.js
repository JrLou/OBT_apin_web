/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-03 15:43:09 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-13 16:20:06
 */

import React, { Component } from 'react';

import { Form, Input, Button,message } from 'antd';
import md5 from 'md5';
import CheckCode from './CheckCode';
import { loginPromise, getLoginCodePromise } from './LoginAction';

import { CookieHelp } from '../../../../../lib/utils/index.js';

import css from './sign.less';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

/**
 * 账号密码登录
 */
class AccountLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        this.props.form.validateFields();
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        const accountError = isFieldTouched('account') && getFieldError('account');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        return (
            <Form prefixCls="my-ant-form" onSubmit={this.handleSubmit}>
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={accountError ? 'error' : ''}
                    help={accountError || ''}
                >
                    {getFieldDecorator('account', {
                        rules: [{ required: true, message: '请输入用户名!' }
                        ],
                    })(
                        <Input prefixCls='my-ant-input' placeholder="账号/手机号" />
                        )}
                </FormItem>
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                >
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码!' },
                        { pattern: /^[0-9A-Za-z]{8,16}$/, message: '请输入8-16位数字、字母' }],
                    })(
                        <Input prefixCls='my-ant-input' type="password" placeholder="请输入8-16位数字、字母" autoComplete="new-password" />
                        )}
                </FormItem>
                <FormItem prefixCls="my-ant-form">
                    <Button
                        prefixCls="my-ant-btn"
                        size="large"
                        type="primary"
                        htmlType="submit"
                        className={css.btnSubmit}
                        disabled={hasErrors(getFieldsError())}
                        onClick={this.login}
                    >登录</Button>
                </FormItem>
            </Form>
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { account, password } = values;
                this.setState({ loading: true });
                getLoginCodePromise(account,0).then((data) =>
                    loginPromise(account, md5(password), data)
                ).then((data) => {
                    this.setState({ loading: false });
                    this.props.setLogin();
                    this.props.onOK();
                }).catch((error) => {
                    message.error(error);
                    this.setState({ loading: false });
                });
            }
        });
    }
}

const WrappedAccountLoginForm = Form.create()(AccountLoginForm);

/**
 * 验证码登录
 */
class MsgLoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowPic: false
        };
        this.getCode = this.getCode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.form.validateFields();
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        const accountError = isFieldTouched('account') && getFieldError('account');
        const checkImgCodeError = isFieldTouched('checkImgCode') && getFieldError('checkImgCode');
        const passwordError = isFieldTouched('password') && getFieldError('password');

        const { isShowPic } = this.state;
        return (
            <Form prefixCls="my-ant-form" onSubmit={this.handleSubmit}>
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={accountError ? 'error' : ''}
                    help={accountError || ''}
                >
                    {getFieldDecorator('account', {
                        rules: [{ required: true, message: '请输入11位手机号' }, {
                            pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/, message: '手机号格式不正确！'
                        }],
                    })(
                        <Input prefixCls='my-ant-input' placeholder="请输入11位手机号" />
                        )}
                </FormItem>
                {
                    isShowPic && <FormItem
                        prefixCls="my-ant-form"
                        validateStatus={checkImgCodeError ? 'error' : ''}
                        help={checkImgCodeError || ''}
                    >
                        {getFieldDecorator('checkImgCode', {
                            rules: [{ required: true, message: '请输入图形验证码' }],
                        })(
                            <Input prefixCls='my-ant-input' placeholder="请输入图形验证码" className={css.checkCodeImgInput} />
                            )}
                        <img src="http://placehold.it/98x36" alt="" className={css.checkCodeImg} />
                    </FormItem>
                }
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                >
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入验证码' }],
                    })(
                        <Input prefixCls='my-ant-input' placeholder="请输入验证码" className={css.checkCodeInput} />
                        )}
                    <CheckCode error={getFieldError('account')} getCode={this.getCode} />
                </FormItem>
                <FormItem prefixCls="my-ant-form">
                    <Button
                        prefixCls="my-ant-btn"
                        type="primary"
                        htmlType="submit"
                        className={css.btnSubmit}
                        disabled={hasErrors(getFieldsError())}
                        onClick={this.props.onOK}
                    >登录</Button>
                </FormItem>
            </Form>
        );
    }

    // 获取登录码
    getCode() {
        const { getFieldValue } = this.props.form;
        const account = getFieldValue('account');
        getLoginCodePromise(account,1).then((data) => {
            this.data = data;
            CookieHelp.saveCookieInfo('LOGIN_CODE',data);
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const {account,password} = values;
                const code = this.data || CookieHelp.getCookieInfo('LOGIN_CODE');
                loginPromise(account,md5(password),code).then((data)=>{
                    this.props.onOK();
                }).catch((error) => {
                    message.error(error);
                    this.setState({ loading: false });
                });
            }
        });
    }
}

const WrappedMsgLoginForm = Form.create()(MsgLoginForm);


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 0, // 登录方式 0账号密码登录 | 1验证码登录
        };
    }
    render() {
        const { type } = this.state;
        return (
            <div className={css.login}>
                <ul className={`${css.clearfix} ${css.head}`}>
                    <li className={`${css.left} ${css.title} ${type === 0 && css.active}`} onClick={() => this.handleChangeType(0)}>账号密码登录</li>
                    <li className={`${css.right} ${css.title} ${type === 1 && css.active}`} onClick={() => this.handleChangeType(1)}>验证码登录</li>
                </ul>
                {
                    type === 0 ?
                        <WrappedAccountLoginForm onOK={this.props.onOK} setLogin={this.props.setLogin} />
                        : <WrappedMsgLoginForm onOK={this.props.onOK} setLogin={this.props.setLogin} />
                }
                <div className={`${css.clearfix} ${css.bottom}`}>
                    <div className={`${css.left} ${css.forget}`} onClick={() => this.props.handleChangeMode(2)}>忘记密码</div>
                    <div className={css.right} onClick={() => this.props.handleChangeMode(1)}>注册账号</div>
                </div>
            </div>
        );
    }
    handleChangeType(type) {
        this.setState({
            type
        });
    }
}

module.exports = Login;
