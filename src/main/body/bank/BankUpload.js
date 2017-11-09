import React, {Component} from "react";
import {Input, Button, Icon, message, Modal, Upload} from 'antd';
import {HttpTool} from "../../../../lib/utils/index.js";
import Panel from '../../../pay/Panel';
import less from "./BankUpload.less";


class BankUpload extends Component {
   constructor(props) {
      super(props);
      this.state = {
         error: "",
      };
   }

   componentWillMount() {
      this.loadPayInfo();
   }

   //获取url上面传来的数据
   getData() {
      let msgString = decodeURIComponent(window.location.search).replace('?', '');
      let dataArr = msgString.split("=");//["data", "{"id":1,"price":39400}"]
      let data = {};
      for (let i = 0; i < dataArr.length; i += 2) {
         data[dataArr[i]] = JSON.parse(dataArr[i + 1]);
      }
      return data.data;
   }

   loadPayInfo(param, cb) {
      let data = this.getData();
      if (!data || !data.id || !data.price) {
         this.setState({
            error: "缺少支付信息"
         });
      } else {
         this.setState({
            transferAmount: data.price / 100
         });
      }
   }

   getdefaultView() {
      return (
         <div>
            <div className={less.bankBox}>
               <div className={less.bankBox_top}>收款账户信息</div>
               <div className={less.bankBox_middle}>
                  <div>
                     <p>
                        <span className={less.bankBox_middle_titleMsg}>收款账户：</span>
                        <span className={less.bankBox_middle_msg}>杭州爱拼机网络科技有限公司</span>
                     </p>
                     <p>
                        <span className={less.bankBox_middle_titleMsg}>开户行：</span>
                        <span className={less.bankBox_middle_msg}>中国建设银行杭州白马湖支行</span>
                     </p>
                     <p>
                        <span className={less.bankBox_middle_titleMsg}>账号：</span>
                        <span className={less.bankBox_middle_msg}>33001618185052504120 </span>
                     </p>
                  </div>

               </div>
            </div>
            <div className={less.bankBox}>
               <div className={less.bankBox_top}>付款账户信息</div>
               <div className={less.bankBox_middle}>
                  <InputLayout
                     ref={(ref) => {
                        this.inputLayout = ref;
                     }}
                     transferAmount={this.state.transferAmount}
                  />

               </div>
            </div>
            <div className={less.bankBox}>
               <div className={less.bankBox_top}>上传转账证明</div>
               <div className={less.bankBox_middle}>
                  <div>
                     <UploadCmp/>
                  </div>
               </div>
            </div>
            <div className={less.txtCenter}>
               <Button
                  type={"primary"}
                  className={less.submitBtn}
                  onClick={() => {
                     //第一步:得到所有数据
                     // 1填写的所有Form
                     //2上传了至少一张图

                     let data = this.inputLayout.getData();
                     if (data.error) {
                        message.error(data.error);
                        return;
                     }
                     data.urlArr = [];//后台获取的数据一条一条push进去
                     data.showType = "paying";

                     this.panel.show(true, {
                        content: "正在提交...",
                        // title: "支付信息",
                        showType: "verpay"
                     }, () => {
                        this.loadSubmit(data, (code, msg, data) => {
                           if (code > 0) {
                              //支付成功
                              this.panel.show(true, {
                                 showType: "success",
                                 content: msg,
                              }, () => {
                                 //
                              });
                           } else {
                              //支付失败
                              const connectUs = <a
                                 onClick={() => {
                                    if (window.ysf && window.ysf.open) {
                                       // window.ysf.open();
                                       window.ysf.product({
                                          show: 1, // 1为打开， 其他参数为隐藏（包括非零元素）
                                          title: "订单支付异常",
                                          desc: "异常原因:" + (this.state.error || "未知"),
                                          note: "订单号:" + this.id,
                                          url: window.location.host,
                                          success: function () {     // 成功回调
                                             window.ysf.open();
                                          },
                                          error: function () {       // 错误回调
                                             // handle error
                                          }
                                       });
                                    } else {
                                       message.warn("");
                                    }
                                 }}>
                                 联系客服
                              </a>;
                              this.panel.show(true, {
                                 showType: "error",
                                 content: <div>{msg}{connectUs}</div>,
                              }, () => {
                                 //
                              });
                           }
                        });
                     });
                  }}
               >
                  提交
               </Button>
            </div>
            <Panel
               onAction={(action, showType) => {

                  if (showType === "paying") {
                     //验证是否支付
                     this.handVer("pay", action);
                  } else if (showType === "unioning") {
                     //验证是否开通
                     this.handVer("union");
                  }
                  else if (action === "ok" && showType === "success") {
                     //打开订单页
                     window.app_open(this, "/Order", {
                        id: this.id
                     }, "self");
                  }

               }}
               ref={(ref) => {
                  this.panel = ref;
               }}/>
         </div>
      );
   }

