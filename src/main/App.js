/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import less from './App.less';
import Panel from './assembly/Panel.js';
import { Row, Col } from 'antd';
import { Tabs, Select } from 'antd';
const TabPane = Tabs.TabPane;
import Control from './assembly/Control.js';
class page extends Component {
    constructor(props) {
        super(props);
        this.control = new Control();
    }

    renderMenuAndTab() {

        let left = 4;
        return (
            <Row justify="space-around" align="middle" className={less.main}>
                <Col span={left} className={less.mainLeft}>
                    {this.getMenu()}
                </Col>
                <Col span={24-left} className={less.mainRight}>
                    {this.getTab()}
                </Col>
            </Row>
        );
    }
    renderTreeAndTab() {
        let left = 4;
        return (
            <Row justify="space-around" align="middle" className={less.main}>
                <Col span={left} className={less.mainLeft}>
                    {this.getTree()}
                </Col>
                <Col span={24-left} className={less.mainRight}>
                    {this.getTab()}
                </Col>
            </Row>)
    }
    renderTreeAndMenuTab() {
        let left = 4;
        return (
            <Row justify="space-around" align="middle" className={less.main}>
                <Col span={left} className={less.mainLeft}>
                    {this.getMenu()}
                </Col>
                <Col span={24-left*2} className={less.mainRight}>
                    {this.getTab()}
                </Col>
                <Col span={left} className={less.mainLeft}>
                    {this.getTree()}
                </Col>
            </Row>)
    }
    render(){
        return this.renderMenuAndTab();
    }
    componentDidMount() {
        this.control.bind(this.menuPanel,this.tabPanel);
        // this.control.bind(this.tabPanel,this.treePanel,false);
    }

// <div onClick={()=>{
//     this.tabPanel.getPanel().addTab({
//         title:"123",
//         getView:()=>{
//             return (
//                 <div>你好啊,这是树页面</div>
//             );
//         }
//     })
// }}>add</div>
    getTree(){
        return (<Panel com={"tree"}
                       relation={ this.tabPanel }
                       action={"vm"}
                       ref={(ref) => {
                           this.treePanel = ref;
                       }}

        />);
    }
    getMenu(){
        return (<Panel com={"menu"}
                       relation={ this.tabPanel }
                       action={"vm"}
                       ref={(ref) => {
                           this.menuPanel = ref;
                       }}

        />);
    }
    getTab(){
        return (<Panel

            com={"tab"}
            tabPosition={"top"}
            type={'editable-card'}
            action={"none"}
            onTabClick={(key)=>{
                //alert(key)
            }}
            ref={(ref) => {
                this.tabPanel = ref;
            }}/>);
    }
}
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;