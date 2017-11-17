import React, { Component } from 'react';
import { Form, Button, Input, Modal, message, Cascader, Dropdown, Menu, Icon } from 'antd';
import css from './account.less';
import { formatArgs } from 'debug';
import { HttpTool, CookieHelp } from '../../../../lib/utils/index.js';
import { AccoutInfoPromise } from '../component/SignView/LoginAction';
import Reset from '../component/SignView/Reset';
import md5 from 'md5';

const FormItem = Form.Item;

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

// const province = [{
//     value: '11',
//     label: 'Zhejiang'
// }, {
//     value: '22',
//     label: 'Jiangsu'
// }];



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
            id: '',
            area: {},
            province: [],
            city: [],
            zone: [],
            showProvince: '省',
            showCity: '市',
            showZone: '区',
            showAddr: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.updatePsw = this.updatePsw.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        // this.getArea(0, 'province');
        AccoutInfoPromise()
            .then((res) => {
                const { json, option } = res;
                const { account, password, mobile } = json;
                let { companyName, contactName, id, province, city, county, address } = option.option;// option返回是null，这样保错了，后面然后setState也不会运行了

                this.setState({
                    accountID: json.id,
                    account,
                    password,
                    mobile,
                    companyName,
                    contactName,
                    showProvince: province,
                    showCity: city,
                    showZone: county,
                    address,
                    id
                });

            })
            .catch(error => {
                message.error(error);
            });

    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const { isView, account, password, mobile, companyName, contactName, address, area, province, city, zone, showProvince, showCity, showZone, showAddr } = this.state;

        const accountError = isFieldTouched('account') && getFieldError('account');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const mobileError = isFieldTouched('mobile') && getFieldError('mobile');

        const provinceMenu = (
            <Menu className={css.drop}>
                {
                    province.map((item) =>
                        <Menu.Item key={item.id}>
                            <a onClick={() => {
                                this.handleChange('showProvince', item.name);
                                this.getArea(item.id, 'city');
                                this.setState({
                                    showCity: '',
                                    showZone: ''
                                });
                            }}>{item.name}</a>
                        </Menu.Item>

                    )
                }
            </Menu>
        );
        const cityMenu = (
            <Menu className={css.drop}>
                {
                    city.map((item) =>
                        <Menu.Item key={item.id}>
                            <a onClick={() => {
                                this.handleChange('showCity', item.name);
                                this.getArea(item.id, 'zone');
                                this.setState({
                                    showZone: ''
                                });
                            }}>{item.name}</a>
                        </Menu.Item>

                    )
                }
            </Menu>
        );
        const zoneMenu = (
            <Menu className={css.drop}>
                {
                    zone.map((item) =>
                        <Menu.Item key={item.id}>
                            <a onClick={() => {
                                this.handleChange('showZone', item.name);
                            }}>{item.name}</a>
                        </Menu.Item>

                    )
                }
            </Menu>
        );

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
                        <div>******<span style={{ float: 'right', cursor: 'pointer', color: '#29A6FF' }} onClick={() => {
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
                    isView ? <Form>
                        <FormItem prefixCls="my-ant-form"
                            {...formItemLayout}
                            label="公司名称"
                        >
                            <div>{companyName}</div>
                        </FormItem>
                        <FormItem prefixCls="my-ant-form"
                            {...formItemLayout}
                            label="联系人"
                            validateStatus={isFieldTouched('contactName') && getFieldError('contactName') ? 'error' : ''}
                            help={isFieldTouched('contactName') && getFieldError('contactName') || ''}
                        >
                            <div>{contactName}</div>
                        </FormItem>
                        <FormItem prefixCls="my-ant-form"
                            {...formItemLayout}
                            label="地址"
                        >
                            <div>{showProvince}{showCity}{showZone}{address}

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
                            >
                                {getFieldDecorator('companyName', {
                                    initialValue: companyName
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
                                        pattern: /^[\u4e00-\u9fa5]{2,6}$|^[a-zA-Z]{2,12}$/,
                                        message: '请输入姓名(汉字2-6个字或英文2-12个字符)'
                                    }],
                                })(
                                    <Input prefixCls="my-ant-input" />
                                    )}
                            </FormItem>
                            <FormItem prefixCls="my-ant-form"
                                {...formItemLayout}
                                label="地址"
                            >
                                <div>
                                    <Dropdown overlay={provinceMenu}>
                                        <Button className={css.dropdown}>
                                            {showProvince || '省'} <Icon type="down" />
                                        </Button>
                                    </Dropdown>
                                    <Dropdown overlay={cityMenu}>
                                        <Button className={css.dropdown}>
                                            {showCity || '市'} <Icon type="down" />
                                        </Button>
                                    </Dropdown>
                                    <Dropdown overlay={zoneMenu}>
                                        <Button className={css.dropdown}>
                                            {showZone || '区'} <Icon type="down" />
                                        </Button>
                                    </Dropdown>
                                    {getFieldDecorator('address', {
                                        initialValue: address
                                    })(
                                        <Input prefixCls="my-ant-input" />
                                        )}
                                </div>
                            </FormItem>
                            <FormItem prefixCls="my-ant-form" {...formTailLayout}>
                                <Button
                                    prefixCls="my-ant-btn"
                                    size="large"
                                    type="primary"
                                    style={{ marginRight: '20px' }}
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
                let { password, companyName, contactName, address } = values;
                const { id, showProvince, showCity, showZone } = this.state;
                // if (companyName != this.state.companyName
                //     || contactName != this.state.contactName
                //     || address != this.state.address
                // ) {
                HttpTool.request(HttpTool.typeEnum.POST, '/bm/memberapi/v1.1/modifyMemberInfo', (code, msg, json, option) => {
                    message.success("修改成功");
                    this.setState({
                        isView: true,
                        showProvince, showCity, showZone
                    });
                }, (code, msg) => {
                    message.error(msg);
                }, {
                        province: showProvince,
                        city: showCity,
                        county: showZone,
                        address,
                        companyName,
                        contactName,
                        id
                    });
                // }

            }
        });
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

    getArea(id, key) {
        HttpTool.request(HttpTool.typeEnum.POST, '/bc/area/byPid/query', (code, msg, json, option) => {
            // HttpTool.request(HttpTool.typeEnum.POST, '/area/byPid/query', (code, msg, json, option) => {
            let res = json.map(item => {
                item.value = item.id;
                item.label = item.name;
                return item;
            });
            if (key) {
                this.setState({
                    [key]: res
                });
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
