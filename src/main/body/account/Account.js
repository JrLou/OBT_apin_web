import React, { Component } from 'react';
import { Form, Button, Input, Modal, message, Cascader, Icon } from 'antd';
import css from './account.less';
import { formatArgs } from 'debug';
import { HttpTool, CookieHelp } from '../../../../lib/utils/index.js';
import { AccoutInfoPromise } from '../component/SignView/LoginAction';
import Reset from '../component/SignView/Reset';
import md5 from 'md5';

const FormItem = Form.Item;
const { TextArea } = Input;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

function getValue(objStr) {
    return new Function("return " + objStr)();
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
    wrapperCol: { span: 18, offset: 6 },
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
            province: '',
            city: '',
            county: '',
            address: '',
            id: '',
            options: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.updatePsw = this.updatePsw.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        // 获取会员信息
        AccoutInfoPromise()
            .then((res) => {
                const { json, option } = res;
                const { account, password, mobile } = json;
                let { companyName, contactName, id, province, city, county, address } = option.option;// option返回是null，这样保错了，后面然后setState也不会运行了
                this.getArea(0, 'options');

                this.setState({
                    accountID: json.id,
                    account,
                    password,
                    mobile,
                    companyName,
                    contactName,
                    province, city, county,
                    address,
                    id,
                });

            })
            .catch(error => {
                message.error(error);
            });

    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const { isView, account, password, mobile, companyName, contactName, address, province, city, county } = this.state;

        const accountError = isFieldTouched('account') && getFieldError('account');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const mobileError = isFieldTouched('mobile') && getFieldError('mobile');
        const contactNameError = getFieldError('contactName');

        let zone = [];
        for (let item of [province, city, county]) {
            if (item) {
                zone.push(item);
            }
        }


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
                        <div>******<span style={{ cursor: 'pointer', color: '#29A6FF', marginLeft: '10px' }} onClick={() => {
                            this.setState({
                                visible: true
                            });
                        }
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
                {
                    isView ?
                        <Form>
                            <FormItem prefixCls="my-ant-form"
                                {...formItemLayout}
                                label="公司名称"
                            >
                                <div>{companyName}</div>
                            </FormItem>
                            <FormItem prefixCls="my-ant-form"
                                {...formItemLayout}
                                label="联系人"
                                validateStatus={contactNameError ? 'error' : ''}
                                help={contactNameError || ''}
                            >
                                <div>{contactName}</div>
                            </FormItem>
                            <FormItem prefixCls="my-ant-form"
                                {...formItemLayout}
                                label="地址"
                            >
                                <div>{province}{city}{county}{address}

                                </div>
                            </FormItem>
                            <FormItem prefixCls="my-ant-form" {...formTailLayout}>
                                <Button
                                    prefixCls="my-ant-btn"
                                    size="large"
                                    type="primary"
                                    onClick={this.updateInfo}
                                >修改</Button>
                            </FormItem>
                        </Form>
                        :
                        <Form>
                            <FormItem prefixCls="my-ant-form"
                                {...formItemLayout}
                                label="公司名称"
                                validateStatus={isFieldTouched('companyName') && getFieldError('companyName') ? 'error' : ''}
                                help={isFieldTouched('companyName') && getFieldError('companyName') || ''}
                            >
                                {getFieldDecorator('companyName', {
                                    initialValue: companyName,
                                    rules: [{
                                        max: 20,
                                        message: '公司名称最长不能超过20'
                                    }]
                                })(
                                    <Input prefixCls="my-ant-input" />
                                    )}
                            </FormItem>
                            <FormItem prefixCls="my-ant-form"
                                {...formItemLayout}
                                label="联系人"
                                validateStatus={isFieldTouched('contactName') && getFieldError('contactName') ? 'error' : ''}
                                help={isFieldTouched('contactName') && getFieldError('contactName') || ''}
                            >
                                {getFieldDecorator('contactName', {
                                    initialValue: contactName,
                                    rules: [{
                                        max: 20,
                                        message: '联系人最长不能超过20'
                                    }],
                                })(
                                    <Input prefixCls="my-ant-input" />
                                    )}
                            </FormItem>
                            <FormItem prefixCls="my-ant-form"
                                {...formItemLayout}
                                label="地址"
                            >
                                {getFieldDecorator('zone', {
                                })(
                                    <Cascader
                                        options={this.state.options}
                                        loadData={this.loadData}
                                        // onChange={this.onChange}
                                        changeOnSelect
                                        placeholder={Array.isArray(zone) && zone.length > 0 ? zone.join('/') : "请选择地区"}
                                    />
                                    )}
                            </FormItem>
                            <FormItem prefixCls="my-ant-form"
                                {...formTailLayout}
                                validateStatus={isFieldTouched('address') && getFieldError('address') ? 'error' : ''}
                                help={isFieldTouched('address') && getFieldError('address') || ''}
                            >

                                {getFieldDecorator('address', {
                                    initialValue: address,
                                    rules: [{
                                        max: 50,
                                        message: '最多输入50位'
                                    }],
                                })(
                                    <TextArea rows={4} placeholder="请输入详细地址" />
                                    )}
                            </FormItem>
                            <FormItem prefixCls="my-ant-form" {...formTailLayout}>
                                <Button
                                    prefixCls="my-ant-btn"
                                    size="large"
                                    type="primary"
                                    style={{ marginRight: '20px' }}
                                    disabled={hasErrors(getFieldsError())}
                                    onClick={this.handleSubmit}
                                >保存</Button>
                                <Button
                                    prefixCls="my-ant-btn"
                                    size="large"
                                    onClick={() => {
                                        this.setState({ isView: true });
                                    }}
                                >取消</Button>
                            </FormItem>
                        </Form>
                }

                <Modal
                    prefixCls="my-ant-modal"
                    title="修改密码"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <Reset updatePsw={this.updatePsw}></Reset>
                </Modal>
            </div>
        );
    }

    handleSubmit() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { password, companyName, contactName, zone, address } = values;
                let { id, province, city, county } = this.state;
                // if (companyName != this.state.companyName
                //     || contactName != this.state.contactName
                //     || address != this.state.address
                // ) {
                if (zone && Array.isArray(zone)) {
                    province = zone[0] || province;
                    city = zone[1] || city;
                    county = zone[2] || county;
                }

                HttpTool.request(HttpTool.typeEnum.POST, '/bm/memberapi/v1.1/modifyMemberInfo', (code, msg, json, option) => {
                    message.success("修改成功");
                    this.setState({
                        isView: true,
                        province,
                        city,
                        county,
                        companyName, contactName, address
                    });
                }, (code, msg) => {
                    message.error(msg);
                }, {
                        province,
                        city,
                        county,
                        address,
                        companyName,
                        contactName,
                        id
                    });
            }

            // }
        });
    }

    loadData(selectedOptions) {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        setTimeout(() => {
            this.getArea(targetOption.id, null, (children) => {
                targetOption.loading = false;
                targetOption.children = children;
                this.setState({
                    options: [...this.state.options]
                });
            });
        }, 500);
    }

    handleChange(key, value) {
        this.setState({
            [key]: value
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
        HttpTool.request(HttpTool.typeEnum.POST, '/bm/memberapi/v1.1/users/updatePassword', (code, msg, json, option) => {
            this.setState({
                visible: false,
            });
            message.success("修改成功");
        }, (code, msg) => {
            message.error(msg);
        }, {
                id: accountID,
                option: md5(option),
                password: md5(password)
            });
    }

    getArea(id, key, callback) {
        HttpTool.request(HttpTool.typeEnum.POST, '/bc/area/byPid/query', (code, msg, json, option) => {
            let res = json.map(item => {
                item.value = item.name;
                item.label = item.name;
                item.isLeaf = item.level == 3;
                return item;
            });
            if (key) {
                this.setState({
                    [key]: res
                });
            }
            if (callback && typeof (callback) == 'function') {
                callback(res);
            }
        }, (code, msg) => {
            message.error(msg);
        }, {
                pid: String(id)
            });

    }

    /**
     * 设置为修改模式
     */
    updateInfo() {
        const { province } = this.state;
        if (province && province.length == 0) {
            this.getArea(0, 'province');
        }
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
