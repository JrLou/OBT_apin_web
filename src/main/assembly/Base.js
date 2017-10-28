import React, {Component} from 'react';
import css from './Panel.less';
import {  Spin,message } from 'antd';

class Base extends Component{

    constructor(props){
        super(props);
        this.state = {
            loading:0,
            net:{},

        }

    }
    getNoneView(){
        return <div>{this.getCom()+":请添加基础数据"}</div>
    }
    getNoneItemView(){
        return <div>{this.getCom()+":请添加基础行数据"}</div>
    }
    sendBind(v) {
        if (this.addBind) {
            this.addBind(v);
        }
    }
    setLoading(loading,cb){
        this.setState({
            loading,
        },cb);
    }

    componentDidMount() {

        this.refreshLoad();
    }
    getCom(){
        return this.props.com;
    }

    getData(){
        return this.props.data;
    }
    verData(data){
        //校验

        return true;
    }
    refreshLoad(){
        //加载数据
        this.setLoading(0);
        this.loadData(this.props.action,this.props.param,(code,msg,data,power,option)=>{
            this.setState({
                net:{code,msg,data,power,option},
            },()=>{
                this.loadDataDone();
                this.setLoading(code,()=>{
                    if(code<0){
                        //显示错误
                        message.error(msg);
                    }
                });

            });



        })
    }
    loadDataDone(){

    }
    /**
     *
     * @param action 数据类型 vm:自动生成模拟数据  data:主动传入数据  !vm!data 请求网络
     * @param param 请求参数
     * @param cb 请求返回 code:返回码 >0:正确<0:错误 msg:返回信息 data:>0时数据 power:权限r读|e编辑|a添加|s搜索|d删除 option:其他参数
     */
    loadData(action,param,cb){
        //数据拦截
        let callBack = (code,msg,data,power,option)=>{
            if(code>0&&!this.verData(data)){
                code = -88881;
                msg = "数据格式错误";
            }else
            if(code===0){
                code = -88884;
                msg = "CODE不能为0";
            }
            cb(code,msg,data,power,option);

        }
        //HTTP请求
        if(action==="vm"){
            setTimeout(()=>{
//模拟返回结果
                let rm = (Math.random()*10).toFixed(0)+1;
                if(rm<4){
                    //错误机率30%
                    callBack(-rm,"随机错误"+(-rm),null,{key:"r|e|a|s|d"},{});
                }else{
                    let key = "getData_"+this.getCom();
                    if(this[key]){
                        callBack(1,"返回成功",this[key](),{key:"r|e|a|s|d"},{});
                    }else{
                        callBack(-88882,"查找不到 ["+key+"] 模拟源,可以当类中实现 例:Base.js getData_menu",null,{},{});
                    }

                }
            },(Math.random()*3000).toFixed(0))
        }else  if(action === "data"){
            //已有数据
            callBack(1,"返回成功",this.getData(),{key:"r|e|a|s|d"},{});
        }else {
            //请求网络
            callBack(-88883,"暂无网络接口",null,{key:"r|e|a|s|d"},{});
        }

    }


    renderBase(){
        return this.getNoneView();
    }
    renderError(){
        return (
            <div>
                <div>{this.state.net.msg}</div>
                <div onClick={()=>this.refreshLoad()}>刷新</div>
            </div>
        )
    }
    render() {
        //返回空结构

        return  (

            <div   className={css.main} ref={(ref)=>{
                this.baseRef = ref;
            }}>
                {this.state.loading===0?(
                    <div className={css.mainLoading}><Spin  className={css.loading} tip={""+this.getCom()+"..."} spinning={true} size="large" /></div>
                ):(this.state.loading>0?this.renderBase():this.renderError())}

            </div>
        )

    }

    getData_menu(){
        let vmData = (max,title = "",count)=>{
            max--;
            if(max<0){
                return null;
            }
            let data = [];
            for(let i = 0;i<count;i++){
                let t = title+i;
                let arr = vmData(max,t+"_",count);
                let obj = {
                    title:t,
                    icon:"lock"
                };
                if(arr){
                    obj.data = arr;
                }
                data.push(obj);
            }
            return data;
        }
        return vmData((Math.random()*10).toFixed(0)%3+1,"标题",(Math.random()*10).toFixed(0))
    }
}
module.exports = Base;