/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-03 15:43:09 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-03 19:29:27
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
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    validateStatus={userNameError ? 'error' : ''}
                    help={userNameError || ''}
                >
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '请输入用户名!' }],
                    })(
                        <Input placeholder="账号/手机号" />
                        )}
                </FormItem>
                <FormItem
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                >
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码!' }],
                    })(
                        <Input type="password" placeholder="密码" autoComplete="new-password" />
                        )}
                </FormItem>
                <FormItem>
                    <Button
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

        const telError = isFieldTouched('tel') && getFieldError('tel');
        const checkImgCodeError = isFieldTouched('checkImgCode') && getFieldError('checkImgCode');
        const checkCodeError = isFieldTouched('checkCode') && getFieldError('checkCode');
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    validateStatus={telError ? 'error' : ''}
                    help={telError || ''}
                >
                    {getFieldDecorator('tel', {
                        rules: [{ required: true, message: '请输入11位手机号' }],
                    })(
                        <Input placeholder="请输入11位手机号" />
                        )}
                </FormItem>
                <FormItem
                    validateStatus={checkImgCodeError ? 'error' : ''}
                    help={checkImgCodeError || ''}
                >
                    {getFieldDecorator('checkImgCode', {
                        rules: [{ required: true, message: '请输入图形验证码' }],
                    })(
                        <Input placeholder="请输入图形验证码" className={css.checkCodeImgInput} />
                        )}
                    <img src="http://placehold.it/98x32" alt="" className={css.checkCodeImg} />
                </FormItem>
                <FormItem
                    validateStatus={checkCodeError ? 'error' : ''}
                    help={checkCodeError || ''}
                >
                    {getFieldDecorator('checkCode', {
                        rules: [{ required: true, message: '请输入验证码' }],
                    })(
                        <Input placeholder="请输入验证码" className={css.checkCodeInput} />
                        )}
                    <CheckCode />
                </FormItem>
                <FormItem>
                    <Button
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
            <div>
                <ul className={css.clearfix}>
                    <li className={`${css.left} ${type === 0 && css.active}`} onClick={() => this.handleChangeType(0)}>账号密码登录</li>
                    <li className={`${css.right} ${type === 1 && css.active}`} onClick={() => this.handleChangeType(1)}>验证码登录</li>
                </ul>
                {
                    type === 0 ?
                        <WrappedAccountLoginForm onOK={this.props.onOK} />
                        : <WrappedMsgLoginForm onOK={this.props.onOK} />
                }
                <div className={css.clearfix}>
                    <div className={css.left} onClick={()=>this.props.handleChangeMode(2)}>忘记密码</div>
                    <div className={css.right} onClick={()=>this.props.handleChangeMode(1)}>注册账号</div>
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
