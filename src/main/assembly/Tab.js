import React, {Component} from 'react';
import {Tabs} from 'antd';
import Base from "./Base.js";
const TabPane = Tabs.TabPane;
import css from './Panel.less';
class Tab extends Component {

    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        this.base = new Base(this);
        this.state = {
            panes: [],
            activeKey: null,
        };
    }

    componentDidMount() {
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
           this.base.setLoading(1,exe)
       }else{
           exe();
       }
    }


    getChildrenView(data){
        let  view = <div>{this.base.getJsonView(data)}</div>;
        switch (this.props.childrenType){
            case "view":
                if(this.props.getChildRenView){
                    view =   this.props.getChildRenView(data);
                }else{
                    view = <div>none getChildRenView</div>;
                }
                break;
            default:
               //
                break;
        }
        return view;
    }
    /**
     * 执行被唤醒
     * 注:如果当前组件没有被加载,此方法执行无效
     * @param obj
     */
    exeBind(obj){
        console.log("tab say:");
        console.log(obj);
        let {type,data,key} = obj;

        if(type==="add"){
            this.addTab({
                title: data.title,
                activeKey:key,
                getView: () => {
                    return this.getChildrenView(data);
                }
            })
        }else if(type==="loading"){
            this.base.setLoading(0)
            this.state.panes = [];
        }else
            {
            this.state.net = {msg:"无模板"}
            this.base.setLoading(-1)
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
            this.base.sendBind({type:"key",activeKey})
        });
    }

    render() {
        //返回空结构
        return this.state.panes && this.state.panes.length > 0 ? (
            <Tabs
                {...this.props}
                activeKey={this.state.activeKey}
                className={css.main}
                onChange={(activeKey) => {
                    this.setState({activeKey},()=>{
                        this.base.sendBind({type:"key",activeKey})
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
                                 tab={data.title}
                            style={{[""+this.props.tabPosition]:(32+16)+"px"}}
                             className={css.content}
                        >
                            {data.getView ? data.getView() : this.base.getNoneItemView(this.props.com)}
                        </TabPane>
                    );
                })}
            </Tabs>
        ) : this.base.getNoneView();
    }
}

module.exports = Tab;