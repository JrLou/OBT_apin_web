import React, {Component} from 'react';
import less from './Panel.less';

import {Button, Modal} from 'antd';

class Panel extends Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: false,
         data: {},
      };
   }

   show(loading, data, callBack) {
      this.setState({
         loading,
         data
      }, callBack);
   }


   getPayingLayout() {
      let verPay = (action) => {

         if (this.props.onAction) {
            this.props.onAction(action, this.state.data.showType);
         }
      };
      return (
         <div>
            <div className={less.getPayingLayout}>{this.state.data.content}</div>
            <Button
               className={less.modalBtn}
               onClick={() => {
               verPay("cancel");
            }}>{this.state.data.cancelText}</Button>
            <Button
               className={less.modalBtn}
               onClick={() => {
               verPay("ok");
            }} type="primary">{this.state.data.okText}</Button>
         </div>
      );
   }

   getErrorLayout() {
      return (
         <div>
            <img className={less.infoImg} src={require("./images/payErr.png")} alt="支付失败"/>
            <div style={{color: "red"}}>{this.state.data.content}</div>
            <Button
               className={less.modalBtn}
               type={"primary"}
               onClick={() => this.show(false)}>
               我知道了
            </Button>
         </div>
      );
   }

   getSuccessLayout() {
      return (
         <div>
            <img className={less.infoImg} src={require("./images/paySucc.png")} alt="支付成功"/>
            <div style={{color: "green"}}>{this.state.data.content}</div>
            <Button
               className={less.modalBtn}
               type={"primary"}
               onClick={(action) => {
                  if (this.props.onAction) {
                     this.props.onAction("ok", this.state.data.showType);
                  }
               }}>查看订单</Button>
         </div>
      );
   }

   getLoadingLayout() {
      return (
         <div>
            <div className={less.animationGroup}>
               <span className={less.animationGroup_circle}></span>
               <span className={less.animationGroup_circle}></span>
               <span className={less.animationGroup_circle}></span>
            </div>

            <div>{this.state.data.content}</div>
         </div>
      );
   }

   render() {
      if (!this.state.loading) {
         return null;
      }
      let view = null;
      switch (this.state.data.showType) {
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
            width={400}
            style={{
               position: "absolute",
               margin: "auto",
               top: 0,
               bottom: 0,
               right: 0,
               left: 0,
               height: 220,
            }}
            confirmLoading={false}
            maskClosable={false}
            closable={false}
            footer={null}
            {...this.state.data}
         >
            <div className={less.modalConent}>
               {view}
            </div>
         </Modal>
      );
   }
}

Panel.contextTypes = {
   router: React.PropTypes.object
};
module.exports = Panel;