/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-03 15:26:13 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-06 15:14:57
 */

import React, { Component } from 'react';
import { Button } from 'antd';
import css from './sign.less';
class Forget extends Component {
    render() {
        return (
            <Button prefixCls="my-ant-btn" size="large" type="primary" ghost className={css.checkCodeBtn}>获取验证码</Button>
        );
    }
}

module.exports = Forget;
