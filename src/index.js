
//重写日志系统
window.log =function (obj) {
    //
    console.log(obj);
};
window.app_getPar = function (obj) {
    if(!obj||!obj.props||!obj.props.location||!obj.props.location.state){
        return {};
    }
    return obj.props.location.state
}
window.app_open = function (obj,path,state,callBack) {
    log(obj);
    if(!obj||(!obj.context)||(!obj.context.router)||(!obj.context.router.push)){
        alert("打开页面错误,请检查");
        if(callBack){
            callBack("打开页面错误,请检查");
        }
        return;
    }
    document.documentElement.scrollTop = document.body.scrollTop =0;
    obj.context.router.push(
        {
            pathname: path,
            state:state
        })


}

window.apin= {};
function exe() {
    apin.cache = new Map();
    apin.setCache = function (key,obj) {
        apin.cache.set(key,obj)
    }
    apin.delCache = function (key) {
        apin.cache.delete(key);
    }
    apin.getCache = function (key) {
        const v =  apin.cache.get(key)
        apin.delCache(key);
        return v ;
    }
}
exe();

const React = require('react');
const ReactDOM = require('react-dom');
const routes = require("./routes.js");
ReactDOM.render(routes, document.getElementById("root"));