/**
 * Created by lixifeng on 17/3/24.
 */
import React, { Component } from 'react';
import { Button } from 'antd';

import Sign from './body/component/SignView';

import less from "./AppTop.less";

class page extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={less.head}>
                <div className={less.headContent}>
                    <a>
                        <img
                            onClick={() => {
                                log(this.props.root);
                                window.app_open(this.props.root, "/", null, "self");
                            }}
                            className={less.left}
                            src={require('../images/index_logo.png')}
                        />
                    </a>
                    <div className={less.right}>
                        <div className={less.rightItem}>
                            {/*<img*/}
                            {/*className={less.rightIcon}src={require('../images/phone.png')}*/}
                            {/*/>*/}
                            {/*<Button type="primary" className={less.login}
                                onClick={() => {
                                    window.open("http://mvp.apin.com");
                                }}
                            >登录</Button>*/}
                            <Button type="primary" className={less.login}
                                onClick={() => this.modal.showModal(0)}
                            >登录2</Button>
                            {/*<Button type="primary" className={less.register}
                                onClick={() => {
                                    window.open("http://mvp.apin.com/#/TestPage");
                                }}
                            >注册</Button>*/}
                            <Button type="primary" className={less.register}
                                onClick={() => this.modal.showModal(1)}
                            >注册</Button>

                        </div>
                        <div className={less.rightItem}
                            title="开发测试：打开订单列表"
                            onClick={() => {
                                // window.open("http://mvp.apin.com");
                                window.app_open(this, "/OrderFormList", {
                                    data: {}
                                }, "new");
                            }}
                        >
                            <font style={{ fontSize: 12, color: "#666" }}>客服电话  9:00~21:00</font>
                            <br />
                            <font style={{ fontSize: 16, color: "#34b0ff" }}>0571-58122998</font>
                        </div>
                    </div>
                </div>
                <Sign ref={(modal) => this.modal = modal}></Sign>
            </div>
        );
    }
}
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;