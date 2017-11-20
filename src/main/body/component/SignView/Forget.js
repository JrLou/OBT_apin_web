/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-03 15:26:13 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-20 14:13:57
 */

import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import md5 from 'md5';
import CheckCode from './CheckCode';
import { HttpTool, CookieHelp } from '../../../../../lib/utils/index.js';
import { loginPromise, getLoginCodePromise, defaultLoginPromise, validateLoginPromise } from './LoginAction';

import css from './sign.less';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ForgetForm extends Component {
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
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldValue, setFields } = this.props.form;
        const { isShowPic, picCode, loading } = this.state;

        // Only show error after a field is touched.
        const mobileError = isFieldTouched('mobile') && getFieldError('mobile');
        const optionError = isFieldTouched('option') && getFieldError('option');
        const picCodeError = isFieldTouched('picCode') && getFieldError('picCode');
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
                        { pattern: /^(1)\d{10}$/, message: '手机号格式不正确！' }
                        ],
                    })(
                        <Input prefixCls="my-ant-input" placeholder="请输入11位手机号" />
                        )}
                </FormItem>
                {
                    isShowPic && <FormItem
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
                                            validateLoginPromise({ picCode: value, mobile, type: 2 })
                                                .then((data) => callback())
                                                .catch((data) => callback(data));
                                        });
                                    }
                                },
                            ],
                        })(
                            <Input prefixCls='my-ant-input' placeholder="请输入图形验证码" className={css.checkCodeImgInput} />
                            )}
                        <img src={picCode} alt="" style={{ cursor: 'pointer' }} className={css.checkCodeImg} onClick={() => {
                            this.getCode(() => this.getCodeAction(true));
                            validateLoginPromise({
                                picCode: getFieldValue('picCode'),
                                mobile: getFieldValue('picCode'), type: 2
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
                    </FormItem>
                }
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
                    <CheckCode ref="code" error={isShowPic && !getFieldValue('picCode') || getFieldError('mobile') || getFieldError('picCode')} getCode={() => this.getCode(this.getCodeAction)} />
                </FormItem>
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                    label="设定密码"
                >
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码!' },
                        { pattern: /^[0-9A-Za-z]{8,16}$/, message: '请输入8-16位数字、字母' },
                        ],
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
                        { pattern: /^[0-9A-Za-z]{8,16}$/, message: '请输入8-16位数字、字母' },
                        {
                            validator: (rule, value, callback) => {
                                const { getFieldValue } = this.props.form;
                                if (value && value !== getFieldValue('password')) {
                                    callback('两次输入不一致！');
                                }

                                callback();
                            }
                        }],
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
                        loading={loading}
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
        this.setState({
            loading: true
        });
        this.props.form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                const { mobile, option, password } = values;
                HttpTool.request(HttpTool.typeEnum.POST, '/bm/memberapi/v1.1/users/resetPassword', (code, message, json, option) => {
                    this.setState({
                        loading: false
                    });
                    message.success('修改成功');
                    this.props.handleChangeMode(0);
                }, (code, msg) => {
                    setTimeout(() => {
                        this.setState({
                            loading: false
                        });
                    }, 1000);
                    message.error(msg);
                }, {
                        account: mobile,
                        mobile,
                        option,
                        password: md5(password)
                    });
            }
        });
    }

    getCodeAction(isSendPic) {
        const { getFieldValue } = this.props.form;
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
                mobile, picCode: isSendPic ? "" : picCode, type: 2
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

const WrappedForgetForm = Form.create()(ForgetForm);

module.exports = WrappedForgetForm;
