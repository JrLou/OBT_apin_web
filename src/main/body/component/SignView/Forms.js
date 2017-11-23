/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-03 15:26:13 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-10 20:26:13
 */

import React, { Component } from 'react';
import Forget from './Forget';
import Login from './Login';
import SignIn from './SignIn';
class Forms extends Component {
    render() {
        const { mode } = this.props;
        return (
            <div>
                {mode === 0 && <Login {...this.props} />}
                {mode === 1 && <SignIn {...this.props} />}
                {mode === 2 && <Forget {...this.props} />}
            </div>
        );
    }
}

module.exports = Forms;
