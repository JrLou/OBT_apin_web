import React, {Component} from 'react';
import Base from './Base.js';
import {Tabs} from 'antd';

const TabPane = Tabs.TabPane;

class Tab extends Base {

    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        this.state = Object.assign(this.state,{
            panes: [],
            activeKey: null,
        });
    }

    /**
     *
     * @param data title:选择卡标题
     */
    addTab(data) {
        const panes = this.state.panes;
        const activeKey =(data.activeKey )||"tab_" + (this.newTabIndex++);
        data.key = activeKey;
        //如果KEY存在,不再打开,选择指定KEY
        let exits = false;
        for(let {key} of panes){
            exits = key === activeKey
            if(exits){
                break;
            }
        }
       if(!exits){
           panes.push(data);

       }
       let exe = ()=>{
           this.setState({panes, activeKey});
       };
       if(this.state.loading!==1){
           this.setLoading(1,exe)
       }else{
           exe();
       }
    }

    exeBind(obj){
        console.log("tab");
        console.log(obj);
        let {type,data,key} = obj;

        if(type==="add"){
            this.addTab({
                title: data.title,
                activeKey:key,
                getView: () => {
                    return (
                        <div>{this.getJsonView(data)}</div>
                    );
                }
            })
        }else if(type==="loading"){
            this.setLoading(0)
            this.state.panes = [];
        }else
            {
            this.state.net = {msg:"无模板"}
            this.setLoading(-1)
        }

    }
    remove(targetKey) {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
            activeKey = panes[lastIndex].key;
        }
        this.setState({panes, activeKey},()=>{
            this.sendBind(activeKey)
        });
    }

    renderBase() {
        //返回空结构
        return this.state.panes && this.state.panes.length > 0 ? (
            <Tabs
                {...this.props}
                activeKey={this.state.activeKey}
                onChange={(activeKey) => {
                    this.setState({activeKey},()=>{
                        this.sendBind(activeKey)
                    });
                }}
                onEdit={(targetKey, action) => {
                    if(action==="remove"){
                        this.remove(targetKey);
                    }

                }}
                hideAdd={true}

            >
                {this.state.panes.map((data, index) => {
                    if (!data) {
                        data = {};
                    }
                    return (
                        <TabPane key={data.key}
                                 tab={data.title}>
                            {data.getView ? data.getView() : this.getNoneItemView(this.props.com)}
                        </TabPane>
                    );
                })}
            </Tabs>
        ) : this.getNoneView(this.props.com);
    }
}

module.exports = Tab;