import React, {Component} from 'react';
import less from './UnionPayAdd.less';
import {HttpTool} from "../../lib/utils/index.js";
import {Button, Form, Input, Icon, Spin,message, Modal, Radio} from 'antd';

const FormItem = Form.Item;

class PayPassWord extends Component {
   constructor(props) {
      super(props);
      this.state = {
          data:{},
          loading: false,
      };
   }


   show(loading, data,callBack) {
      this.setState({
          loading,
          data,
      }, callBack);
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
            title={"验证身份信息"}
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
               <InputLayout
                   moblie={this.state.data.phone}
                   ref={(ref) => {
                   this.inputLayout = ref;
               }}/>
                 <Button
                     type="primary"
                     className={less.openCardBtn}
                     onClick={() => {
                         //开始上传
                         let data = this.inputLayout.getData();
                         if (data.error) {
                             message.error(data.error);
                             return;
                         }
                         this.show(false,null,()=>{
                             if (this.props.onAction) {
                                 this.props.onAction(data.moblie,data.code);
                             }
                         });

                     }}
                 >
                    付款
                 </Button>
           </div>
         </Modal>
      );
   }

}

class InputLayout extends Component {
    constructor(props) {
        super(props);
        this.defaultTime = 60;
        this.state = {
            moblie:this.props.moblie|| "",
            code: "",
            time: 0,
            loading: false,
        };
    }
    componentWillUnmount() {
        this.un = true;
    }

    getData() {
        return {
            moblie: this.state.moblie,
            code: this.state.code,
            error: this.state.moblie.length !== 11 ? "请填写正确的手机号" : (this.state.code.length !== 6 ? "请填写正确的验证码" : null)
        };

    }

    loadPhoneCode(param, cb) {
        HttpTool.request(HttpTool.typeEnum.POST, "/bohl/orderapi/v1.0/orders/code", (code, msg, json, option) => {
            cb(code,msg,json);
        }, (code, msg, option) => {
            cb(code,msg, {});
        }, param);
        // setTimeout(() => {
        //     let code = (Math.random() * 10).toFixed(0) - 5;
        //     //todo 没有data吧?
        //     let data = [];
        //     cb(code, code > 0 ? "获取成功" : "获取失败", data);
        // }, Math.random() * 1000);
    }

    autoTime(time) {
        if(this.un){
            return;
        }
        if (time > 0) {
            let diff = time - 1;
            this.setState({
                time: diff
            }, () => {
                setTimeout(() => {
                    this.autoTime(diff);
                }, 1000);
            });
        } else {
            if(this.un){
                return;
            }
            this.setState({
                time: 0
            });
        }

    }

    render() {

        return (
            <div>
                <div style={{lineHeight: "40px"}}>
                    <label htmlFor="mobileIpt" className={less.label}>账户手机号：</label>
                    <Input
                        id="mobileIpt"
                        size="large"
                        disabled={true}
                        defaultValue={this.state.moblie}
                        onChange={(e) => {
                            let v = e.target.value;
                            this.setState({
                                moblie: v
                            }, () => {

                            });

                        }}
                        style={{width: 130}}
                        prefix={<Icon type="mobile" style={{fontSize: 13}}/>} placeholder={"请输入账户手机号"}
                    />
                </div>
                <div style={{lineHeight: "40px"}}>
                    <label htmlFor="codeIpt" className={less.label}>短信验证码：</label>
                    <Input
                        id="codeIpt"
                        size="large"
                        onChange={(e) => {
                            let v = e.target.value;
                            this.setState({
                                code: v
                            });
                        }}
                        style={{width: 130, marginRight:"15px"}}
                        prefix={<Icon type="key" style={{fontSize: 13}}/>}
                        placeholder={"请输入短信验证码"}
                    />
                    <Button
                        size={"large"}
                        loading={this.state.loading}
                        type="primary"
                        disabled={this.state.time > 0 || this.state.moblie.length !== 11}
                        onClick={() => {
                            if (this.state.loading || this.state.time > 0) {
                                return;
                            }
                            this.setState({
                                loading: true
                            });
                            this.loadPhoneCode({
                                phone:this.state.moblie,
                            }, (code, msg, data) => {
                                if(code>0){
                                    message.success(msg);
                                }else{
                                    this.setState({
                                        loading: false
                                    });
                                    message.error(msg);
                                    return;
                                }

                                this.setState({
                                    loading: false
                                }, () => {
                                    let succ = !!code;
                                    if (succ) {
                                        this.autoTime(this.defaultTime);
                                    } else {
                                        message.error(msg);
                                    }
                                });

                            });
                        }}
                    >
                        {(this.state.time > 0 ? ("(" + this.state.time + "s)") : "") + "发送验证码"}

                    </Button>
                </div>

            </div>
        );
    }
}
PayPassWord.contextTypes = {
   router: React.PropTypes.object
};
module.exports = PayPassWord;