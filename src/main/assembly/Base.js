import React, {Component} from 'react';
import css from './Panel.less';
import {Button, Spin, message, Card, Collapse, Icon} from 'antd';

const Panel = Collapse.Panel;

class Base extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: 0,
            selectedKeys:[],
            defaultOpenKeys:[],
            net: {},

        }

    }

    getNoneView() {
        return (
            <div>
                <div>{this.getCom() + ":请添加基础数据"}</div>
                {this.getRefreshView()}
            </div>
        )
    }

    getNoneItemView() {
        return <div>{this.getCom() + ":请添加基础行数据"}</div>
    }

    sendBind(v) {
        if (this.addBind) {
            this.addBind(v);
        }
    }

    setLoading(loading, cb) {
        this.loadDataIng(loading);
        this.setState({
            loading,
        }, cb);
    }


    componentDidMount() {

        this.refreshLoad();
    }

    getCom() {
        return this.props.com;
    }

    getData() {
        return this.props.data;
    }

    verData(data) {
        //校验

        return true;
    }

    refreshLoad() {
        //加载数据
        this.setLoading(0);
        this.loadData(this.props.action, this.props.param, (code, msg, data, power, option) => {
            this.setState({
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
        } else {
            //请求网络
            callBack(-88883, "暂无网络接口", null, {key: "r|e|a|s|d"}, {});
        }

    }


    renderBase() {
        return this.getNoneView();
    }

    getRefreshView() {
        return this.props.action !== "none" ? (
                <div onClick={() => this.refreshLoad()} className={css.refresh}>
                    <Button type="primary" ghost> <Icon type="reload"/>加载</Button>
                </div>
            )
            : null
    }

    getJsonView(json){
        return  <pre className={css.pre} dangerouslySetInnerHTML={{__html: this.syntaxHighlight(json)}}/>;
    }
    renderError() {
        return (
            <div className={css.error}>
                <Collapse bordered={true} defaultActiveKey={['1']}>
                    <Panel header={<div style={{color: "#ff0000"}}><Icon type={'question-circle'}/><span
                        style={{marginLeft: 5}}>{this.state.net.msg}</span></div>} key="1">
                        {this.getJsonView(this.state)}
                        {this.getRefreshView()}
                    </Panel>
                </Collapse>


            </div>
        )
    }

    syntaxHighlight(json) {
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


    render() {
        //返回空结构

        return (

            <div className={css.main} ref={(ref) => {
                this.baseRef = ref;
            }}>
                {this.state.loading === 0 ? (
                    <div className={css.mainLoading}><Spin className={css.loading} tip={"" + this.getCom() + "..."}
                                                           spinning={true} size="large"/></div>
                ) : (this.state.loading > 0 ? this.renderBase() : this.renderError())}

            </div>
        )

    }

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
    activeSelect(key){
        let data = this.findData(this.state.net.data,key);
        if(this.props.onSelectRow){
            this.props.onSelectRow(data,key);
        }
        this.sendBind({type:"add",data, key});
        this.setSelect(key);
    }
    setSelect(key){
        this.setState({
            selectedKeys:[key],
        });
    }
    exeBind(key){
        if(this.state.selectedKeys&&this.state.selectedKeys.length===1&&key===this.state.selectedKeys[0]){
            return;
        }
        this.setSelect(key);
    }
    loadDataIng(loading){
        if(loading===0){
            this.sendBind({type:"loading"})
        }

    }
    loadDataDone(){
        this.setDefaultKey();
        if(this.state.selectedKeys&&this.state.selectedKeys.length>0){
            this.activeSelect(this.state.selectedKeys[0]);
        }else{
            //通知,无数据显示
            this.sendBind({type:"none"})
        }
    }
    setDefaultKey(){
        let key = this.getDefaultKeysForData(this.state.net.data);
        if(key){
            this.state.selectedKeys = [key];
            this.state.defaultOpenKeys = this.trm(key);
        }else{
            this.state.selectedKeys = [];
            this.state.defaultOpenKeys = [];
        }
        // log(key);

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
                keyPath.push(temp + v)
                temp = v+"_";
            }
            keyPath.pop()
            return keyPath;
        }

    }

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