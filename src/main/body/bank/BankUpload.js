import React, {Component} from "react";
import {Input, Form, Icon, message, Modal, Upload} from 'antd';
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
         className: less.form_control
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
                           prefix={<Icon type="credit-card" style={{fontSize: 13}}/>} placeholder={"请输入账户名"}
                        />
                     </div>
                  </div>

                  <div className={less.container2Son}>
                     <div className={less.form_group + " " + less.fl}>
                        <label htmlFor="accountName" className={less.control_label}>银行：</label>
                        <br/>
                        <Input
                           {...iptProps}
                           id="accountName"
                           onChange={(e) => {
                              this.setFomrFileds(e, "accountName");
                           }}
                           prefix={<Icon type="bank" style={{fontSize: 13}}/>} placeholder={"请输入账户名"}
                        />
                     </div>

                     <div className={less.form_group + " " + less.fl}>
                        <label htmlFor="cardNum" className={less.control_label}>转账金额：</label>
                        <br/>
                        <Input
                           {...iptProps}
                           id="cardNum"
                           onChange={(e) => {
                              this.setFomrFileds(e, "cardNum");
                           }}
                           prefix={<Icon type="pay-circle" style={{fontSize: 13}}/>} placeholder={"请输入账户名"}
                        />
                     </div>
                  </div>
               </div>
            </div>
            <div className={less.bankBox}>
               <div className={less.bankBox_top}>上传转账证明</div>
               <div className={less.bankBox_middle}>
                  <div>
                     {/*<UploadComponent/>*/}
                     <PicturesWall/>
                  </div>
               </div>
            </div>
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

/**** ↓这个版本用的时正常可以兼容的↓ *******/
class UploadComponent extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         previewVisible: false,
         previewImage: '',
         fileList: [
            // {
            //    uid: -1,
            //    name: 'xxx.png',
            //    status: 'done',
            //    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // }
         ],
         pzUrl: "",
      };
      this.isIMG = true;
   }

   beforeUpload(file) {
      if (file) {
         if (!/image\/\w+/.test(file.type)) {
            message.warning("凭证必须为图片格式");
            return false;
         }
         if (file.size >= 1024000 * 2) {
            message.warning("图片过大，最大允许2M。");
            return false;
         }
      }
      let r = new FileReader();
      r.readAsDataURL(file);
      r.onload = (e) => {
         let image_base64 = e.target.result;

         this.setState({
            fileList: [...this.state.fileList, {
               uid: new Date().getTime(),
               name: file.name,
               status: 'done',
               thumbUrl: image_base64,
            }],
            pzUrl: image_base64
         }, () => {
         });
         return false;
      };
      return false;
   }

   handleChange({fileList}) {
      if (!this.isIMG) {
         return;
      }
      console.log(fileList);
      this.setState({fileList}, () => {
         console.log(typeof this.state.fileList);
      });
      if (fileList[0] && (fileList[0].status === "done" || fileList[0].status === "error")) {
         let pzUrl = fileList[0] ? fileList[0].thumbUrl : "";
         this.setState({pzUrl});
      }
   }

   handleRemove(file) {
      this.setState({pzUrl: ""});
   }

   render() {
      const {previewVisible, previewImage, fileList} = this.state;
      const uploadButton = (
         <div>
            <Icon type="plus" style={{fontSize: 26, color: '#08c'}}/>
            <h1 className="ant-upload-text">上传转账凭证</h1>
         </div>//
      );
      return (
         <div className="clearfix forUploadStyle">
            <Upload
               action='//jsonplaceholder.typicode.com/posts/'
               listType="picture-card"
               fileList={fileList}
               beforeUpload={this.beforeUpload.bind(this)}
               onChange={this.handleChange.bind(this)}
               onRemove={this.handleRemove.bind(this)}
            >
               {fileList.length >= 6 ? null : uploadButton}
            </Upload>
         </div>
      );
   }
}

class PicturesWall extends Component {
   constructor(props) {
      super(props);
      this.state = {
         previewVisible: false,
         previewImage: '',
         fileList: [
            // {
            //    uid: -1,
            //    name: 'xxx.png',
            //    status: 'done',
            //    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // }
         ],
      };
   }

   beforeUpload(file) {
      if (file) {
         if (!/image\/\w+/.test(file.type)) {
            message.warning("凭证必须为图片格式");
            return false;
         }
         if (file.size >= 1024000 * 2) {
            message.warning("图片过大，最大允许2M。");
            return false;
         }
      }
      let r = new FileReader();
      r.readAsDataURL(file);
      r.onload = (e) => {
         let image_base64 = e.target.result;
         let tempObj = JSON.parse(JSON.stringify(this.state.fileList));
         console.log(tempObj);
         tempObj[0] = {
            uid: -1312,
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
         };
         tempObj.push({
            uid: new Date().getTime(),
            name: file.name,
            status: 'done',
            thumbUrl: image_base64,
         });
         console.log(tempObj);
         this.setState({
            fileList: tempObj,
            pzUrl: image_base64
         }, () => {
            console.log(this.state.fileList);
         });
         return false;
      };
      return false;
   }

   handleCancel() {
      this.setState({previewVisible: false});
   }

   handlePreview(file) {
      this.setState({
         previewImage: file.url || file.thumbUrl,
         previewVisible: true,
      });
   }

   handleChange({fileList}) {
      this.setState({fileList});
   }

   render() {
      const {previewVisible, previewImage, fileList} = this.state;
      const uploadButton = (
         <div>
            <Icon type="plus"/>
            <div className="ant-upload-text">Upload</div>
         </div>
      );
      return (
         <div className="clearfix forUploadStyle">
            <Upload
               action="//jsonplaceholder.typicode.com/posts/"
               listType="picture-card"
               fileList={fileList}
               beforeUpload={this.beforeUpload.bind(this)}
               onPreview={this.handlePreview.bind(this)}
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




