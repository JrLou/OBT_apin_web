import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';
import css from './account.less';
import { formatArgs } from 'debug';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    }
};
const formTailLayout = {
    // labelCol: { span: 4 },
    wrapperCol: { span: 8, offset: 6 },
};

const Title = (props) => {
    return (
        <div>
            <div className={css.title}>{props.children}</div>
            <div className={css.line}></div>
        </div>
    );
};

class AccountForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isView: true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const { isView } = this.state;

        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        return (
            <Form prefixCls="my-ant-form" onSubmit={this.handleSubmit}>
                <Title>账号信息</Title>
                <FormItem prefixCls="my-ant-form"
                    {...formItemLayout}
                    label="账号名"
                    validateStatus={userNameError ? 'error' : ''}
                    help={userNameError || ''}
                >
                    {
                        isView ? <div>111</div> : getFieldDecorator('userName', {
                            rules: [{ required: true, message: 'Please select time!' }],
                        })(
                            <Input prefixCls="my-ant-input" />
                            )}
                </FormItem>
                <FormItem prefixCls="my-ant-form"
                    {...formItemLayout}
                    label="登录密码设置"
                >
                    {isView ? <div>222</div> : getFieldDecorator('pass', {
                        rules: [{ required: true, message: 'Please select time!' }],
                    })(
                        <Input prefixCls="my-ant-input" />
                        )}
                </FormItem>
                <FormItem prefixCls="my-ant-form"
                    {...formItemLayout}
                    label="绑定手机"
                >
                    {isView ? <div>18768142232</div> : getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Please select time!' }],
                    })(
                        <Input prefixCls="my-ant-input" />
                        )}
                </FormItem>
                <Title>基本信息</Title>
                <FormItem prefixCls="my-ant-form"
                    {...formItemLayout}
                    label="公司名称"
                >
                    {isView ? <div>222</div> : getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Please select time!' }],
                    })(
                        <Input prefixCls="my-ant-input" />
                        )}
                </FormItem>
                <FormItem prefixCls="my-ant-form"
                    {...formItemLayout}
                    label="联系人"
                >
                    {isView ? <div>222</div> : getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Please select time!' }],
                    })(
                        <Input prefixCls="my-ant-input" />
                        )}
                </FormItem>
                <FormItem prefixCls="my-ant-form"
                    {...formItemLayout}
                    label="地址"
                >
                    {isView ? <div>222</div> : getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Please select time!' }],
                    })(
                        <Input prefixCls="my-ant-input" />
                        )}
                </FormItem>
                <FormItem prefixCls="my-ant-form" {...formTailLayout}>
                    {
                        isView ?
                            <Button
                                prefixCls="my-ant-btn"
                                size="large"
                                type="primary"
                                disabled={hasErrors(getFieldsError())}
                                onClick={this.updateInfo}
                            >修改</Button>
                            : <Button
                                prefixCls="my-ant-btn"
                                size="large"
                                disabled={hasErrors(getFieldsError())}
                                onClick={this.handleSubmit}
                            >保存</Button>
                    }
                </FormItem>
            </Form>
        );
    }

    handleSubmit() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    updateInfo() {
        this.setState({
            isView: false
        }, () => {
            this.props.form.validateFields();
        });
    }

}

const WrappedAccountForm = Form.create()(AccountForm);


class Account extends Component {
    render() {

        return (
            <div className={css.account}>
                <div className={css.content}>
                    <WrappedAccountForm></WrappedAccountForm>
                </div>
            </div>
        );
    }
}

module.exports = Account;
