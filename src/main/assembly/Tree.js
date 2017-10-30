import React, {Component} from 'react';
import { Tree ,Icon} from 'antd';
const TreeNode = Tree.TreeNode;
import Base from './Base.js';
class TreeCom extends Component {

    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.base = new Base(this);
        this.state = this.base.getDefaultState();
    }
    loadDataDone(){
        this.base.openDefaultKey();
        //通知打开绑定的组件/如果绑定的组件还没有被加载,或者正在加载中,打不开
    }
    /**
     * 执行被唤醒
     * 注:如果当前组件没有被加载,此方法执行无效
     * @param obj
     */
    exeBind(obj){
        let {type} = obj;
        if(type==="ok"){
            //tab/或者其他准备好了,请求关联
            this.base.openDefaultKey();
        }else if(type==="key"){
            let key = obj.activeKey;
            if(this.state.selectedKeys&&this.state.selectedKeys.length===1&&key===this.state.selectedKeys[0]){
                return;
            }
            this.base.setSelect(key);
        }

    }
    componentDidMount() {
        console.log("好了:"+this.props.com)
        this.base.componentDidMount();
        //告诉其他人,我好了
        // this.base.sendBind({type:"ok"})
        // //打开吧

    }
    getTreeDataView(data,key = "") {

        return data.map((obj,index)=>{
            let unKey = key+index;
            return (
                    (
                        <TreeNode
                            key={unKey} title={obj.title}>
                            {
                                obj.data?this.getTreeDataView(obj.data,unKey+"_"):null
                            }
                        </TreeNode>
                    )

            );
        });
    }

    render(){
        return this.base.render();
    }

    renderBase() {
        //返回空结构
        return this.state.net.data && this.state.net.data.length > 0 ? (
            <div>
                <Tree
                    defaultExpandAll={true}
                    autoExpandParent={true}
                    showLine={true}
                    selectedKeys={this.state.selectedKeys}
                    onSelect={(selectedKeys, {selected: bool, selectedNodes, node, event})=>{
                        if(selectedKeys&&selectedKeys.length>0){
                            this.base.activeSelect(selectedKeys[0]);
                        }

                    }}
                >
                    {this.getTreeDataView(this.state.net.data,this.base.getCom())}
                </Tree>
            </div>

        ) : this.getNoneView(this.props.com);
    }
}

module.exports = TreeCom;