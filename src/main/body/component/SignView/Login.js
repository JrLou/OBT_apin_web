/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-03 15:43:09 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-18 12:34:19
 */

import React, { Component } from 'react';

import { Form, Input, Button, message } from 'antd';
import md5 from 'md5';
import CheckCode from './CheckCode';
import { loginPromise, getLoginCodePromise, defaultLoginPromise } from './LoginAction';

import { CookieHelp, HttpTool } from '../../../../../lib/utils/index.js';

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
        const { loading } = this.state;

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
                        validateFirst: true,
                        rules: [{ required: true, message: '请输入用户名!' },
                        {
                            validator: (rule, value, callback) => {
                                if (/^[0-9A-Za-z]{6,20}$/.test(value) || /^(1)\d{10}$/.test(value)) {
                                    callback();
                                } else {
                                    callback('请输入手机号或者6-20位字母或数字账户名');
                                }
                            }
                        }
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
                        loading={loading}
                    >登录</Button>
                </FormItem>
            </Form>
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({
            loading: true
        });
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { account, password } = values;
                getLoginCodePromise(account, 0).then((data) => {
                    return loginPromise(account, md5(password), data);
                }
                ).then((data) => {
                    this.setState({ loading: false });
                    // 获取注册验证码也会调登录接口 保存APIN_USER token
                    // IS_LOGIN判断是否真的登录
                    CookieHelp.saveCookieInfo('IS_LOGIN', true);
                    this.props.setLogin();
                    if (this.props.callback && typeof (this.props.callback) === 'function')
                        this.props.callback(1);
                    this.props.onOK();
                }).catch((error) => {
                    setTimeout(() => {
                        this.setState({
                            loading: false
                        });
                    }, 1000);
                    message.error(error);
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
            isShowPic: false,// 是否显示图形验证码
            picCode: '',//图片base64
            loading: false
        };
        this.getCode = this.getCode.bind(this);
        this.getCodeAction = this.getCodeAction.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.form.validateFields();
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const { loading } = this.state;

        const accountError = isFieldTouched('account') && getFieldError('account');
        const picCodeError = isFieldTouched('picCode') && getFieldError('picCode');
        const passwordError = isFieldTouched('password') && getFieldError('password');

        const { isShowPic, picCode } = this.state;
        return (
            <Form prefixCls="my-ant-form" onSubmit={this.handleSubmit}>
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={accountError ? 'error' : ''}
                    help={accountError || ''}
                >
                    {getFieldDecorator('account', {
                        validateFirst: true,
                        validateTrigger: 'onBlur',
                        rules: [{ required: true, message: '请输入11位手机号' },
                        { len: 11, message: '请输入11位手机号' },
                        { pattern: /^(1)\d{10}$/, message: '手机号格式不正确！' }
                        ],
                    })(
                        <Input prefixCls='my-ant-input' placeholder="请输入11位手机号" />
                        )}
                </FormItem>
                {
                    isShowPic && <FormItem
                        prefixCls="my-ant-form"
                        validateStatus={picCodeError ? 'error' : ''}
                        help={picCodeError || ''}
                    >
                        {getFieldDecorator('picCode', {
                            rules: [{ required: true, message: '请输入图形验证码' }],
                        })(
                            <Input prefixCls='my-ant-input' placeholder="请输入图形验证码" className={css.checkCodeImgInput} />
                            )}
                        <img src={picCode} alt="" className={css.checkCodeImg} />
                    </FormItem>
                }
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                >
                    {getFieldDecorator('password', {
                        validateFirst: true,
                        rules: [{ required: true, message: '请输入验证码' },
                        { len: 4, message: '请输入4位验证码' }],
                    })(
                        <Input prefixCls='my-ant-input' placeholder="请输入验证码" className={css.checkCodeInput} />
                        )}
                    <CheckCode ref="code" error={getFieldError('account')} getCode={() => this.getCode(this.getCodeAction)} />
                </FormItem>
                <FormItem prefixCls="my-ant-form">
                    <Button
                        prefixCls="my-ant-btn"
                        type="primary"
                        htmlType="submit"
                        className={css.btnSubmit}
                        disabled={hasErrors(getFieldsError())}
                        loading={loading}
                    >登录</Button>
                </FormItem>
            </Form>
        );
    }

    /**
     * 获取登录验证码
     */
    getCodeAction() {
        //     const { getFieldValue } = this.props.form;
        //     const mobile = getFieldValue('mobile');
        //     const picCode = getFieldValue('picCode') || '';
        //     HttpTool.request(HttpTool.typeEnum.POST, '/bm/memberapi/v1.1/getSmsCode', (code, message, json, option) => {
        //         // 测试
        //         if (json && json.length > 4) {
        //             this.setState({
        //                 isShowPic: true,
        //                 picCode: 'data:image/jpg;base64,' + json
        //             });
        //         } else {
        //             this.setState({
        //                 isShowPic: false
        //             });
        //         }
        //     }, (code, msg, json, option) => {
        //         message.error(msg);
        //     }, {
        //             mobile, picCode, type: 1
        //         });
    }

    // 获取登录码
    getCode(callback) {

        const { getFieldValue } = this.props.form;
        const account = getFieldValue('account');
        // const user = CookieHelp.getUserInfo();
        // log(user);

        // if (user) {
        //     callback();
        // } else {
        //     defaultLoginPromise(1, callback);
        // }

        getLoginCodePromise(account, 1).then((data) => {
            this.data = data;
            this.refs.code.autoTime(60);
        }).catch((msg) => {
            message.error(msg);
        });

    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({
            loading: true
        });
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { account, password } = values;
                const code = this.data;
                loginPromise(account, md5(password), code).then((data) => {
                    // 获取注册验证码也会调登录接口 保存APIN_USER token
                    // IS_LOGIN判断是否真的登录
                    CookieHelp.saveCookieInfo('IS_LOGIN', true);
                    this.props.setLogin();
                    this.props.onOK();
                    this.setState({
                        loading: false
                    });
                }).catch((msg) => {
                    if (msg == '密码错误') {
                        msg = '验证码错误';
                    }
                    setTimeout(() => {
                        this.setState({
                            loading: false
                        });
                    }, 1000);
                    message.error(msg);
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
                        <WrappedAccountLoginForm {...this.props} />
                        : <WrappedMsgLoginForm {...this.props} />
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
