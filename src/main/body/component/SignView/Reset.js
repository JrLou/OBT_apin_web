/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-10 16:51:38 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-14 14:20:25
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

class ResetForm extends Component {
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
        const optionError = isFieldTouched('option') && getFieldError('option');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const confirmPswError = isFieldTouched('confirmPsw') && getFieldError('confirmPsw');

        return (
            <Form prefixCls="my-ant-form" onSubmit={this.handleSubmit}>
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={optionError ? 'error' : ''}
                    help={optionError || ''}
                    label="旧密码"
                >
                    {getFieldDecorator('option', {
                        rules: [{ required: true, message: '请输入密码!' },
                        { pattern: /^[0-9A-Za-z]{8,16}$/, message: '请输入8-16位数字、字母' }],
                    })(
                        <Input prefixCls="my-ant-input" type="password" placeholder="请输入8-16位数字、字母" />
                        )}
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
                        htmlType="submit"
                        className={css.btnSubmitSmall}
                        disabled={hasErrors(getFieldsError())}
                        style={{ width: '100%' }}
                    >提交</Button>
                </FormItem>
            </Form>
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const { option, password } = values;
                this.props.updatePsw(option, password);
            }
        });
    }

    getCodeAction() {
        const { getFieldValue } = this.props.form;
        const mobile = getFieldValue('mobile');
        const picCode = getFieldValue('picCode') || '';
        HttpTool.request(HttpTool.typeEnum.POST, '/bm/memberapi/v1.1/getSmsCode', (code, message, json, option) => {
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


        // if (user) {
        //     callback();
        // } else {
        //     getLoginCodePromise(defaultAccount, 0).then((data) =>
        //         loginPromise(defaultAccount, defaultPwd, data)
        //     ).then((data) => {
        //         data.Authorization = data.accessToken;
        //         CookieHelp.saveUserInfo(data);
        //         callback();
        //     }).catch((error) => {
        //         log(error);
        //     });
        // }
    }
}

const WrappedResetForm = Form.create()(ResetForm);

module.exports = WrappedResetForm;
