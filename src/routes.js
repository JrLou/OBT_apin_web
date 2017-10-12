import React from 'react'
const { Router,Route,IndexRoute,useRouterHistory }  = require('react-router');
const { createHashHistory }  = require ('history');
//组织结构
import App from './main/App.js';

//主页面
import Index from './main/body/index/Index.js';

//详情页面
import OneWayDetail from './main/body/content/OneWayDetail.js';
import RoundWayDetail from './main/body/content/RoundWayDetail.js';
//搜索页面
import Search from './main/body/search/Search.js';

let route = {
    getRoute(){
        return (
          <Route path="/" component={App}>
            <IndexRoute component={Index}/>
            <Route path="OneWayDetail" component={OneWayDetail}/>
            <Route path="RoundWayDetail" component={RoundWayDetail}/>
            <Route path="Search" component={Search}/>
          </Route>
        );
    }
}
const appHistory = useRouterHistory(createHashHistory)({
    queryKey: '_key',
})
const root =
    <Router history={appHistory}>
        {route.getRoute()}
    </Router>;
module.exports = root;


