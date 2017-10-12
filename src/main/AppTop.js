/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import {Modal, Button,Icon,Menu,Dropdown} from 'antd';


 class page extends Component {

    constructor(props) {
        super(props);
    }

    showModal(visible) {
    }

    render() {
        return (
            <div>
                <div
                    style={{
                        color: "#000",
                        fontSize: "20px",
                    }}
                    onClick={() => {
                        log(this.props.root);
                        window.app_open(this.props.root, "/");
                    }}
                >
                    爱拼机(回首页)
                    www.apin.com
                </div>

            </div>
        );
    }
};
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;