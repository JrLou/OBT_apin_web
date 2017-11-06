import React, {Component} from 'react';
import less from './UnionPayAdd.less';

import {Button, Form, Input, Icon, Spin, Modal, Radio} from 'antd';

const FormItem = Form.Item;

class PayPassWord extends Component {
   constructor(props) {
      super(props);
      this.defaultState = {
         loading: false,
         upLoad: false,
         value: 0,
         inputValue: "",
      };
      this.state = this.defaultState;
      this.showError();
   }


   show(loading, callBack) {
      this.showError();
      let s = Object.assign(this.defaultState);
      s.loading = loading;
      this.setState(s, callBack);
   }

   showError(msg) {
      if (msg) {
         this.validateStatus = "error";
         this.help = msg;
      } else {
         this.validateStatus = "";
         this.help = "";
      }

   }

   render() {
      if (!this.state.loading) {
         return null;
      }
      const formItemLayout = {
         labelCol: {
            xs: {span: 24},
            sm: {span: 5},
         },
         wrapperCol: {
            xs: {span: 24},
            sm: {span: 12},
         },
      };



      return (
         <Modal
            visible={true}
            title={"添加银联卡"}
            style={{
               position: "absolute",
               margin: "auto",
               top: 0,
               bottom: 0,
               right: 0,
               left: 0,
               height: 220
            }}
            width={400}
            confirmLoading={false}
            footer={null}
            onCancel={() => {
               this.show(false);
            }}
         >
           <div>
              <FormItem
                  className={less.cardNumForm}
                  {...formItemLayout}
                  label={"登录密码"}
                  validateStatus={this.validateStatus}
                  help={this.help}
              >
                 <Input
                     size={"large"}
                     style={{width: "240px"}}
                     className={less.cardNumIpt}
                     onChange={(e) => {
                         let v = e.target.value;
                         if (v) {
                             if (/^[0-9a-zA-Z]{8,16}$/.test(v)) {
                                 //成功
                                 this.showError();
                             } else {
                                 this.showError("请输入正确的卡号");
                             }
                         } else {
                             this.showError("请输入卡号");
                         }
                         this.setState({
                             inputValue: v
                         });
                     }}
                     prefix={<Icon type="credit-card" style={{fontSize: 13}}/>}
                     placeholder={"请输入登录密码"}/>
                 <Button
                     type="primary"
                     className={less.openCardBtn}
                     onClick={() => {
                         //开始上传
                         this.show(false,()=>{
                             if (this.props.onAction) {
                                 this.props.onAction(this.state.inputValue);
                             }
                         });


                     }}
                 >
                    付款
                 </Button>
              </FormItem>
           </div>
         </Modal>
      );
   }

}

PayPassWord.contextTypes = {
   router: React.PropTypes.object
};
module.exports = PayPassWord;