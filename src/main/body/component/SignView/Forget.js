/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-03 15:26:13 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-15 22:20:07
 */

import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import md5 from 'md5';
import CheckCode from './CheckCode';
import { HttpTool, CookieHelp } from '../../../../../lib/utils/index.js';
import { loginPromise, getLoginCodePromise, defaultLoginPromise } from './LoginAction';

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
            picCode: ''//图片base64
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
        const { isShowPic, picCode } = this.state;        

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
                        { pattern: /^(1)\d{10}$/, message: '手机号格式不正确！' },
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
                const { mobile, option, password } = values;
                HttpTool.request(HttpTool.typeEnum.POST, '/bm/memberapi/v1.1/users/resetPassword', (code, message, json, option) => {
                    message.success('修改成功');
                    this.props.handleChangeMode(0);
                }, (code, msg) => {
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

    getCodeAction() {
        const { getFieldValue } = this.props.form;
        const mobile = getFieldValue('mobile');
        const picCode = getFieldValue('picCode') || '';
        HttpTool.request(HttpTool.typeEnum.POST, '/bm/memberapi/v1.1/getSmsCode', (code, message, json, option) => {
            // 测试
            if (json && json && json.length > 4) {
                this.setState({
                    isShowPic: true,
                    picCode: 'data:image/jpg;base64,' + json
                });
            } else {
                this.setState({
                    isShowPic: false
                });
            }
        }, (code, message, json, option) => {
        }, {
                mobile, picCode, type: 2
            });
    }

    getCode(callback) {
        // const user = CookieHelp.getUserInfo();

        // if (user) {
        //     callback();
        // } else {
        //     defaultLoginPromise(1, () => callback());
        // }

        callback();


    }
}

const WrappedForgetForm = Form.create()(ForgetForm);

module.exports = WrappedForgetForm;