   getErrorView() {
      return (
         <div>
            {this.state.error}
         </div>
      );
   }

   //模拟提交接口
   loadSubmit(param, cb) {
      console.log("传给后台的数据如下");
      console.log(param);
      setTimeout(() => {
         let code = (Math.random() * 10).toFixed(0) - 5;
         let data = {};
         cb(code, code > 0 ? " 凭证上传成功，审核中" : "网络异常，上传失败！如有疑问，", data);
      }, Math.random() * 1000 + 2000);
   }

   render() {
      return (
         <div
            {...this.props}
            className={less.content}
         >
            {this.state.error ? this.getErrorView() : this.getdefaultView()}
         </div>
      );
   }
}

class UploadCmp extends Component {
   constructor(props) {
      super(props);
      this.state = {
         previewVisible: false,
         previewImage: '',
         fileList: [],
      };
      this._fileList = [];
   }

   isImageTypeOk(file) {
      if (!/image\/\w+/.test(file.type)) {
         message.warning("凭证必须为图片格式");
         return false;
      }
      if (file.size >= 1024000 * 4) {
         message.warning("图片过大，最大允许4M。");
         return false;
      }
      return true;
   }


   //模拟上传的接口
   loadUploadImg(param, cb) {
      setTimeout(() => {
         let code = (Math.random() * 10).toFixed(0) - 5;
         let data = {};
         data.urlArr = [];
         data.urlArr.push("后台返回的体条url" + (Math.random() * 10).toFixed(0).repeat(4));
         cb(code, code > 0 ? "开通成功" : "开通失败", data);
      }, Math.random() * 1000 + 1000);

      HttpTool.request(HttpTool.typeEnum.POST,
         "/orderapi/v1.0/orders/voucherUp",
         (code, msg, json, option) => {


         }, (code, msg, option) => {
         }, param);
   }

   beforeUpload(file) {
      if (!this.isImageTypeOk(file)) {
         console.log("cuowul ");
         return false;
      }
      console.log("图片上传....");

      // this.loadUploadImg({}, (code, msg, data) => {
      //    console.log("code");
      //    console.log(code);
      //    if (code < 0) {
      //       message.error("图片上传失败");
      //       console.log("图片上传失败");
      //       return false;
      //    }
      // });

      // let r = new FileReader();
      // r.readAsDataURL(file);
      // r.onload = (e) => {
      //    let image_base64 = e.target.result;
      //
      //    this._fileList.push({
      //       uid: new Date().getTime(),
      //       name: file.name,
      //       status: 'done',
      //       thumbUrl: image_base64,
      //    });
      //
      //    this.setState({
      //       fileList: this._fileList,
      //       pzUrl: image_base64
      //    }, () => {
      //       console.log(this.state.fileList);
      //    });
      //    console.log("onload的return false");
      //    return false;
      // };
      // console.log("阻止上传的return false");
      // return false;
   }

   handleCancel() {
      this.setState({previewVisible: false});
   }

   handleChange({fileList}) {
      this.setState({fileList}, () => {
         console.log("arguments");
         console.log(arguments);
      });

   }

   render() {
      const {previewVisible, previewImage, fileList} = this.state;
      const uploadButton = (
         <div>
            <Icon className={less.upload_text1} type="plus"/>
            <div className={less.upload_text2}>点击此处上传转账凭证</div>
            <div className={less.upload_text3}>最多添加 6 张</div>
         </div>
      );
      return (
         <div className="clearfix forUploadStyle">
            <Upload
               action="/orderapi/v1.0/orders/voucherUp"
               listType="picture-card"
               fileList={fileList}
               beforeUpload={this.beforeUpload.bind(this)}
               onChange={this.handleChange.bind(this)}
            >
               {fileList.length >= 6 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
               <img alt="example" style={{width: '100%'}} src={previewImage}/>
            </Modal>
         </div>
      );
   }
}

class InputLayout extends Component {
   constructor(props) {
      super(props);
      this.state = {
         accountName: "",//账户名
         cardNum: "",//卡号
         bankName: "",//银行名
         transferAmount: this.props.transferAmount,//转账金额
         error: null,
         loading: false,
      };
   }

