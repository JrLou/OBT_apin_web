import React, {Component} from 'react';
import css from './Panel.less';

import {Button, Spin, message, Card, Collapse, Icon} from 'antd';

const Panel = Collapse.Panel;

class Base {

    /**
     * 和调用类绑定
     * @param child 调用类
     */
    constructor(child) {
        this.child = child;
    }

    /**
     * 得到状态模板
     * @returns {{init: number, loading: number, selectedKeys: Array, defaultOpenKeys: Array, net: {}}}
     */
    getDefaultState(){
        return {
            init:0,
            loading: 0,
            selectedKeys:[],
            defaultOpenKeys:[],
            net: {},
        };
    }

    /**
     * 无数据显示
     * @param msg
     * @returns {XML}
     */
    getNoneView(msg) {
        return (
            <div>
                <div>{this.getCom() +( msg||":请添加基础数据")}</div>
                {this.getRefreshView()}
            </div>
        )
    }

    getNoneItemView() {
        return <div>{this.getCom() + ":请添加基础行数据"}</div>
    }

    /**
     * 向控制组件发送一件消息/如果控制组件无加载/加载中/不存在  无法唤醒
     * @param v
     */
    sendBind(v) {
        //如果没有绑定的组件,不处理
        if (this.child.addBind) {
            this.child.addBind(v);
        }else{
            console.log("无法绑定 缺少绑定对像")
        }
    }


    /**
     * 显示加载状态
     * @param loading
     * @param cb
     */
    setLoading(loading, cb) {
        this.loadDataIng(loading);
        this.child.setState({
            loading,
        }, cb);
    }


    //加载完毕,进行加载数据
    componentDidMount() {
        this.refreshLoad();
    }

    /**
     * 当前组件类型
     * @returns {*}
     */
    getCom() {
        return this.child.props.com;
    }

    getData() {
        return this.child.props.data;
    }

    verData(data) {
        //校验
        return true;
    }

    /**
     * 刷新组件
     */
    refreshLoad() {
        //加载数据
        this.setLoading(0);
        this.loadData(this.child.props.action, this.child.props.param, (code, msg, data, power, option) => {

            this.child.setState({
                net: {code, msg, data, power, option},
            }, () => {
                this.loadDataDone();
                this.setLoading(code, () => {
                    if (code < 0) {
                        //显示错误
                        message.error(msg);
                    }
                });

            });


        })
    }


    /**
     *
     * @param action 数据类型 vm:自动生成模拟数据  data:主动传入数据  !vm!data 请求网络
     * @param param 请求参数
     * @param cb 请求返回 code:返回码 >0:正确<0:错误 msg:返回信息 data:>0时数据 power:权限r读|e编辑|a添加|s搜索|d删除 option:其他参数
     */
    loadData(action, param, cb) {
        //数据拦截
        let callBack = (code, msg, data, power, option) => {
            if (code > 0 && !this.verData(data)) {
                code = -88881;
                msg = "数据格式错误";
            } else if (code === 0) {
                code = -88884;
                msg = "CODE不能为0";
            }
            cb(code, msg, data, power, option);

        }
        //HTTP请求
        if (action === "vm") {
            setTimeout(() => {
//模拟返回结果
                let rm = (Math.random() * 10 + 1).toFixed(0);
                if (rm < 4) {
                    //错误机率30%
                    callBack(-rm, "随机错误" + (-rm), null, {key: "r|e|a|s|d"}, {});
                } else {
                    let key = "getData_" + this.getCom();
                    if (this[key]) {
                        callBack(1, "返回成功", this[key](), {key: "r|e|a|s|d"}, {});
                    } else {
                        callBack(-88882, "查找不到 [" + key + "] 模拟源,可以当类中实现 例:Base.js getData_menu", null, {}, {});
                    }

                }
            }, (Math.random() * 3000).toFixed(0))
        } else if (action === "data") {
            //已有数据
            callBack(1, "返回成功", this.getData(), {key: "r|e|a|s|d"}, {});
        } else if (action === "none") {
            //不处理/当前位于加载中=>如要消失,请主动调用 setLoading(-1);
            callBack(1, "成功", {}, {}, {});
        } else {
            //请求网络
            callBack(-88883, "暂无网络接口", null, {key: "r|e|a|s|d"}, {});
        }

    }

    /**
     * 调用类实现,显示结果
     * @returns {XML}
     */
    renderBase(){
        return this.child.renderBase?this.child.renderBase():this.getNoneView("请实现renderBase函数");
    }

    /**
     * 得到刷新按钮视图
     * @returns {*}
     */
    getRefreshView() {
        return this.child.props.action !== "none" ? (
                <div onClick={() => {this.refreshLoad()}} className={css.refresh}>
                    <Button type="primary" ghost> <Icon type="reload"/>加载</Button>
                </div>
            )
            : null
    }

