
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
    obj.context.router.push(
        {
            pathname: path,
            state:state
        })
}

const React = require('react');
const ReactDOM = require('react-dom');
const routes = require("./routes.js");
ReactDOM.render(routes, document.getElementById("root"));