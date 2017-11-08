import React, {Component} from "react";
import {Icon, message, Upload} from 'antd';
import {HttpTool} from "../../../../lib/utils/index.js";
import less from "./BankUpload.less";

class UploadCmp extends Component {
   constructor(props) {
      super(props);
      this.state = {
         previewVisible: false,
         previewImage: '',
         fileList: [],
      };
      this._fileList = [];
      this.backUrl = [];
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
      // setTimeout(() => {
      //    let code = (Math.random() * 10).toFixed(0) - 5;
      //    let data = {};
      //    data.urlArr = [];
      //    data.urlArr.push("后台返回的体条url" + (Math.random() * 10).toFixed(0).repeat(4));
      //    cb(code, code > 0 ? "开通成功" : "开通失败", data);
      // }, Math.random() * 1000 + 1000);

      HttpTool.request(HttpTool.typeEnum.POST,
         "/orderapi/v1.0/orders/voucherUp",
         (code, msg, json, option) => {
            cb(code, msg, json);

         }, (code, msg, option) => {
            cb(code, msg);
         }, param);
   }

   saveImgUrlArr() {

   }

   beforeUpload(file) {
      if (!this.isImageTypeOk(file)) {
         console.log("cuowul ");
         return false;
      }
      console.log("图片上传....");


      let r = new FileReader();
      r.readAsDataURL(file);
      r.onload = (e) => {
         let image_base64 = e.target.result;

         this._fileList.push({
            uid: new Date().getTime(),
            name: file.name,
            status: 'done',
            thumbUrl: image_base64,
         });

         this.loadUploadImg({pic: this._fileList[this._fileList.length - 1].thumbUrl}, (code, msg, data) => {
            if (code < 0) {
               message.error(msg + "图片上传失败");
               return false;//todo 这个false会不会到beforUpload里来？
            } else {
               this.setState({
                  fileList: this._fileList
               });
               let _backurl = {
                  url: data.url,
                  uid: this._fileList[this._fileList.length - 1].uid
               };
               this.backUrl.push(_backurl);
               console.log("完成了setState.fileList的更新视图");
               console.log("本地存储的后台返回url为：backUrl:");
               console.log(this.backUrl);
            }
         });
         console.log("onload的return false");
         return false;
      };
      console.log("阻止上传的return false");
      return false;
   }

   handleChange({fileList}) {
      console.log("onchange");
      console.log(fileList);
      // this.setState({fileList}, () => {
      //    console.log("arguments");
      //    console.log(arguments);
      // });
   }

   onRemove(file) {
      console.log("删除的file为：");
      console.log(file);
      this._fileList = this._fileList.filter((currV, index, arr) => {
         return currV.uid !== file.uid;
      });
      this.setState({fileList: this._fileList});
      this.backUrl = this.backUrl.filter((currV, index, arr) => {
         return currV.uid !== file.uid;
      });
   }

   render() {
      const {fileList} = this.state;
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
               onRemove={this.onRemove.bind(this)}
            >
               {fileList.length >= 6 ? null : uploadButton}
            </Upload>
         </div>
      );
   }
}

UploadCmp.contextTypes = {
   router: React.PropTypes.object
};
module.exports = UploadCmp;