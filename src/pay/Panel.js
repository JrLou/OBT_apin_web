import React, {Component} from 'react';
import less from './Pay.less';

import { Button, Modal} from 'antd';
class Panel extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            data:{},
        };
    }
    show(loading,data,callBack){
        this.setState({
            loading,
            data
        },callBack);
    }


    getPayingLayout(){
        let verPay = (action)=>{

            if(this.props.onAction){
                this.props.onAction(action,this.state.data.showType);
            }
        };
        const ButtonGroup = Button.Group;
        return (
            <div>
                <div >{this.state.data.content}</div>
                <ButtonGroup>
                    <Button onClick={()=>{verPay("cancel");}} >{this.state.data.cancelText}</Button>
                    <Button onClick={()=>{verPay("ok");}} type="primary">{this.state.data.okText}</Button>

                </ButtonGroup>
            </div>
        );
    }

    getErrorLayout(){
        return (
            <div>
                <div style={{color:"red"}}>{this.state.data.content}</div>
                <Button  onClick={()=>this.show(false)} >我知道了</Button>
            </div>
        );
    }
    getSuccessLayout(){
        return (
            <div>
                <div style={{color:"green"}}>{this.state.data.content}</div>
                <Button  onClick={(action)=>{
                    if(this.props.onAction){
                        this.props.onAction("ok",this.state.data.showType);
                    }
                }} >查看订单</Button>
            </div>
        );
    }
    getLoadingLayout(){
        return (
            <div>
                <div style={{color:"block"}}>{this.state.data.content}</div>
            </div>
        );
    }

    render(){
        if( !this.state.loading){
            return null;
        }
        let view = null;
        switch (this.state.data.showType){
            case "loading":
            case "verpay":
                view = this.getLoadingLayout();
                break;
            case "error":
                view = this.getErrorLayout();
                break;
            case "success":
                view = this.getSuccessLayout();
                break;
            case "paying":
            case "unioning":
                view = this.getPayingLayout();
                break;
        }

        return (
            <Modal
                visible={true}
                style={{ top: 300 }}
                confirmLoading={false}
                maskClosable={false}
                closable={false}
                footer={null}
                {...this.state.data}
            >
                {view}
            </Modal>
        );
    }
}
Panel.contextTypes = {
    router: React.PropTypes.object
};
module.exports = Panel;