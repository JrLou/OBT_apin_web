import React, { Component } from 'react';
import { Button, Menu } from 'antd';

const MenuItem = Menu.Item;

class Menus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menus: [{
                name: '首页',
                path: '/'
            }, {
                name: '发布需求',
                path: '/PublishMsg'
            }, {
                name: '航班查询',
                path: '/2'
            }, {
                name: '订单管理',
                path: '/3'
            }, {
                name: '我的需求',
                path: '/DemandDetail'
            }, {
                name: '我的积分',
                path: '/Score'
            }]
        };
    }

    render() {
        const { selectedKey, menus } = this.state;
        const pathname = this.props.pathname;

        return (

            <Menu prefixCls="my-ant-menu" selectedKeys={[pathname]} mode="horizontal">
                {
                    menus.map((menu, index) => {
                        return (
                            <MenuItem key={menu.path}>
                                <span style={{ display: 'inline-block', width: '100%', height: '100%' }} onClick={() => {
                                    window.app_open(this.props.root, menu.path, {
                                        step: menu.path == '/Score' ? 1 : 0
                                    });
                                }}>{menu.name}</span>
                            </MenuItem>
                        );
                    })
                }
            </Menu>

        );
    }
}

module.exports = Menus;
