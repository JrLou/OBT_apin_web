import React, {Component} from "react";
import {Input, Button, Icon, message, Modal, Upload} from 'antd';
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
            transferAmount:data.price/100
         });
      }
   }

   setFomrFileds(e, propName) {
      let v = e.target.value;
      this.setState({
         [propName]: v
      }, () => {
         //
      });
   }

   getdefaultView() {
      const iptProps = {
         size: "large",
         className: less.form_control,
      };
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
                           id="bankName"
                           onChange={(e) => {
                              this.setFomrFileds(e, "bankName");
                           }}
                           prefix={<Icon type="bank" style={{fontSize: 13}}/>} placeholder={"请输入银行名"}
                        />
                     </div>

                     <div className={less.form_group + " " + less.fl}>
                        <label htmlFor="transferAmount" className={less.control_label}>转账金额：</label>
                        <br/>
                        <Input
                           {...iptProps}
                           id="transferAmount"
                           defaultValue={this.state.transferAmount + "元"}
                           disabled={true}
                           onChange={(e) => {
                              this.setFomrFileds(e, "transferAmount");
                           }}
                           prefix={<Icon type="pay-circle" style={{fontSize: 13}}/>}
                        />
                     </div>
                  </div>
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
                  onClick={()=>{
                     //
                     this.panel.show();
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

   //模拟上传的接口
   loadPayOrder(param, cb) {
      setTimeout(() => {
         let code = (Math.random() * 10).toFixed(0) - 1;
         let data = {};
         data.url = "http://www.baidu.com";
         data.payPrice = (Math.random() * 10000).toFixed(0);
         cb(code, "无库存了/或者其他", data);
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
   }

   isImageTypeOk(file) {
      if (!/image\/\w+/.test(file.type)) {
         message.warning("凭证必须为图片格式");
         return false;
      }
      if (file.size >= 1024000 * 2) {
         message.warning("图片过大，最大允许2M。");
         return false;
      }
      return true;
   }

   beforeUpload(file) {
      return this.isImageTypeOk(file) ? true : false;


      // const isJPG = file.type === 'image/jpeg';
      // if (!isJPG) {
      //    message.error('凭证必须为图片格式');
      // }
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isLt2M) {
      //    message.error('图片过大，最大允许2M。');
      // }
      // return isJPG && isLt2M;

      // let r = new FileReader();
      // r.readAsDataURL(file);
      // r.onload = (e) => {
      //    let image_base64 = e.target.result;
      //    this.setState({
      //       fileList: [{
      //          uid: new Date().getTime(),
      //          name: file.name,
      //          status: 'done',
      //          thumbUrl: image_base64,
      //       }],
      //       pzUrl: image_base64
      //    }, () => {
      //       console.log(this.state.fileList);
      //    });
      //    return false;
      // };
      // return false;//自动上传
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
               action="//jsonplaceholder.typicode.com/posts/"
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

BankUpload.contextTypes = {
   router: React.PropTypes.object
};
module.exports = BankUpload;