   setFomrFileds(e, propName) {
      let v = e.target.value;
      this.setState({
         [propName]: v
      }, () => {
         //
      });
   }

   isRightCardNum(cardNum) {
      return cardNum.length >= 12 && cardNum.length <= 24;
   }


   getData() {
      return {
         accountName: this.state.accountName,
         cardNum: this.state.cardNum,
         bankName: this.state.bankName,
         transferAmount: this.state.transferAmount,
         error: !this.state.accountName
            ?
            "请填写账户名"
            : (!this.isRightCardNum(this.state.cardNum)
                  ?
                  "请填写正确的卡号"
                  : (!this.state.bankName ? "请填写银行名" : null)
            )
      };

   }

   //模拟获取银行名称接口
   loadBankName(param, cb) {
      setTimeout(() => {
         let code = (Math.random() * 10).toFixed(0) - 1;
         let data = {bankName: "中国工商银行"};
         cb(code, "", data);
      }, Math.random() * 1000 + 500);
   }

   render() {
      const iptProps = {
         size: "large",
         className: less.form_control,
      };
      return (
         <div>
            <div className={less.container2Son}>
               <div className={less.form_group + " " + less.fl}>
                  <label htmlFor="accountName" className={less.control_label}>账户名：</label>
                  <br/>
                  <Input
                     {...iptProps}
                     id="accountName"
                     onChange={(e) => {
                        this.setFomrFileds(e, "accountName");
                     }}
                     prefix={<Icon type="mobile" style={{fontSize: 13}}/>} placeholder={"请输入账户名"}
                  />
               </div>
               <div className={less.form_group + " " + less.fl}>
                  <label htmlFor="cardNum" className={less.control_label}>卡号：</label>
                  <br/>
                  <Input
                     {...iptProps}
                     id="cardNum"
                     onChange={(e) => {
                        this.setFomrFileds(e, "cardNum");
                     }}
                     onBlur={() => {
                        //请求查询银行的接口
                        if (this.isRightCardNum(this.state.cardNum)) {
                           console.log("查询中");
                           this.loadBankName(this.state.cardNum, (code, msg, data) => {
                              if (code > 0) {
                                 this.setState({
                                    bankName: data.bankName,
                                    getBankName: true
                                 }, () => {
                                    console.log(this.state.bankName);
                                 });
                                 return;
                              }
                           });
                        }

                        this.setState({
                           bankName: "",
                           getBankName: false
                        });

                     }}
                     prefix={<Icon type="credit-card" style={{fontSize: 13}}/>} placeholder={"请输入卡号"}
                  />
               </div>
            </div>

            <div className={less.container2Son}>
               <div className={less.form_group + " " + less.fl}>
                  <label htmlFor="bankName" className={less.control_label}>银行：</label>
                  <br/>
                  <Input
                     {...iptProps}
                     readOnly={this.state.getBankName || this.isRightCardNum(this.state.cardNum)}
                     value={this.state.bankName}
                     id="bankName"
                     onChange={(e) => {
                        this.setFomrFileds(e, "bankName");
                     }}
                     prefix={<Icon type="bank" style={{fontSize: 13}}/>} placeholder={"请输入转账银行"}
                  />
               </div>

               <div className={less.form_group + " " + less.fl}>
                  <label htmlFor="transferAmount" className={less.control_label}>转账金额：</label>
                  <br/>
                  <Input
                     {...iptProps}
                     id="transferAmount"
                     value={this.state.transferAmount + "元"}
                     readOnly={true}
                     prefix={<Icon type="pay-circle" style={{fontSize: 13}}/>}
                  />
               </div>
            </div>
         </div>
      );
   }
}


BankUpload.contextTypes = {
   router: React.PropTypes.object
};
module.exports = BankUpload;




