import React, {Component} from 'react';
import less from './Pay.less';

import { Button, Modal} from 'antd';
class Panel extends Component{
    constructor(props) {
        super(props);
        this.state={update:0};

        this.loading = false;
        this.data = {};
        this.up = 0;
    }

    componentDidMount(){

    }

    show(loading,data,callBack){
       this.data = data;
       this.loading = loading;
       this.setState({update:++this.state.update},()=>{console.log("this.state.update",this.state.update,"this.up",this.up);});
       console.log("callBack",callBack);
       callBack();

    }


    getPayingLayout(){
        let verPay = (action)=>{

            if(this.props.onAction){
                this.props.onAction(action,this.data.showType);
            }
        };
        const ButtonGroup = Button.Group;
        return (
            <div>
                <div >{this.data.content}</div>
                <ButtonGroup>
                    <Button onClick={()=>{verPay("cancel");}} >{this.data.cancelText}</Button>
                    <Button onClick={()=>{verPay("ok");}} type="primary">{this.data.okText}</Button>

                </ButtonGroup>
            </div>
        );
    }

    getErrorLayout(){
        return (
            <div>
                <div style={{color:"red"}}>{this.data.content}</div>
                <Button  onClick={()=>this.show(false)} >我知道了</Button>
            </div>
        );
    }
    getSuccessLayout(){
        return (
            <div>
                <div style={{color:"green"}}>{this.data.content}</div>
                <Button  onClick={(action)=>{
                    if(this.props.onAction){
                        this.props.onAction("ok",this.data.showType);
                    }
                }} >查看订单</Button>
            </div>
        );
    }
    getLoadingLayout(){
        return (
            <div>
                <div style={{color:"block"}}>{this.data.content}</div>
            </div>
        );
    }

    render(){
        if( !this.loading){
            return null;
        }
        let view = null;
        switch (this.data.showType){
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
                {...this.data}
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