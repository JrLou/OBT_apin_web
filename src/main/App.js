/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import less from './App.less';
import Panel from './assembly/Panel.js';
import { Row, Col ,Modal} from 'antd';
import { Tabs, Select } from 'antd';
import { Input } from 'antd';
const Search = Input.Search;

const TabPane = Tabs.TabPane;
import Control from './assembly/Control.js';
import UserPage from './user/UserPage.js';
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
    addLayer(){
        let view =  <div className={less.layer_main}>

            <Modal
                title="Basic Modal"
                visible={false}
                footer={null}
                closable={false}
                maskClosable={true}
                width={document.body.clientWidth*0.8}
                className={less.layer_modal}
            >
                {
                    "|".repeat(100).split("|").map((v,index)=>{
                        return <p key={index}>Some contents{index}...</p>
                    })
                }

            </Modal>

        </div>;
        return view;
    }
    render(){
        return <div>
            {this.renderMenuAndTab()}
        </div>;
    }
    render2(){
        return <UserPage data={{}}/>;
    }
    componentDidMount() {
        this.control.bind(this.menuPanel,this.tabPanel);
        // this.control.bind(this.treePanel,this.tabPanel);
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
                       action={"data"}
                       data={[{title:"系统设置 ",data:[{title:"用户管理",page:"user"},{title:"角色管理"}]},{title:"系统监控 ",data:[{title:"系统概览"},{title:"其它模块"}]}]}
                       ref={(ref) => {
                           this.menuPanel = ref;
                       }}

        />);
    }
    getTab(){
        return (<Panel

            com={"tab"}
            animated={false}
            tabPosition={"top"}
            type={'editable-card'}
            action={"none"}
            childrenType={"view"}
            getChildRenView={(data)=>{

                //根据页面数据,展示不同的页面
                if(data.page==="user"){
                    return <UserPage data={data}/>
                }

                return <div>{JSON.stringify(data)}</div>
            }
            }
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