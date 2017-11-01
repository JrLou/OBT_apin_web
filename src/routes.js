import React from "react";

const {Router, Route, IndexRoute, Redirect, browserHistory} = require("react-router");

const App = (nextState, cb) =>
    require.ensure([], (require) => {
        cb(null, require("./main/App.js"));
    }, "App");
const None = (nextState, cb) =>
    require.ensure([], require => {
        cb(null, require("./main/None.js"));
    }, "None");

const root = (
    <Router history={browserHistory}>
        <Route path="/" getComponent={App}
        >
            <IndexRoute getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/index/Index"));
                    }, "Index");
                }
            }/>
            <Route path="/Search" getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/search/Search.js"));
                    }, "Search");
                }
            }
            >
            </Route>
            <Route path="/FlightDetail" getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/content/detail/FlightDetail.js"));
                    }, "Search");
                }
            }
            >
            </Route>
            <Route path="/OrderFormList" getComponent={
                (nextState,cb)=>{
                    require.ensure([], require =>{
                        cb(null, require("./main/body/orderForm/OrderFormList.js"));
                    }, "OrderFormList");
                }
            }
            >
            </Route>
            <Route path="/OrderFormDetail" getComponent={
                (nextState,cb)=>{
                    require.ensure([], require => {
                        cb(null, require("./main/body/orderForm/OrderFormDetail.js"));
                    }, "OrderFormDetail");
                }
            }>
            </Route>
            <Route key="1" path='*' getComponent={None}/>,
        </Route>

    </Router>
);
module.exports = root;