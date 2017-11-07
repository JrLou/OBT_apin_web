/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-03 15:43:09 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-07 16:54:06
 */

import React, { Component } from 'react';

import { Form, Input, Button } from 'antd';
import CheckCode from './CheckCode';

import css from './sign.less';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

/**
 * 账号密码登录
 */
class AccountLoginForm extends React.Component {
    componentDidMount() {
        this.props.form.validateFields();
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        const accountError = isFieldTouched('account') && getFieldError('account');
        const signatureError = isFieldTouched('signature') && getFieldError('signature');
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
                    validateStatus={signatureError ? 'error' : ''}
                    help={signatureError || ''}
                >
                    {getFieldDecorator('signature', {
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
                        onClick={this.props.onOK}
                    >登录</Button>
                </FormItem>
            </Form>
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
}

const WrappedAccountLoginForm = Form.create()(AccountLoginForm);

/**
 * 验证码登录
 */
class MsgLoginForm extends React.Component {
    componentDidMount() {
        this.props.form.validateFields();
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        const accountError = isFieldTouched('account') && getFieldError('account');
        const checkImgCodeError = isFieldTouched('checkImgCode') && getFieldError('checkImgCode');
        const signatureError = isFieldTouched('signature') && getFieldError('signature');
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
                <FormItem
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
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={signatureError ? 'error' : ''}
                    help={signatureError || ''}
                >
                    {getFieldDecorator('signature', {
                        rules: [{ required: true, message: '请输入验证码' }],
                    })(
                        <Input prefixCls='my-ant-input' placeholder="请输入验证码" className={css.checkCodeInput} />
                        )}
                    <CheckCode error={getFieldError('tel')} />
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

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
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
                        <WrappedAccountLoginForm onOK={this.props.onOK} />
                        : <WrappedMsgLoginForm onOK={this.props.onOK} />
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
