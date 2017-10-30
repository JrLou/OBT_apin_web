import React, {Component} from 'react';
import css from './Panel.less';
import Base from './Base.js';
import {Collapse, Icon} from 'antd';

const Panel = Collapse.Panel;

import Tab from './Tab.js';
import Menu from './Menu.js';
import Tree from './Tree.js';
import Table from './Table.js'
class PanelCom extends Component {

    constructor(props) {
        super(props);
    }


    getPanel() {
        return this.com || {};
    }
    getComTypeMap(){
        let map = new Map();
        map.set("tab",Tab);
        map.set("menu",Menu);
        map.set("tree",Tree);
        map.set("table",Table);
        return map;
    }
    getComTypeMapKeys(){
        let arr = [];
        for (let v of this.getComTypeMap().keys()){
            arr.push(v);
        }
        return arr;
    }
    render() {
        //返回空结构
        let {com} = this.props;
        let Com = this.getComTypeMap().get(com);
        return (
            <div>

                {Com ?
                    (
                        <Com  {...this.props}
                              base={this}
                              ref={(ref) => {
                                  this.com = ref;
                              }}
                        >

                        </Com>
                    )
                    : this.getNoneLayout(com)}
            </div>
        );
    }

    getNoneLayout(com) {
        return (
            <Collapse bordered={true} defaultActiveKey={['1']} style={{margin: 5}}>
                <Panel header={<div style={{color: "#ff0000"}}><Icon type={'question-circle'}/><span
                    style={{marginLeft: 5}}>{"无指定类型=>Panel"}</span></div>} key="1">
                    <div>错误的类型:{com}</div>
                    <div> 请添加正确的类型:{JSON.stringify(this.getComTypeMapKeys())}</div>
                </Panel>
            </Collapse>
        );
    }


}

// {"|".repeat(100).split("|").map((data,key)=>{
//     console.log(key)
//     return <div key={key}> aa{key}</div>
// })}

module.exports = PanelCom;


<div>
    <div></div>
</div>