/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-03 15:35:46 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-23 09:48:03
 */

import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import md5 from 'md5';

import { HttpTool, CookieHelp } from '../../../../../lib/utils/index.js';
import CheckCode from './CheckCode';
import { validateLoginPromise, defaultLoginPromise, loginPromise, getLoginCodePromise } from './LoginAction';

import css from './sign.less';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class SignInForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowPic: false,// 是否显示图形验证码
            picCode: '',//图片base64
            loading: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getCode = this.getCode.bind(this);
        this.getCodeAction = this.getCodeAction.bind(this);
        this.accessToken = '';
        this.data = '';
    }
    componentDidMount() {
        this.props.form.validateFields();
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, getFieldValue, isFieldTouched, setFields } = this.props.form;

        const { isShowPic, picCode, loading } = this.state;

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
                        validateFirst: true,
                        rules: [{ required: true, message: '请输入账户名' },
                        { pattern: /^[0-9A-Za-z]{6,20}$/, message: '请输入6-20位数字、字母' },
                        {
                            validator: (rule, value, callback) => {
                                this.getCode(() => {
                                    validateLoginPromise({ account: value, type: 1 })
                                        .then((data) => callback())
                                        .catch((data) => callback(data));
                                });
                            }
                        }
                        ],
                    })(
                        <Input prefixCls="my-ant-input" placeholder="请输入6-20位字母或数字" />
                        )}
                </FormItem>
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={mobileError ? 'error' : ''}
                    help={mobileError || ''}
                    label="绑定手机"
                >
                    {getFieldDecorator('mobile', {
                        validateFirst: true,
                        rules: [{ required: true, message: '请输入11位手机号' },
                        { pattern: /^(1)\d{10}$/, message: '手机格式不正确' },
                        {
                            validator: (rule, value, callback) => {
                                this.getCode(() => {
                                    validateLoginPromise({ mobile: value, type: 1 })
                                        .then((data) => callback())
                                        .catch((data) => callback(data));
                                });
                            }
                        }
                        ],
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
                        validateFirst: true,
                        rules: [
                            { required: true, message: '请输入图形验证码' },
                            {
                                validator: (rule, value, callback) => {
                                    const mobile = getFieldValue('mobile');
                                    this.getCode(() => {
                                        validateLoginPromise({ picCode: value, mobile, type: 1 })
                                            .then((data) => callback())
                                            .catch((data) => callback(data));
                                    });
                                }
                            }
                        ],
                    })(
                        <Input prefixCls="my-ant-input" placeholder="请输入图形验证码" className={css.checkCodeImgInput} />
                        )}
                    <img src={picCode} alt="" style={{ cursor: 'pointer' }} className={css.checkCodeImg} onClick={() => {
                        this.getCode(() => this.getCodeAction(true));
                        validateLoginPromise({
                            picCode: getFieldValue('picCode'),
                            mobile: getFieldValue('picCode'), type: 1
                        })
                            .then((data) => { })
                            .catch((data) => {
                                setFields({
                                    picCode: {
                                        value: '',
                                        errors: [new Error(data)],
                                    },
                                });
                            });
                    }} />
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
                    <CheckCode ref="code" error={isShowPic && !getFieldValue('picCode') || getFieldError('mobile') || getFieldError('picCode')} getCode={() => this.getCode(this.getCodeAction)} />
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
                        <Input prefixCls="my-ant-input" type="password" placeholder="请输入8-16位数字、字母" autoComplete="new-password" />
                        )}
                </FormItem>
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={bdChargerError ? 'error' : ''}
                    help={bdChargerError || ''}
                    label="市场经理姓名"
                >
                    {getFieldDecorator('bdCharger',{
                        rules: [{ max: 30, message: '最多输入30位' }],
                    })(
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
                        loading={loading}
                    // onClick={this.props.onOK}
                    >注册并登录</Button>
                </FormItem>
                <div className={css.textRight}>已有登录账号？ <span className={css.toLogin} onClick={() => this.props.handleChangeMode(0)}>立即登录</span></div>
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
                const { account, bdCharger, code, mobile, password } = values;
                HttpTool.request(HttpTool.typeEnum.POST, '/bm/memberapi/v1.1/addMember', (code, message, json, option) => {
                    getLoginCodePromise(account, 0).then((data) => {
                        this.setState({
                            loading: false
                        });
                        loginPromise(account, md5(password), data).then((data) => {
                            // 获取注册验证码也会调登录接口 保存APIN_USER token
                            // IS_LOGIN判断是否真的登录
                            CookieHelp.saveCookieInfo('IS_LOGIN', true);
                            this.props.setLogin();
                            this.props.onOK();
                        }).catch((error) => {
                            message.error(error);
                        });
                    });
                }, (code, message) => {
                    setTimeout(() => {
                        this.setState({
                            loading: false
                        });
                    }, 1000);
                    message.error(message);
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
    getCodeAction(isSendPic) {
        const { getFieldValue } = this.props.form;
        const account = getFieldValue('account');
        const mobile = getFieldValue('mobile');
        const picCode = getFieldValue('picCode') || '';
        HttpTool.request(HttpTool.typeEnum.POST, '/bm/memberapi/v1.1/getSmsCode', (code, message, json, option) => {
            // 测试
            if (json && json.length > 4) {
                this.setState({
                    isShowPic: true,
                    picCode: 'data:image/jpg;base64,' + json
                });
            } else {
                this.setState({
                    isShowPic: false
                });
                this.refs.code.autoTime(60);
            }
        }, (code, msg, json, option) => {
            message.error(msg);
        }, {
                account, mobile, picCode: isSendPic ? "" : picCode, type: 1
            });
    }

    /**
     * 获取初始token
     */
    getCode(callback) {
        const user = CookieHelp.getUserInfo();

        if (user) {
            callback();
        } else {
            defaultLoginPromise(0, callback, () => {
            });
        }
    }
}

const WrappedSignInForm = Form.create()(SignInForm);

module.exports = WrappedSignInForm;
