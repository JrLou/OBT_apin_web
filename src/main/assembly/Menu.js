import React, {Component} from 'react';
import Base from './Base.js';
import { Menu, Icon, Spin } from 'antd';
const SubMenu = Menu.SubMenu;
import css from './Panel.less';


/**
 * data:[{title:"123",data:[data:[]]}]
 * onSelectRow(obj) obj:选择的行的对像
 */
class ComMenu extends Base {

    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        this.state = Object.assign(this.state,{
            selectedKeys:[],
            defaultOpenKeys:[],
        });

    }
    loadDataDone(){
        this.setDefaultKey();
        this.successBind();
    }
    successBind(){
        //打开当前页面

        console.log("successBind")
        console.log(this.state.selectedKeys)
        if(this.state.selectedKeys&&this.state.selectedKeys.length>0){
            this.activeSelect(this.state.selectedKeys[0]);
        }

    }
    setDefaultKey(){
        let key = this.getDefaultKeysForData(this.state.net.data,"");
        if(key){
            this.state.selectedKeys = [key];
            this.state.defaultOpenKeys = this.trm(key);
        }
        // log(key);

    }
    getDefaultKeysForData(data,key ){
        if(data&&data.length>0){
            key = key+(key?"_":"")+"0";
            return this.getDefaultKeysForData(data[0].data,key)
        }else{
            return  key;
        }
    }
    exeBind(key){
        if(this.state.selectedKeys&&this.state.selectedKeys.length===1&&key===this.state.selectedKeys[0]){
            return;
        }
        this.setSelect(key);
    }
    setSelect(key){
        this.setState({
            selectedKeys:[key],
        });
    }

    getMenuDataView(data,key = "") {
        return data.map((obj,index)=>{
            let unKey = key+index;
            return (
                obj.data?
                    (
                        <SubMenu
                            key={unKey} title={<span>{obj.icon?<Icon type={obj.icon}/>:null}<span>{obj.title}</span></span>}>
                            {
                                this.getMenuDataView(obj.data,unKey+"_")
                            }
                        </SubMenu>
                    )
                    :(<Menu.Item key={unKey} >{obj.title}</Menu.Item>)

            );
        });
    }

    /**
     * 查找选择值
     * @param data
     * @param key
     * @returns {*}
     */
    findData(data,key){
        let obj = data;
        let arr =  key.split("_");
        let size = arr.length;
        for(let i=0;i<size;i++){
            obj =  obj[arr[i]]
            if(i<(size-1)){
                obj =  obj.data
            }
        }
        return obj;
    }


    trm(key){
        if(key) {
            let arr = key.split("_");
            let keyPath = [];
            let temp = "";
            for (let v of arr) {
                keyPath.push(temp + v)
                temp = v+"_";
            }
            keyPath.pop()
            return keyPath;
        }

    }

    activeSelect(key){
        let data = this.findData(this.state.net.data,key);
        if(this.props.onSelectRow){
            this.props.onSelectRow(data,key);
        }

        this.sendBind({data, key});
        this.setSelect(key);
    }
    renderBase(){
        return this.state.net.data && this.state.net.data.length > 0 ? (
            <Menu
                {...this.prpos}
                className={css.main}
                mode="inline"
                selectedKeys={this.state.selectedKeys}
                defaultOpenKeys={this.state.defaultOpenKeys}
                onClick={( {item, key, keyPath})=>{
                    this.activeSelect(key);

                }
                }
            >
                {this.getMenuDataView(this.state.net.data,"")}
            </Menu>
        ) : this.getNoneView();
    }

}

module.exports = ComMenu;