/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component} from 'react';
import {Button, Input} from  'antd';
import AutoInput from '../AutoInput';
import less from './index.less';
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
            loading: false,
        }, data);
        this.img_login_check = require('../../../../images/check.png');
        this.img_login_uncheck = require('../../../../images/uncheck.png');
    }


    getData() {
        return {
            from: this.refs.from.getValue(),
            to: this.refs.to.getValue(),
            one: this.state.one,
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

                <div>

                    {this.getSwitchView(this.state.one, "单程",
                        () => {
                            let s = !this.state.one;
                            this.setState({
                                one: s,
                            });
                        })}
                    {this.getSwitchView(!this.state.one, "往返",
                        () => {
                            let s = !this.state.one;
                            this.setState({
                                one: s,
                            });
                        })}

                </div>
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
            </div>            );

    }

    getSwitchView(v, title, cb) {
        return (
            <div
                onClick={() => {
                    cb();
                }}
                className={less.action}
            >
                <img  src={v ? this.img_login_check : this.img_login_uncheck}
                />
                <div >{title}</div>
            </div>
        );
    }

    searchView() {
        return (
            <div style={{
                width: "100%",
                paddingTop: 20
            }}>
                <div className={less.left} style={{marginLeft: 42}}>
                    <div
                        onClick={() => {
                            this.setState({
                                one: !this.state.one,
                            });
                        }} style={{marginTop: -3}}>
                        <img style={{
                            width: 10,
                            marginRight: 5,
                            marginTop: 6,
                            float: "left",
                            height: 10,
                        }} src={this.state.one ? this.img_login_check : this.img_login_uncheck}
                        />
                        <div style={{fontSize: 14, color: "#4F5762"}}>单程</div>
                    </div>
                    <div
                        onClick={() => {
                            this.setState({
                                two: !this.state.two,
                            });
                        }} style={{marginTop: 13}}>
                        <img style={{
                            width: 10,
                            marginRight: 5, float: "left",
                            height: 10,
                            marginTop: 6,
                        }} src={this.state.two ? this.img_login_check : this.img_login_uncheck}
                        />
                        <div style={{float: "left", fontSize: 14, color: "#4F5762"}}>往返</div>
                    </div>
                </div>
                <div className={less.left} style={{width: 1, marginLeft: 20, height: 52, backgroundColor: "#cbd3e5"}}/>

                <div className={less.left} style={{width: "30%", marginTop: 20}}>
                    <div style={{marginTop: 7, fontSize: 14, color: "#393939", float: "left", zIndex: 2}}>出发城市：</div>
                    <AutoInput
                        ref="from"
                        style={{marginLeft: 70, zIndex: 1}}
                        defaultValue={this.state.from}
                        placeholder="中文／拼音／三字码"/>
                </div>
                <div className={less.left} style={{width: "30%", marginTop: 20}}>
                    <div style={{marginTop: 7, fontSize: 14, float: "left", color: "#393939", zIndex: 2}}>到达城市：</div>
                    <AutoInput
                        ref="to"
                        style={{marginLeft: 70, zIndex: 1}}
                        defaultValue={this.state.to}
                        placeholder="中文／拼音／三字码"/>
                </div>
                <div className={less.left} style={{marginTop: 20}}>
                    <div style={{clear: "both"}}/>
                    <Button
                        loading={this.state.loading}
                        type="primary"
                        style={{marginLeft: "20%", width: 169, height: 38, backgroundColor: "#29A6FF", color: "#fff"}}
                        onClick={() => {

                            if (this.props.submit) {
                                this.props.submit(this.getData());
                            }
                        }}>
                        {"搜索" + (this.state.loading ? "中" : "")}
                    </Button>
                </div>
            </div>);
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
            loading: loading,
        });
    }
}
module.exports = SearchLayout;