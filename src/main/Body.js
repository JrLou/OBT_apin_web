/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import {Layout, Menu, Icon} from 'antd';
const {SubMenu} = Menu;
const {Header, Content} = Layout;
class page extends Component{

    constructor(props) {
        super(props);
    }

    render() {

        var barS = [
            {
                title:"首页",
                path:"/"
            },
            {
            title:"个人办事",
            path:"/Body/Work"
            },
            {
            title:"单位办事",
            path:"/Body/Work"
            },
            {
            title:"服务目录",
            path:"/Body/ServerList"
            },
            {
            title:"最多跑一次",
            path:"/Body/ServerOneWay"
            },
            {
            title:"互动交流",
            path:"/Body/Interactive"
            },
            {
            title:"机构地图",
            path:"/Body/OrgMap"
            }];
        var viewS = [];
        for(let i in barS){
            let d = barS[i];
            viewS.push(
                <Menu.Item key={i.toString()}>
                    <div
                        onClick={()=>{
                            window.app_open(this, d.path, {index: i, title: d.title});
                        }}
                    >{d.title}</div>
                </Menu.Item>
            );
        }
        return (
            <Layout>
                <Header className="header">
                    <div className="logo"/>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={[window.app_getPar(this).index.toString()]}
                        style={{lineHeight: '64px'}}
                    >
                        {viewS}
                    </Menu>
                </Header>
                <Layout>
                    {this.props.children}
                </Layout>
            </Layout>
        );
    }
}
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;