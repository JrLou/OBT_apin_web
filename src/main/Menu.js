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
            }],
            selectedKey: '/'
        };
    }

    componentDidMount(){
        try {
            const pathname = this.props.location.pathname;
            this.setState({
                selectedKey: pathname
            });
        } catch (error) {
            log(error);
        }
    }

    render() {
        const { selectedKey, menus } = this.state;

        return (

            <Menu prefixCls="my-ant-menu" selectedKeys={[selectedKey]} mode="horizontal">
                {
                    menus.map((menu, index) => {
                        return (
                            <MenuItem key={menu.path}>
                                <span style={{ display: 'inline-block', width: '100%', height: '100%' }} onClick={() => {
                                    this.setState({
                                        selectedKey: menu.path
                                    });
                                    window.app_open(this, menu.path, {
                                        step: menu.path === '/Score' ? 1 : 0
                                    },"self");
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
