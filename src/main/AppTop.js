/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import {Modal, Button,Icon,Menu,Dropdown} from 'antd';

import less from "./AppTop.less";
 class page extends Component {

    constructor(props) {
        super(props);
    }

    showModal(visible) {
    }

    render() {
        return (
            <div className={less.head}>
                <img
                    onClick={() => {
                        log(this.props.root);
                        window.app_open(this.props.root, "/");
                    }}
                    className={less.left}
                    src={require('../images/index_logo.png')}
                />
                <div className={less.right}>
                    <div className={less.rightItem}>
                        <img
                            className={less.rightIcon}src={require('../images/phone.png')}
                        />
                    </div>
                    <div className={less.rightItem}>
                        <font style={{fontSize:14,color:"#666"}}>客服电话</font>
                        <br/>
                        <font style={{fontSize:16,color:"#34b0ff"}}>0571-58122998</font>
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