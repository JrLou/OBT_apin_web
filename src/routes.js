import React from 'react'
const { Router,Route,IndexRoute,Redirect,browserHistory}  = require('react-router');

const Search = {
    path: 'Search',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('./main/body/search/Search.js'))
        }, 'Search')
    },
};
const Index = {
    path: 'index',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('./main/body/index/Index.js'))
        }, 'index')
    },
};


const rootRoute = {
    path: '/',
    getComponent:(nextState, cb) =>{
        require.ensure([], (require) => {
            cb(null, require('./main/App.js'))
        }, 'App')
    },
    childRoutes: [
        Search,
        Index,
    ]
}
var rootArr = [];

var exe = (obj,arr)=>{
    if(obj.childRoutes&&obj.childRoutes.length>0){
        //递归 判断是否由子路由 ,如果存在,提取为同级路由,并删除子路由
        for (let child of obj.childRoutes) {
            let tmp = Object.create(child)
            tmp.path = (obj.path === '/') ? (obj.path + tmp.path) : (obj.path + '/' + tmp.path);
            exe(tmp, arr);
        }
        delete obj.childRoutes;
    }
    rootArr.push(obj);
}
// exe(rootRoute,rootArr);
rootArr.push(rootRoute);

// console.log(rootArr)
let App =
        (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('./main/App.js'))
            }, 'App')
        }
    ;
let None =  (nextState, cb) => {
    require.ensure([], require => {
        cb(null, require('./main/None.js'))
    }, 'None')
};
// let r_404 =  [
//     <Route key="1" path='/404' component={App} />,
//     <Redirect key="2" from='*' to='/404' />
// ]

const root = (
    <Router history={browserHistory}>
        <Route path="/" getComponent={App}
        >
            <IndexRoute  getComponent={
                (nextState, cb)=>{
                    require.ensure([], require => {
                        cb(null,require('./main/body/index/Index'))
                    }, 'Index')
                }
            }/>
            <Route path="/Search" getComponent={
                (nextState, cb)=>{
                    require.ensure([], require => {
                        cb(null,require('./main/body/search/Search.js'))
                    }, 'Search')
                }
            }
            >
            </Route>
                <Route key="1" path='*' getComponent={None} />,
        </Route>

    </Router>
);
module.exports = root;


