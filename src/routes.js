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
                    }, "FlightDetail");
                }
            }
            >
            </Route>
            <Route path="/PubRequirement" getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/content/detail/PubRequirement.js"));
                    }, "PubRequirement");
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
            <Route path="/Score" getComponent={
                (nextState,cb)=>{
                    require.ensure([], require => {
                        cb(null, require("./main/body/score/Score.js"));
                    }, "Score");
                }
            }>
            </Route>
            <Route path="/Account" getComponent={
                (nextState,cb)=>{
                    require.ensure([], require => {
                        cb(null, require("./main/body/account/Account.js"));
                    }, "Account");
                }
            }>
            </Route>
            <Route path="/Pay" getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./pay/Pay.js"));
                    }, "Pay");
                }
            }
            >
            </Route>
            {/**发布需求*/}
            <Route path="/PublishMsg" getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/publishMsg/PublishMsg.js"));
                    }, "PublishMsg");
                }
            }
            >
            </Route>
            {/**发布需求*/}
            <Route path="/Demand" getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/demand/Demand.js"));
                    }, "Demand");
                }
            }
            >
            </Route>
            {/**需求详情*/}
            <Route path="/DemandDetail" getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/demandDetail/DemandDetail.js"));
                    }, "DemandDetail");
                }
            }
            >
            </Route>
            <Route key="1" path='*' getComponent={None}/>,
        </Route>

    </Router>
);
module.exports = root;