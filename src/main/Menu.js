import React, { Component } from 'react';
import { Button, Menu } from 'antd';
import {log} from 'debug';

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
                path: '/Search'
            }, {
                name: '订单管理',
                path: '/3'
            }, {
                name: '我的需求',
                path: '/Demand'
            }, {
                name: '我的积分',
                path: '/Score'
            }],
            selectedIndex: '0'
        };
    }

    componentDidMount() {
        let par = window.app_getPar(this);
        this.setState({
            selectedIndex: String(par.index)
        });
    }

    render() {
        const { selectedIndex, menus } = this.state;

        return (

            <Menu prefixCls="my-ant-menu" selectedKeys={[selectedIndex]} mode="horizontal">
                {
                    menus.map((menu, index) => {
                        return (
                            <MenuItem key={index}>
                                <span style={{ display: 'inline-block', width: '100%', height: '100%' }} onClick={() => {
                                    this.setState({
                                        selectedKey: index
                                    });
                                    let params = {index};
                                    // 航班查询页面要求参数
                                    if(menu.path == '/Search'){
                                        params.data = {
                                            from:""
                                        };
                                    }
                                    window.app_open(this, menu.path, params, "self");
                                }}>{menu.name}</span>
                            </MenuItem>
                        );
                    })
                }
            </Menu>

        );
    }
}
Menus.contextTypes = {
    router: React.PropTypes.object
};
module.exports = Menus;
