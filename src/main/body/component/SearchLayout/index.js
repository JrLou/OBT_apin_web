/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component} from "react";
import {Button, Input, Row, Col} from "antd";
import AutoInput from "../AutoInput";
import less from "./index.less";

/**
 * 搜索view
 */
class SearchLayout extends Component {

    constructor(props) {
        super(props);

        let {data} = this.props;
        if (!data) {
            data = {};
        }
        this.state = Object.assign({
            loading: false
        }, data);
        this.img_login_check = require("../../../../images/check.png");
        this.img_login_uncheck = require("../../../../images/uncheck.png");
    }


    getData() {
        return {
            from: this.refs.from.getValue(),
            to: this.refs.to.getValue(),
            one: this.state.one
        };
    }

    homeView() {
        return (

            <div className={less.i_content}>

                <div className={less.title}>出发城市：</div>
                <AutoInput
                    ref="from"
                    defaultValue={this.state.from}
                    placeholder="中文／拼音／三字码"/>
                <div className={less.title}>到达城市：</div>
                <AutoInput
                    ref="to"
                    defaultValue={this.state.to}
                    placeholder="中文／拼音／三字码"/>

                {this.getSwitchLayout()}
                {this.getButton()}
            </div>            );

    }

    getButton() {
        return (
            <div className={less.buttonLayout}>
                <Button
                    loading={this.state.loading}
                    type="primary"
                    className={less.button}
                    onClick={() => {
                        if (this.props.submit) {
                            this.props.submit(this.getData());
                        }
                    }}>
                    {"搜索" + (this.state.loading ? "中" : "")}
                </Button>
            </div>
        );
    }

    getSwitchView(v, title, cb,type) {
        return (
            <div
                onClick={() => {
                    cb();
                }}
                className={type === 1 ?less.searchAction:  less.action }
            >
                <img src={v ? this.img_login_check : this.img_login_uncheck}
                />
                <div>{title}</div>
            </div>
        );
    }

    getSwitchLayout(type){
        return (
            <div >

                {this.getSwitchView(this.state.one, "单程",
                    () => {
                        let s = !this.state.one;
                        this.setState({
                            one: s
                        });
                    },type)}
                {this.getSwitchView(!this.state.one, "往返",
                    () => {
                        let s = !this.state.one;
                        this.setState({
                            one: s
                        });
                    },type)}

            </div>
        );
    }
    searchView() {
        return (
            <div className={less.bar}>
                <div className={less.row}>
                    {this.getSwitchLayout(1)}
                </div>
                <div className={less.lineLayout}>
                    <div className={less.line}/>
                </div>
                <div className={less.inputLayout}>
                    <span className={less.inputLayoutSpan}>出发城市：</span>
                    <div className={less.inputLayoutDiv}>
                        <AutoInput
                            ref="from"
                            defaultValue={this.state.from}
                            placeholder="中文／拼音／三字码"/>
                    </div>
                </div>

                <div className={less.inputLayout}>
                    <span className={less.inputLayoutSpan}>到达城市：</span>
                    <div className={less.inputLayoutDiv}>
                        <AutoInput
                            ref="to"
                            defaultValue={this.state.from}
                            placeholder="中文／拼音／三字码"/>
                    </div>
                </div>
                <div className={less.row}>
                    {this.getButton()}
                </div>


            </div>
        );
    }

    render() {
        let {type} = this.props;
        return (
            <div style={{width: "100%"}}>
                {type === 1 ? this.homeView() : this.searchView()}
            </div>
        );
    }

    setLoading(loading) {
        this.setState({
            loading: loading
        });
    }
}

module.exports = SearchLayout;