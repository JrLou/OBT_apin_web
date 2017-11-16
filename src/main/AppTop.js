/**
 * Created by lixifeng on 17/3/24.
 */
import React, { Component } from 'react';
import { history } from 'react-router';
import { Button, Menu, Dropdown, Icon, message } from 'antd';
import { CookieHelp } from '../../lib/utils/index.js';
import { AccoutInfoPromise } from './body/component/SignView/LoginAction';
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
            isLogin: false,
            account: ''
        };
        this.setLogin = this.setLogin.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.checkLogin();
        window.modal = this.modal;
    }

    render() {
        let { step, isLogin, account } = this.state;
        const menu = (
            <Menu className={less.dropMenu}>
                <Menu.Item className={less.dropItem}>
                    <a className={less.center} onClick={() => {
                        window.app_open(this.props.root, '/Account', null);
                    }}>用户中心</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.logout}>退出登录</a>
                </Menu.Item>
            </Menu>
        );
        return (
            <div className={less.head}>
                <div className={less.headContent}>
                    <img
                        onClick={() => {
                            window.app_open(this.props.root, "/", null, "self");
                        }}
                        className={less.left}
                        src={require('../images/index_logo.png')}
                    />

                    {!step && isLogin && <Menus />}
                    {step ?
                        <div className={`${less.right} ${less.step}`}>
                            <Steps step={step}></Steps>
                        </div>
                        :
                        <div className={less.right}>
                            <div className={less.rightItem} style={isLogin ? { marginRight: '44px' } : { marginRight: '30px' }}>
                                {
                                    !isLogin && <Button type="primary" className={less.login}
                                        onClick={() => window.modal.showModal(0)}
                                    >登录</Button>
                                }
                                {
                                    !isLogin && <Button type="primary" className={less.register}
                                        prefixCls='my-ant-btn'
                                        onClick={() => this.modal.showModal(1)}
                                    >注册</Button>
                                }
                                {
                                    isLogin && <div className={less.drop}>
                                        Hi,
                                    <Dropdown overlay={menu}>
                                            <span>
                                                <a className="ant-dropdown-link" href="#">
                                                    <span className={less.name}>{account}</span>
                                                    <Icon type="up" />
                                                </a>
                                            </span>
                                        </Dropdown>
                                    </div>
                                }

                            </div>
                            <div className={less.rightItem}
                            >
                                <font style={{ fontSize: 12, color: "#666" }}>客服电话  9:00~21:00</font>
                                <br />
                                <font style={{ fontSize: 16, color: "#34b0ff" }}>0571—58122998</font>
                            </div>
                        </div>}

                </div>
                <Sign ref={(modal) => this.modal = modal} setLogin={this.setLogin}></Sign>
            </div>
        );
    }

    /**
     * 设置登录状态
     */
    setLogin() {
        this.setState({
            isLogin: true
        }, () => {
            //回显用户名
            AccoutInfoPromise()
                .then((res) => {
                    const { account } = res.json;
                    this.setState({
                        account
                    });

                })
                .catch(error => {
                    message.error(error);
                });
        });
    }

    /**
     * 设置登出状态
     */
    logout() {
        CookieHelp.clearCookie();
        this.setState({
            isLogin: false
        }, () => {
            this.checkLogin();
        });
    }


    /**
     * 检测是否已经登录
     */
    checkLogin() {
        const user = CookieHelp.getUserInfo();
        const isLogin = CookieHelp.getCookieInfo('IS_LOGIN');
        if (user && user.Authorization && isLogin) this.setLogin();

        const pathname = window.location.pathname;
        // 未登录并且不在首页，则跳转到首页
        if (!isLogin && pathname !== '/' && pathname !== '/Search') {
            window.app_open(this, '/', null, "self");
        }
    }

}
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;