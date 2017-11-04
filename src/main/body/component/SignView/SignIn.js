/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-03 15:35:46 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-03 19:38:33
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
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const telError = isFieldTouched('tel') && getFieldError('tel');
        const checkImgCodeError = isFieldTouched('checkImgCode') && getFieldError('checkImgCode');
        const checkCodeError = isFieldTouched('checkCode') && getFieldError('checkCode');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const managerError = isFieldTouched('manager') && getFieldError('manager');
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    validateStatus={userNameError ? 'error' : ''}
                    help={userNameError || ''}
                    label="账户名(不可修改)"
                >
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '请输入账户名' }],
                    })(
                        <Input placeholder="请输入账户名" />
                        )}
                </FormItem>
                <FormItem
                    validateStatus={telError ? 'error' : ''}
                    help={telError || ''}
                    label="绑定手机"
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
                    <img src="http://placehold.it/98x32" alt="" className={css.checkCodeImg} />
                </FormItem>
                <FormItem
                    validateStatus={checkCodeError ? 'error' : ''}
                    help={checkCodeError || ''}
                    label="验证码"
                >
                    {getFieldDecorator('checkCode', {
                        rules: [{ required: true, message: '请输入验证码' }],
                    })(
                        <Input placeholder="请输入验证码" className={css.checkCodeInput} />
                        )}
                    <CheckCode />
                </FormItem>
                <FormItem
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                    label="设置登录密码"
                >
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入8-16位数字、字母' }],
                    })(
                        <Input placeholder="请输入8-16位数字、字母" />
                        )}
                </FormItem>
                <FormItem
                    validateStatus={managerError ? 'error' : ''}
                    help={managerError || ''}
                    label="市场经理姓名"
                >
                    {getFieldDecorator('manager')(
                        <Input placeholder="请务必准确输入" />
                    )}
                </FormItem>
                <div className={css.tip}>请填写爱拼机的市场对接人信息，便于我们为您提供更好的服务（非必填）</div>
                <FormItem>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className={css.btnSubmit}
                        disabled={hasErrors(getFieldsError())}
                        onClick={this.props.onOK}
                    >注册并登录</Button>
                </FormItem>
                <div className={css.textRight}>已有登录账号？ <span className={css.toLogin} onClick={()=>this.props.handleChangeMode(0)}>立即登录</span></div>                
            </Form>
        );
    }
}

const WrappedSignInForm = Form.create()(SignInForm);

module.exports = WrappedSignInForm;
