/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-03 15:26:13 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-10 16:32:07
 */

import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import md5 from 'md5';
import CheckCode from './CheckCode';
import { HttpTool, CookieHelp } from '../../../../../lib/utils/index.js';
import { loginPromise, getLoginCodePromise } from './LoginAction';

import css from './sign.less';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ForgetForm extends Component {
    constructor(props) {
        super(props);
        this.getCode = this.getCode.bind(this);
        this.getCodeAction = this.getCodeAction.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        this.props.form.validateFields();
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        const mobileError = isFieldTouched('mobile') && getFieldError('mobile');
        const optionError = isFieldTouched('option') && getFieldError('option');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const confirmPswError = isFieldTouched('confirmPsw') && getFieldError('confirmPsw');

        return (
            <Form prefixCls="my-ant-form" onSubmit={this.handleSubmit}>
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={mobileError ? 'error' : ''}
                    help={mobileError || ''}
                    label="手机号"
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
                    validateStatus={optionError ? 'error' : ''}
                    help={optionError || ''}
                    label="验证码"
                >
                    {getFieldDecorator('option', {
                        rules: [{ required: true, message: '请输入验证码' }],
                    })(
                        <Input prefixCls="my-ant-input" placeholder="请输入验证码" className={css.checkCodeInput} />
                        )}
                    <CheckCode error={getFieldError('tel')} getCode={() => this.getCode(this.getCodeAction)} />
                </FormItem>
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                    label="设定密码"
                >
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码!' },
                        { pattern: /^[0-9A-Za-z]{8,16}$/, message: '请输入8-16位数字、字母' }],
                    })(
                        <Input prefixCls="my-ant-input" type="password" placeholder="请输入8-16位数字、字母" />
                        )}
                </FormItem>
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={confirmPswError ? 'error' : ''}
                    help={confirmPswError || ''}
                    label="密码确认"
                >
                    {getFieldDecorator('confirmPsw', {
                        rules: [{ required: true, message: '请再次输入密码' },
                        { pattern: /^[0-9A-Za-z]{8,16}$/, message: '请输入8-16位数字、字母' }],
                    })(
                        <Input prefixCls="my-ant-input" type="password" placeholder="请再次输入密码" />
                        )}
                </FormItem>
                <FormItem prefixCls="my-ant-form">
                    <Button
                        prefixCls="my-ant-btn"
                        type="primary"
                        className={css.btnSubmitSmall}
                        onClick={() => this.props.handleChangeMode(0)}
                        style={{ marginRight: '16px' }}
                        ghost
                    >返回登录</Button>
                    <Button
                        prefixCls="my-ant-btn"
                        type="primary"
                        htmlType="submit"
                        className={css.btnSubmitSmall}
                        disabled={hasErrors(getFieldsError())}
                    >提交</Button>
                </FormItem>
                <div className={css.textRight}>还没有账号？ <span className={css.toLogin} onClick={() => this.props.handleChangeMode(1)}>立即前往注册</span></div>
            </Form>
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const { mobile, option, password } = values;
                HttpTool.request(HttpTool.typeEnum.POST, '/memberapi/v1.1/users/updatePassword', (code, message, json, option) => {
                    log(message);
                    log(json);
                }, () => {
                }, {
                        account: mobile,
                        mobile,
                        option,
                        password:md5(password)
                    });
            }
        });
    }

    getCodeAction() {
        const { getFieldValue } = this.props.form;
        const mobile = getFieldValue('mobile');
        const picCode = getFieldValue('picCode') || '';
        HttpTool.request(HttpTool.typeEnum.POST, '/memberapi/v1.1/getSmsCode', (code, message, json, option) => {
            // 测试
            if (json.length > 4) {
                this.setState({
                    isShowPic: true,
                    picCode: 'data:image/jpg;base64,' + json
                });
            }
        }, (code, message, json, option) => {
        }, {
                mobile, picCode, type: 2
            });
    }

    getCode(callback) {
        const defaultAccount = 'b3619ef5dc944e4aad02acc7c83b220d';
        const defaultPwd = '4b91884d9290981da047b4c85af35a39';
        const user = CookieHelp.getUserInfo();

        if (user) {
            log("1111");
            callback();
        } else {
            log("222");
            getLoginCodePromise(defaultAccount, 0).then((data) =>
                loginPromise(defaultAccount, defaultPwd, data)
            ).then((data) => {
                data.Authorization = data.accessToken;
                CookieHelp.saveUserInfo(data);
                callback();
            }).catch((error) => {
                log(error);
            });
        }
    }
}

const WrappedForgetForm = Form.create()(ForgetForm);

module.exports = WrappedForgetForm;
