/**
 * Created by lixifeng on 17/3/24.
 */
import React, { Component } from 'react';
import AppTop from './AppTop.js';
import AppBottom from './AppBottom.js';
import less from './App.less';
class page extends Component {

    render() {
        console.log(window.screen.height);
        return (
            <div className={less.main}>
                <div className={less.mainBG} />
                <div className={less.mainContent}>
                    <AppTop
                        root={this}
                        {...this.props}
                        />
                    <div className={less.container} style={{minHeight:document.body.clientHeight-80}}>
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