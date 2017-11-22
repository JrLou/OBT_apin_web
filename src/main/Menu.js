import React, { Component } from 'react';
import { Button, Menu } from 'antd';
import { HttpTool,CookieHelp} from "../../lib/utils/index.js";
import css from "./Menu.less";

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
                path: '/OrderFormList'
            }, {
                name: '我的需求',
                path: '/Demand'
            }, {
                name: '我的积分',
                path: '/Score'
            }],
            selectedIndex: window.location.pathname
        };
    }

    render() {
        const { selectedIndex, menus } = this.state;

        return (

            <Menu prefixCls="my-ant-menu" selectedKeys={[selectedIndex]} mode="horizontal">
                {
                    menus.map((menu) => {
                        return (
                            <MenuItem key={menu.path}>
                                <span className={css.menu} onClick={() => {
                                    this.setState({
                                        selectedKey: menu.path
                                    });
                                    let params = {};
                                    // 航班查询页面要求参数
                                    if (menu.path == '/Search') {
                                        params.data = {
                                            from: ""
                                        };
                                    }
                                    if (menu.path == '/PublishMsg') {
                                        CookieHelp.saveCookieInfo("publishMsgCookie","");
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
