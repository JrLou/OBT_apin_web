/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import {Layout, Menu, Row, Col, Input, Dropdown, Button, Icon, message} from 'antd';
const Search = Input.Search;
const {Header, Content, Footer} = Layout;
import less from './Index.less';

class page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        }

    }

    handleMenuClick(e) {
        message.info('Click on menu item.');
    }

    render() {
        // 热点服务的列表循环
        return (
            <div className={less.body}>
                <input/>
                <Button className={less.rightRow} icon={"search"}
                        onClick={() => {
                            window.app_open(this, "/Search", {title: "搜索"});
                        }}
                >跳转到搜索</Button>


                <Button className={less.rightRow} icon={"search"}
                        onClick={() => {
                            window.app_open(this, "/Content", {title: "搜索"});
                        }}
                >跳转到详情</Button>
            </div>
        );
    }


}

page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;