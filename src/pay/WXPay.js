import React, {Component} from 'react';

import {Button, Form, Input, Icon, Spin, Modal, Radio} from 'antd';
let qr = require('qr-image');
class WXPay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data:{}
        };
    }


    show(loading, data,callBack) {
        this.setState({loading,data}, callBack);

    }
    render() {
        if (!this.state.loading) {
            return null;
        }
        let {data} = this.state;

        return (
            <Modal
                visible={true}
                title={"微信支付"}
                style={{
                   position: "absolute",
                   margin: "auto",
                   top: 0,
                   bottom: 0,
                   right: 0,
                   left: 0,
                   height: 470,

                }}
                width={400}
                maskClosable={false}
                confirmLoading={false}
                footer={null}
                onCancel={() => {
                    this.show(false);
                }}
            >
                <div style={{textAlign:"center"}}>
                    <span style={{color:"#333333",fontSize:14}}>支付金额:</span> <span style={{color:"#FF6600",fontSize:12}}>￥</span><span style={{color:"#FF6600",fontSize:28}}>{((data.payPrice)/100).toFixed(2)}</span>元

                    <div style={{color:"#333333",fontSize:14,margin: "8px 0 3px 0"}}>请使用微信扫描下方二维码完成支付</div>
                    <div style={{position:"relative",width:"85%",display:"inline-block"}}>
                        <div  dangerouslySetInnerHTML={{__html: qr.imageSync(data.url, { type: 'svg' })}} />
                        <img style={{position:"absolute",top:0,left:0,right:0,bottom:0,margin:"auto"}} src={require("./images/wx.png")}/>
                    </div>
                </div>
            </Modal>
        );
    }
}

module.exports = WXPay;