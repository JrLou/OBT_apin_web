import React, {Component} from "react";
import {Icon, message, Upload, Modal, Spin} from 'antd';
import {HttpTool} from "../../../../lib/utils/index.js";
import less from "./BankUpload.less";

class UploadCmp extends Component {
   constructor(props) {
      super(props);
      this.state = {
         previewVisible: false,
         previewImage: '',
         fileList: this.props.fileList || [],
         spinLoading: false,
      };
      this._fileList = this.props.fileList || [];
      this.backUrl = this.props.urlArr || [];
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
         "/bohl/orderapi/v1.0/orders/voucherUp",
         (code, msg, json, option) => {
            cb(code, msg, json);

         }, (code, msg, option) => {
            cb(code, msg);
         }, param);
   }

   saveImgUrlArr() {
      //
   }

   beforeUpload(file) {
      if (!this.isImageTypeOk(file)) {
         return false;
      }
      //
      // //打开加载图
      // if (this.state.spinLoading) {
      //    message.warn("图片正在上传中，请勿重复点击");
      //    return false;
      // }
      // this.setState({spinLoading: true});
      //
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
      //    //慢600毫秒再请求，这样不会闪一下，体验好一些
      //    setTimeout(() => {
      //       this.loadUploadImg({pic: this._fileList[this._fileList.length - 1].thumbUrl}, (code, msg, data) => {
      //          if (code < 0) {
      //             message.error(msg + "图片上传失败");
      //          } else {
      //             this.setState({
      //                fileList: this._fileList
      //             });
      //             let _backurl = {
      //                url: data.url,
      //                uid: this._fileList[this._fileList.length - 1].uid
      //             };
      //             this.backUrl.push(_backurl);
      //          }
      //          this.setState({spinLoading: false});
      //       });
      //    }, 600);
      //
      //
      // };
      // return false;
   }

   handleChange(file,fileList) {
      console.log("handleChange");
      console.log(arguments);
      console.log("file");
      console.log(file);
      console.log("fileList");
      console.log(fileList);
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

   onRemove(file) {
      console.log("删除的file为：");
      console.log(file);
      this._fileList = this._fileList.filter((currV, index, arr) => {
         return currV.uid !== file.uid;
      });
      this.setState({fileList: this._fileList}, () => {
         this.backUrl = this.backUrl.filter((currV, index, arr) => {
            return currV.uid !== file.uid;
         });
      });

   }

   render() {
      const {previewVisible, previewImage, fileList} = this.state;
      const upLoadingView = (<div>
         <Spin spinning={true}></Spin>
         <div className={less.upload_text_line2}>上传中</div>
      </div>);
      const beforeUploadingView = (<div>
         <Icon className={less.upload_text_line1} type="plus"/>
         <div className={less.upload_text_line2}>点击此处上传转账凭证</div>
         <div className={less.upload_text_line3}>最多添加 6 张</div>
      </div>);
      const uploadButton = (
         <div className={less.upload_text}>
            {this.state.spinLoading ? upLoadingView : beforeUploadingView}
         </div>
      );
      return (
         <div className="clearfix forUploadStyle">
            <Upload
               action="/Upload"
               listType="picture-card"
               fileList={fileList}
               beforeUpload={this.beforeUpload.bind(this)}
               disabled={this.state.spinLoading}
               onPreview={this.handlePreview.bind(this)}
               onChange={this.handleChange.bind(this)}
               onRemove={this.onRemove.bind(this)}
            >
               {fileList.length >= 6 ? null : uploadButton}
            </Upload>
            <Modal
               visible={previewVisible}
               footer={null}
               onCancel={this.handleCancel.bind(this)}
               width={"813"}
            >
               <img alt="example" style={{width: '100%'}} src={previewImage}/>
            </Modal>
         </div>
      );
   }
}

UploadCmp.contextTypes = {
   router: React.PropTypes.object
};
module.exports = UploadCmp;