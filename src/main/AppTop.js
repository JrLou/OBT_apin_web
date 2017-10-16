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
                <img
                    onClick={() => {
                        log(this.props.root);
                        window.app_open(this.props.root, "/");
                    }}
                    style={{
                        position:"absolute",
                        marginTop:7,
                        width: 180,
                        height: 50,
                }} src={require('../images/index_logo.png')}
                />
                <div style={{position:"absolute",right:50,
                  }}>
                    {/*<img*/}
                        {/*style={{*/}
                            {/*width: 40,*/}
                            {/*height: 40,*/}
                            {/*marginTop:12,*/}
                            {/*marginRight:10*/}
                        {/*}} src={require('../images/check.png')}*/}
                    {/*/>*/}
                        <div style={{fontSize:14,color:"#666"}}>客服电话</div>
                        <div style={{fontSize:16,color:"#34b0ff"}}>0571-58122998</div>
                </div>
            </div>
        );
    }
};
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;