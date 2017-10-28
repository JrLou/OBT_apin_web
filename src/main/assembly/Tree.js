import React, {Component} from 'react';
import Base from './Base.js';
import { Tree ,Icon} from 'antd';
const TreeNode = Tree.TreeNode;
class TreeCom extends Base {

    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = Object.assign(this.state, {
            selectedKeys:[],
            defaultOpenKeys:[],
        });
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
                            this.activeSelect(selectedKeys[0]);
                        }

                    }}
                >
                    {this.getTreeDataView(this.state.net.data,this.getCom())}
                </Tree>
            </div>

        ) : this.getNoneView(this.props.com);
    }
}

module.exports = TreeCom;