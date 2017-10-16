//重写日志系统
window.log = function (obj) {
    //
    console.log(obj);
};
window.app_getPar = function (obj) {
    if (!obj || !obj.props || !obj.props.location) {
        return {};
    }
    let state = obj.props.location.state;
    let query = obj.props.location.query;
    let data =query?query.data:null;
    return Object.assign(state||{},data?JSON.parse(decodeURIComponent(data)):{});
};
window.app_open = function (obj, path, state, open, callBack) {
    log(obj);
    if (!obj || (!obj.context) || (!obj.context.router) || (!obj.context.router.push)) {
        alert("打开页面错误,请检查");
        if (callBack) {
            callBack("打开页面错误,请检查");
        }
        return;
    }

    document.documentElement.scrollTop = document.body.scrollTop = 0;

    let get = state ? "?data=" + encodeURIComponent(JSON.stringify(state)) : "";
    if (open == "new") {
        window.open(path + get);
    } else if (open == "self") {
        window.location.pathname = path + get;
    } else {
        obj.context.router.push(
            {
                pathname: path,
                state: state
            });
    }
};

window.apin = {};
function exe() {
    apin.cache = new Map();
    apin.setCache = function (key, obj) {
        apin.cache.set(key, obj);
    };
    apin.delCache = function (key) {
        apin.cache.delete(key);
    };
    apin.getCache = function (key) {
        const v = apin.cache.get(key);
        apin.delCache(key);
        return v;
    };
}
exe();

const React = require('react');
const ReactDOM = require('react-dom');
const routes = require("./routes.js");
ReactDOM.render(routes, document.getElementById("root"));