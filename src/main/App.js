/**
 * Created by lixifeng on 17/3/24.
 */
import React, { Component } from 'react';
import AppTop from './AppTop.js';
import AppBottom from './AppBottom.js';
import less from './App.less';
class page extends Component {

    render() {
        return (
            <div className={less.main}>
                <div className={less.mainBG} />
                <div className={less.mainContent}>
                    <AppTop root={this} pathname={this.props.location.pathname} state={this.props.location.state} />
                    <div className={less.container}>
                        {this.props.children}
                    </div>
                    <div style={{ padding: "30px" }}>
                        <AppBottom />
                    </div>
                </div>
            </div>
        );
    }
}
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;