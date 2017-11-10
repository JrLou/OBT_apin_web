/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-03 15:35:46 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-09 21:57:03
 */

import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import md5 from 'md5';

import { HttpTool, CookieHelp } from '../../../../../lib/utils/index.js';
import CheckCode from './CheckCode';
import { loginPromise, getLoginCodePromise, validateLogin } from './LoginAction';

import css from './sign.less';
import { log } from 'debug';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class SignInForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowPic: false,// 是否显示图形验证码
            picCode: ''//图片base64
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getCode = this.getCode.bind(this);
        this.accessToken = '';
    }
    componentDidMount() {
        this.props.form.validateFields();
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, getFieldValue, isFieldTouched } = this.props.form;

        const { isShowPic, picCode } = this.state;

        const accountError = isFieldTouched('account') && getFieldError('account');
        const mobileError = isFieldTouched('mobile') && getFieldError('mobile');
        const picCodeError = isFieldTouched('picCode') && getFieldError('picCode');
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
                        rules: [{ required: true, message: '请输入账户名' },
                        {
                            validator: (rule, value, callback) => {
                                validateLogin('account', value)
                                .then((data) => callback(data))
                                .catch((data) => callback(data));
                            }
                        }
                        ],
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
                {isShowPic && <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={picCodeError ? 'error' : ''}
                    help={picCodeError || ''}
                    label="验证码"
                >
                    {getFieldDecorator('picCode', {
                        rules: [{ required: true, message: '请输入图形验证码' }],
                    })(
                        <Input prefixCls="my-ant-input" placeholder="请输入图形验证码" className={css.checkCodeImgInput} />
                        )}
                    <img src={picCode} alt="" className={css.checkCodeImg} />
                </FormItem>}
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
                    <CheckCode error={getFieldError('mobile')} getCode={this.getCode} time={10} />
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
                    // onClick={this.props.onOK}
                    >注册并登录</Button>
                </FormItem>
                <div className={css.textRight}>已有登录账号？ <span className={css.toLogin} onClick={() => this.props.handleChangeMode(0)}>立即登录</span></div>
            </Form>
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const { account, bdCharger, code, mobile, password } = values;
                HttpTool.request(HttpTool.typeEnum.POST, '/memberapi/v1.1/addMember', (code, message, json, option) => {
                }, () => {
                }, {
                        account,
                        bdCharger,
                        code,
                        mobile,
                        password: md5(password),
                        type: 1
                    });
            }
        });

    }

    /**
     * 获取注册验证码
     */
    getCodeAction() {
        const { getFieldValue } = this.props.form;
        const account = getFieldValue('account');
        const mobile = getFieldValue('mobile');
        const picCode = getFieldValue('picCode') || '';
        HttpTool.request(HttpTool.typeEnum.POST, '/memberapi/v1.1/getSmsCode', (code, message, json, option) => {
            this.setState({
                isShowPic: true,
                picCode: 'data:image/jpg;base64,' + json
            });
        }, (code, message, json, option) => {
        }, {
                account, mobile, picCode, type: 1
            });
    }

    /**
     * 获取初始token
     */
    getCode() {
        const defaultAccount = 'b3619ef5dc944e4aad02acc7c83b220d';
        const defaultPwd = '4b91884d9290981da047b4c85af35a39';
        const user = CookieHelp.getCookieInfo('APIN_INIT_USER');

        log("ssssssssssssss");
        log(user);
        // log(user.Authorization);
        log(typeof(user));

        if (user) {
            this.getCodeAction();
        } else {
            getLoginCodePromise(defaultAccount).then((data) =>
                loginPromise(defaultAccount, defaultPwd, data)
            ).then((data) => {
                log(data);
                data.Authorization = data.accessToken;
                CookieHelp.saveCookieInfo('APIN_INIT_USER',data);
                this.getCodeAction();
            }).catch((error) => {
                log(error);
            });
        }
    }
}

const WrappedSignInForm = Form.create()(SignInForm);

module.exports = WrappedSignInForm;
