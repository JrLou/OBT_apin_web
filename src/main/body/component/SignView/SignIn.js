/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-03 15:35:46 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-07 16:38:45
 */

import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import CheckCode from './CheckCode';

import css from './sign.less';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class SignInForm extends Component {
    componentDidMount() {
        this.props.form.validateFields();
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, getFieldValue, isFieldTouched } = this.props.form;

        const accountError = isFieldTouched('account') && getFieldError('account');
        const mobileError = isFieldTouched('mobile') && getFieldError('mobile');
        const checkImgCodeError = isFieldTouched('checkImgCode') && getFieldError('checkImgCode');
        const codeError = isFieldTouched('code') && getFieldError('code');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const bdChargerError = isFieldTouched('bdCharger') && getFieldError('bdCharger');
        return (
            <Form prefixCls="my-ant-form" onSubmit={this.handleSubmit}>
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={accountError ? 'error' : ''}
                    help={accountError || ''}
                    label="账户名(不可修改)"
                >
                    {getFieldDecorator('account', {
                        rules: [{ required: true, message: '请输入账户名' }],
                    })(
                        <Input prefixCls="my-ant-input" placeholder="请输入账户名" />
                        )}
                </FormItem>
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={mobileError ? 'error' : ''}
                    help={mobileError || ''}
                    label="绑定手机"
                >
                    {getFieldDecorator('mobile', {
                        rules: [{ required: true, message: '请输入11位手机号' },
                        { pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/, message: '手机号格式不正确！' }],
                    })(
                        <Input prefixCls="my-ant-input" placeholder="请输入11位手机号" />
                        )}
                </FormItem>
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={checkImgCodeError ? 'error' : ''}
                    help={checkImgCodeError || ''}
                    label="验证码"
                >
                    {getFieldDecorator('checkImgCode', {
                        rules: [{ required: true, message: '请输入图形验证码' }],
                    })(
                        <Input prefixCls="my-ant-input" placeholder="请输入图形验证码" className={css.checkCodeImgInput} />
                        )}
                    <img src="http://placehold.it/98x36" alt="" className={css.checkCodeImg} />
                </FormItem>
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={codeError ? 'error' : ''}
                    help={codeError || ''}
                    label="验证码"
                >
                    {getFieldDecorator('code', {
                        rules: [{ required: true, message: '请输入验证码' }],
                    })(
                        <Input prefixCls="my-ant-input" placeholder="请输入验证码" className={css.checkCodeInput} />
                        )}
                    <CheckCode error={getFieldError('mobile')} />
                </FormItem>
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                    label="设置登录密码"
                >
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入8-16位数字、字母' },
                        { pattern: /^[0-9A-Za-z]{8,16}$/, message: '请输入8-16位数字、字母' }],
                    })(
                        <Input prefixCls="my-ant-input" placeholder="请输入8-16位数字、字母" />
                        )}
                </FormItem>
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={bdChargerError ? 'error' : ''}
                    help={bdChargerError || ''}
                    label="市场经理姓名"
                >
                    {getFieldDecorator('bdCharger')(
                        <Input prefixCls="my-ant-input" placeholder="请务必准确输入" />
                    )}
                </FormItem>
                <div className={css.tip}>请填写爱拼机的市场对接人信息，便于我们为您提供更好的服务（非必填）</div>
                <FormItem prefixCls="my-ant-form">
                    <Button
                        prefixCls="my-ant-btn"
                        type="primary"
                        htmlType="submit"
                        className={css.btnSubmit}
                        disabled={hasErrors(getFieldsError())}
                        onClick={this.props.onOK}
                    >注册并登录</Button>
                </FormItem>
                <div className={css.textRight}>已有登录账号？ <span className={css.toLogin} onClick={() => this.props.handleChangeMode(0)}>立即登录</span></div>
            </Form>
        );
    }
}

const WrappedSignInForm = Form.create()(SignInForm);

module.exports = WrappedSignInForm;
