/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-10 16:51:38 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-12-26 13:54:08
 */


import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import md5 from 'md5';
import CheckCode from './CheckCode';
import { HttpTool, CookieHelp } from '../../../../../lib/utils/index.js';
import { loginPromise } from './LoginAction';
import placeholder from '../../component/SignView/placeholder';

import css from './sign.less';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ResetForm extends Component {
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
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, getFieldValue, setFields, validateFields } = this.props.form;
        const { loading } = this.state;

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
                        rules: [{ required: true, message: '请输入密码' },
                        { pattern: /^[0-9A-Za-z]{8,16}$/, message: '请输入8-16位数字、字母' }],
                    })(
                        placeholder(<Input prefixCls="my-ant-input" type="password" placeholder="请输入8-16位数字、字母" maxLength="16" />)
                        )}
                </FormItem>
                <FormItem
                    prefixCls="my-ant-form"
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                    label="设定密码"
                >
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码' },
                        { pattern: /^[0-9A-Za-z]{8,16}$/, message: '请输入8-16位数字、字母' },
                        {
                            validator: (rule, value, callback) => {
                                const confirmPsw = getFieldValue('confirmPsw');
                                if (confirmPsw) {
                                    validateFields(['confirmPsw'], { force: true });
                                }

                                callback();
                            }
                        }
                        ],
                    })(
                        placeholder(<Input prefixCls="my-ant-input"
                            type="password"
                            placeholder="请输入8-16位数字、字母"
                            maxLength="16"
                        />)
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
                                if (value && value !== getFieldValue('password')) {
                                    callback('两次输入不一致');
                                }

                                callback();
                            }
                        }],
                    })(
                        placeholder(<Input prefixCls="my-ant-input"
                            type="password"
                            placeholder="请再次输入密码"
                            maxLength="16"
                        />)
                        )}
                </FormItem>
                <FormItem prefixCls="my-ant-form">
                    <Button
                        prefixCls="my-ant-btn"
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className={css.btnSubmitSmall}
                        disabled={hasErrors(getFieldsError())}
                        style={{ width: '100%' }}
                    >提交</Button>
                </FormItem>
                <div>
                </div>
            </Form>
        );
    }

    handleSubmit(e) {
        this.setState({
            loading: true
        });
        e.preventDefault();
        setTimeout(() => {
            const { loading } = this.state;
            if (loading) {
                this.setState({
                    loading: false
                });
            }
        }, 1000);
        this.props.form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const { option, password } = values;
                this.props.updatePsw(option, password);
            }
        });
    }

}

const WrappedResetForm = Form.create()(ResetForm);

module.exports = WrappedResetForm;
