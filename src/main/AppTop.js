/**
 * Created by lixifeng on 17/3/24.
 */
import React, { Component } from 'react';
import { history } from 'react-router';
import { Button, Menu, Dropdown, Icon } from 'antd';
import { CookieHelp } from '../../lib/utils/index.js';
import Menus from './Menu';

import Sign from './body/component/SignView';
import Steps from './body/component/Steps';

import less from "./AppTop.less";

class page extends Component {

    constructor(props) {
        super(props);
        this.par = window.app_getPar(this);
        this.state = {
            step: this.par ? this.par.step : 0,
            isLogin: false
        };
        this.setLogin = this.setLogin.bind(this);

    }

    componentDidMount() {
        this.checkLogin();
    }

    render() {
        let { step, isLogin } = this.state;
        const menu = (
            <Menu>
                <Menu.Item>
                    <a onClick={() => {
                        window.app_open(this.props.root, '/Account', {
                            id: '112122323'
                        });
                    }}>用户中心</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={() => {
                        this.setState({
                            isLogin: false
                        });
                        CookieHelp.clearCookie();
                    }}>退出登录</a>
                </Menu.Item>
            </Menu>
        );
        return (
            <div className={less.head}>
                <div className={less.headContent}>
                    <img
                        onClick={() => {
                            log(this.props.root);
                            window.app_open(this.props.root, "/", null, "self");
                        }}
                        className={less.left}
                        src={require('../images/index_logo.png')}
                    />

                    {!step && <Menus {...this.props} />}
                    {step ?
                        <div className={`${less.right} ${less.step}`}>
                            <Steps step={step}></Steps>
                        </div>
                        :
                        <div className={less.right}>
                            <div className={less.rightItem} style={isLogin ? { marginRight: '44px' } : { marginRight: '30px' }}>
                                {
                                    !isLogin && <Button type="primary" className={less.login}
                                        onClick={() => this.modal.showModal(0)}
                                    >登录</Button>
                                }
                                {
                                    !isLogin && <Button type="primary" className={less.register}
                                        prefixCls='my-ant-btn'
                                        onClick={() => this.modal.showModal(1)}
                                    >注册</Button>
                                }
                                {
                                    isLogin && <Dropdown overlay={menu}>
                                        <span>
                                            Hi,
                                        <a className="ant-dropdown-link" href="#">对对对<Icon type="down" /></a>
                                        </span>
                                    </Dropdown>
                                }

                            </div>
                            <div className={less.rightItem}
                                title="开发测试：打开订单列表"
                                onClick={() => {
                                    // window.open("http://mvp.apin.com");
                                    window.app_open(this, "/OrderFormList", {
                                        data: {}
                                    }, "new");
                                }}
                            >
                                <font style={{ fontSize: 12, color: "#666" }}>客服电话  9:00~21:00</font>
                                <br />
                                <font style={{ fontSize: 16, color: "#34b0ff" }}>0571—58122998</font>
                            </div>
                        </div>}

                </div>
                <Sign ref={(modal) => this.modal = modal}></Sign>
            </div>
        );
    }

    setLogin(){
        this.setState({
            isLogin: true
        }, () => {
            //回显用户名
        });
    }

    /**
     * 检测是否已经登录
     */
    checkLogin() {
        const user = CookieHelp.getUserInfo();
        const isLogin = CookieHelp.getCookieInfo('IS_LOGIN');
        log("---Apptop-----Authorization");
        log(user);
        if(user && user.Authorization && isLogin) this.setLogin();
    }
}
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;