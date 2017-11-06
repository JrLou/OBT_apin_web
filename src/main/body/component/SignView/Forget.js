/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-03 15:26:13 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-06 15:21:28
 */

import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import CheckCode from './CheckCode';

import css from './sign.less';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ForgetForm extends Component {
    componentDidMount() {
        this.props.form.validateFields();
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        const telError = isFieldTouched('tel') && getFieldError('tel');
        const checkImgCodeError = isFieldTouched('checkImgCode') && getFieldError('checkImgCode');
        const checkCodeError = isFieldTouched('checkCode') && getFieldError('checkCode');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const confirmPswError = isFieldTouched('confirmPsw') && getFieldError('confirmPsw');

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    validateStatus={telError ? 'error' : ''}
                    help={telError || ''}
                    label="手机号"
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
                    label="验证码"
                >
                    {getFieldDecorator('checkImgCode', {
                        rules: [{ required: true, message: '请输入图形验证码' }],
                    })(
                        <Input placeholder="请输入图形验证码" className={css.checkCodeImgInput} />
                        )}
                    <img src="http://placehold.it/98x36" alt="" className={css.checkCodeImg} />
                </FormItem>
                <FormItem
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                    label="设定密码"
                >
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入8-16位数字、字母' }],
                    })(
                        <Input type="password" placeholder="请输入8-16位数字、字母" />
                        )}
                </FormItem>
                <FormItem
                    validateStatus={confirmPswError ? 'error' : ''}
                    help={confirmPswError || ''}
                    label="密码确认"
                >
                    {getFieldDecorator('confirmPsw', {
                        rules: [{ required: true, message: '请再次输入密码' }],
                    })(
                        <Input type="password" placeholder="请再次输入密码" />
                        )}
                </FormItem>
                <FormItem>
                    <Button
                        type="primary"
                        className={css.btnSubmitSmall}
                        onClick={() => this.props.handleChangeMode(0)}
                        style={{ marginRight: '16px' }}
                        ghost
                    >返回登录</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className={css.btnSubmitSmall}
                        disabled={hasErrors(getFieldsError())}
                        onClick={this.props.onOK}
                    >提交</Button>
                </FormItem>
                <div className={css.textRight}>还没有账号？ <span className={css.toLogin} onClick={() => this.props.handleChangeMode(1)}>立即前往注册</span></div>
            </Form>
        );
    }
}

const WrappedForgetForm = Form.create()(ForgetForm);

module.exports = WrappedForgetForm;
