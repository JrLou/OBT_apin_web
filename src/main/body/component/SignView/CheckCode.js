/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-03 15:26:13 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-14 10:16:40
 */

import React, { Component } from 'react';
import { Button } from 'antd';
import css from './sign.less';
class Forget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 0
        };
        this.autoTime = this.autoTime.bind(this);
    }
    render() {
        const { time } = this.state;
        const { error, getCode } = this.props;
        return (
            <Button
                prefixCls="my-ant-btn"
                disabled={time > 0 || error}
                size="large"
                type="primary"
                ghost
                className={css.checkCodeBtn}
                onClick={() => {
                    getCode();
                    this.autoTime(60);
                }}
            >{
                    time === 0 ? '获取验证码' : `${time}s`
                }</Button>
        );
    }

    /**
     * 倒计时
     * @param {*} time 
     */
    autoTime(time) {
        if (time > 0) {
            let diff = time - 1;
            this.setState({
                time: diff
            }, () => {
                setTimeout(() => {
                    this.autoTime(diff);
                }, 1000);
            });
        } else {
            this.setState({
                time: 0
            });
        }

    }
}

module.exports = Forget;
