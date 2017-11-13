import React, { Component } from 'react';
import { Form, Button, Input, Modal } from 'antd';
import css from './account.less';
import { formatArgs } from 'debug';
import { HttpTool, CookieHelp } from '../../../../lib/utils/index.js';
import Reset from '../component/SignView/Reset';

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
            isView: true, // 是否编辑 true预览模式 | false修改模式
            visible: false,
            accountID: '',
            account: '',
            password: '',
            mobile: '',
            companyName: '',
            contactName: '',
            address: '',
            id: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.updatePsw = this.updatePsw.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.updatePsw = this.updatePsw.bind(this);
    }

    componentDidMount() {
        HttpTool.request(HttpTool.typeEnum.POST, '/bm/memberapi/v1.1/memberInfo', (code, message, json, option) => {
            log("会员中心用户信息");
            log(option);
            const { account, password, mobile } = json;
            const { companyName, contactName, address, id } = option.option;// option返回是null，这样保错了，后面然后setState也不会运行了
            this.setState({
                accountID: json.id,
                account,
                password,
                mobile,
                companyName,
                contactName,
                address,
                id
            });
        }, () => {
        }, {
            });
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const { isView, account, password, mobile, companyName, contactName, address } = this.state;

        const accountError = isFieldTouched('account') && getFieldError('account');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const mobileError = isFieldTouched('mobile') && getFieldError('mobile');
        const companyNameError = isFieldTouched('companyName') && getFieldError('companyName');
        const contactNameError = isFieldTouched('contactName') && getFieldError('contactName');
        const addressError = isFieldTouched('address') && getFieldError('address');
        return (
            <div>
                <Title>账号信息</Title>
                <Form prefixCls="my-ant-form" onSubmit={this.handleSubmit}>
                    <FormItem prefixCls="my-ant-form"
                        {...formItemLayout}
                        label="账号名"
                    >
                        <div>{account}</div>
                    </FormItem>
                    <FormItem prefixCls="my-ant-form"
                        {...formItemLayout}
                        label="登录密码设置"
                        validateStatus={passwordError ? 'error' : ''}
                        help={passwordError || ''}
                    >
                        <div>******<span style={{ float: 'right', cursor: 'pointer' }} onClick={() =>
                            this.setState({
                                visible: true
                            })
                        }>修改</span></div>
                    </FormItem>
                    <FormItem prefixCls="my-ant-form"
                        {...formItemLayout}
                        label="绑定手机"
                    >
                        <div>{mobile}</div>
                    </FormItem>
                </Form>
                <Title>基本信息</Title>
                <Form>
                    <FormItem prefixCls="my-ant-form"
                        {...formItemLayout}
                        label="公司名称"
                    >
                        {isView ? <div>{companyName}</div> : getFieldDecorator('companyName', {
                            initialValue: companyName
                        })(
                            <Input prefixCls="my-ant-input" />
                            )}
                    </FormItem>
                    <FormItem prefixCls="my-ant-form"
                        {...formItemLayout}
                        label="联系人"
                    >
                        {isView ? <div>{contactName}</div> : getFieldDecorator('contactName', {
                            initialValue: contactName
                        })(
                            <Input prefixCls="my-ant-input" />
                            )}
                    </FormItem>
                    <FormItem prefixCls="my-ant-form"
                        {...formItemLayout}
                        label="地址"
                    >
                        {isView ? <div>{address}</div> : getFieldDecorator('address', {
                            initialValue: address
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
                                    onClick={this.updateInfo}
                                >修改</Button>
                                : <Button
                                    prefixCls="my-ant-btn"
                                    size="large"
                                    type="primary"
                                    onClick={this.handleSubmit}
                                >保存</Button>
                        }
                    </FormItem>
                </Form>
                <Modal
                    prefixCls="my-ant-modal"
                    title="修改密码"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Reset updatePsw={this.updatePsw}></Reset>
                </Modal>
            </div>
        );
    }

    handleSubmit() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const { password, companyName, contactName, address } = values;
                const { id } = this.state;
                if (companyName != this.state.companyName
                    || contactName != this.state.contactName
                    || address != this.state.address
                ) {
                    HttpTool.request(HttpTool.typeEnum.POST, '/bm/memberapi/v1.1/modifyMemberInfo', (code, message, json, option) => {
                        this.setState({
                            isView: true
                        });
                    }, () => {
                    }, {
                            address,
                            companyName,
                            contactName,
                            id
                        });
                }

            }
        });
    }

    handleOk() {
        this.setState({
            visible: false,
        });
    }
    handleCancel() {
        this.setState({
            visible: false,
        });
    }

    /**
     * 更改密码
     * @param {*} option 
     * @param {*} password 
     */
    updatePsw(option, password) {
        const { accountID } = this.state;
        HttpTool.request(HttpTool.typeEnum.POST, '/bm/memberapi/v1.1/users/updatePassword', (code, message, json, option) => {

        }, () => {
        }, {
                id: accountID,
                option, password
            });
    }

    /**
     * 设置为修改模式
     */
    updateInfo() {
        this.setState({
            isView: false
        }, () => {
            this.props.form.validateFields();
        });
    }

}

const WrappedAccountForm = Form.create({
    onValuesChange: (props, values) => log(values)
})(AccountForm);


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