    /**
     * 得到JSON排版视图
     * @param json
     * @returns {XML}
     */
    getJsonView(json){
        return  <pre className={css.pre} dangerouslySetInnerHTML={{__html: this.syntaxHighlight(json)}}/>;
    }

    /**
     * 得到显示错误排版视图
     * @returns {XML}
     */
    renderError() {
        return (
            <div className={css.error}>
                <Collapse bordered={true} defaultActiveKey={['1']}>
                    <Panel header={<div style={{color: "#ff0000"}}><Icon type={'question-circle'}/><span
                        style={{marginLeft: 5}}>{this.child.state.net.msg}</span></div>} key="1">
                        {this.getJsonView(this.child.state)}
                        {this.getRefreshView()}
                    </Panel>
                </Collapse>


            </div>
        )
    }

    /**
     * 高亮JSON
     * @param json
     */
    syntaxHighlight(json = {}) {
        if (typeof json !== 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
            var cls = css.number;
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = css.key;
                } else {
                    cls = css.string;
                }
            } else if (/true|false/.test(match)) {
                cls = css.boolean;
            } else if (/null/.test(match)) {
                cls = css.null;
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }


    /**
     * 显示入口
     * @returns {XML}
     */
    render() {
        //返回空结构
        return (

            <div className={css.main}>
                {this.child.state.loading === 0 ? (
                    <div className={css.mainLoading}><Spin className={css.loading} tip={"" + this.getCom() + "..."}
                                                           spinning={true} size="large"/></div>
                ) : (this.child.state.loading > 0 ? this.renderBase() : this.renderError())}

            </div>
        )

    }

    /**
     * 层级KEY反转
     * @param key
     * @returns {*}
     */
    transformKey(key){
        if(key&&key.indexOf(this.getCom())>-1){
            return key.replace(this.getCom(),"")
        }else{
            return key;
        }
    }
    /**
     * 查找选择值
     * @param data
     * @param key
     * @returns {*}
     */
    findData(data,key){
        let obj = data;
        let arr =  this.transformKey(key).split("_");
        let size = arr.length;
        for(let i=0;i<size;i++){
            obj =  obj[arr[i]]
            if(i<(size-1)){
                obj =  obj.data
            }
        }
        return obj;
    }

    /**
     * 选项被激活
     * @param key
     */
    activeSelect(key){
        let data = this.findData(this.child.state.net.data,key);
        if(this.child.props.onSelectRow){
            this.child.props.onSelectRow(data,key);
        }

        this.sendBind({type:"add",data, key});
        this.setSelect(key);
    }
    setSelect(key){
        this.child.setState({
            selectedKeys:[key],
        });
    }

    /**
     * 加载中
     * @param loading
     */
    loadDataIng(loading){
        // if(loading===0){
        //     this.sendBind({type:"loading"})
        // }
    }

    /**
     * 加载完成
     */
    loadDataDone(){
        if(this.child.loadDataDone){
            this.child.loadDataDone();
        }
    }

    /**
     * 获取当前的第一个可打开值
     */
    openDefaultKey(){
        this.setDefaultKey();
        if(this.child.state.selectedKeys&&this.child.state.selectedKeys.length>0){
            this.activeSelect(this.child.state.selectedKeys[0]);
        }else{
            //通知,无数据显示
            this.sendBind({type:"none"})
        }
    }
    setDefaultKey(){
        let key = this.getDefaultKeysForData(this.child.state.net.data);
        if(key){
            this.child.state.selectedKeys = [key];
            this.child.state.defaultOpenKeys = this.trm(key);
        }else{
            this.child.state.selectedKeys = [];
            this.child.state.defaultOpenKeys = [];
        }
    }
    getDefaultKeysForData(data,key = "" ){
        if(data&&data.length>0){
            key = key+(key?"_":this.getCom())+"0";
            return this.getDefaultKeysForData(data[0].data,key)
        }else{
            return  key;
        }
    }
    trm(key){
        if(key) {
            let arr = this.transformKey(key).split("_");
            let keyPath = [];
            let temp = "";
            for (let v of arr) {
                keyPath.push(this.getCom()+temp + v)
                temp = v+"_";
            }
            keyPath.pop()
            return keyPath;
        }

    }

    /**
     * 产生模拟数据
     * @param title
     */
    getVMData(title){
        let vmData = (max, title = "", count) => {
            max--;
            if (max < 0) {
                return null;
            }
            let data = [];
            for (let i = 0; i < count; i++) {
                let t = title + i;
                let arr = vmData(max, t + "_", count);
                let obj = {
                    title: t,
                    icon: "lock"
                };
                if (arr) {
                    obj.data = arr;
                }
                data.push(obj);
            }
            return data;
        }
        return vmData((Math.random() * 10).toFixed(0) % 3 + 1, title, (Math.random() * 10).toFixed(0))
    }

    getData_menu() {
        return this.getVMData("菜单")
    }
    getData_tree(){
        return this.getVMData("树")
    }
}

module.exports = Base;