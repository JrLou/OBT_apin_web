import React, {Component} from "react";
import {Icon, message, Upload, Modal, Spin} from 'antd';
const Dragger = Upload.Dragger;
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
      this.backUrl = this.props.urlArr || [];
   }

   componentDidMount(){
      //给ant-upload ant-upload-select ant-upload-select-picture-card这个元素绑定ondragenter & ondragover事件
      // let dragContainerEle = document.querySelector(".forUploadStyle .ant-upload.ant-upload-select-picture-card");


      //1、创建.ant-upload-select-picture-card的一个子元素，
      //2并撑满父级且添加dragenter和dragend事件，当dranter的时候，添加类，最后删除类
      /*********
      let parEle = document.querySelector(".forUploadStyle .ant-upload.ant-upload-select-picture-card");
      parEle.style.position = "relative";
      let dragContainerEle = document.createElement("div");
      parEle.appendChild(dragContainerEle);
      dragContainerEle.setAttribute("id","dragContainerEle");

      dragContainerEle.ondragenter = ()=>{
         dragContainerEle.style.border = "2px dashed #00A0E9";
         console.log("触发了：enter事件");
      };
      dragContainerEle.ondragleave = ()=>{
         dragContainerEle.style.border = "none";
         console.log("触发了：leave事件");
      };
      dragContainerEle.ondragend=(ev)=>{
          ev.preventDefault();
         dragContainerEle.style.border = "2px dashed transparent";
          console.log("ondragover的preventDefault事件");
      };
      *********/
   }

   isImageTypeOk(file) {
      if (!/^\w+((.jpeg)|(.png)|(.bmp))$/.test(file.type)) {
         message.warning("凭证必须为图片格式");
         return false;
      }
      if (file.size >= 1024 * 1024 * 4) {
         message.warning("图片过大，最大允许4M");
         return false;
      }
      return true;
   }

   beforeUpload(file) {
      if (!this.isImageTypeOk(file)) {
         this.setState({spinLoading: false});
         return false;
      }
   }

   handleChange(obj) {//这里的逻辑较为confusion
      let {fileList, file} = obj;
      if (file.status) {//确保当file为“加载中”的对象时，不更新视图和数据
         this.setState({spinLoading: true});
         let _fileList = JSON.parse(JSON.stringify(fileList));
         if (file.status == 'done') {
            let data = file.response.data;
            let currFile = {
               uid: new Date().getTime(),
               name: data.filename,
               status: 'done',
               url: data.url,
               thumbUrl: this.transform2thumbUrl(data.url),
            };
            let _backurl = {
               url: currFile.url,
               uid: currFile.uid
            };
            this.backUrl.push(_backurl);
            _fileList.pop();//清除antd自动添加的那个“加载中”的对象
            _fileList.push(currFile);
            setTimeout(() => {//去除闪屏问题
               this.setState({fileList: _fileList});
               this.setState({spinLoading: false});
            }, 500);
         } else {
            this.setState({fileList: _fileList});//antd中说明，这种受控组件每次都要setState否则就只有调用一次
         }
      }
   }

   handleCancel() {
      this.setState({previewVisible: false});
   }

   transform2thumbUrl(url){
      //具体可详见“七牛”的API
      return url + "?imageView2/2/w/368/h/214/interlace/1/q/99";
   }

   handlePreview(file) {
      this.setState({
         previewImage: "",
         previewVisible: true,
      },()=>{
         this.setState({
            previewImage: file.url
         });
      });

   }

   deepClone(obj) {
      return JSON.parse(JSON.stringify(obj));
   }

   onRemove(file) {
      console.log("删除的file为：");
      console.log(file);
      let _fileList = this.deepClone(this.state.fileList);
      _fileList = _fileList.filter((currV, index, arr) => {
         return currV.uid !== file.uid;
      });
      this.setState({fileList: _fileList}, () => {
         this.backUrl = this.backUrl.filter((currV, index, arr) => {
            return currV.uid !== file.uid;
         });
      });
   }

   render() {
      const {previewVisible, previewImage, fileList} = this.state;
      const upLoadingView = (<div>
         <Spin spinning={true} style={{marginTop:"20px"}}></Spin>
         <div className={less.upload_text_line2}>上传中</div>
      </div>);
      const beforeUploadingView = (<div>
         <Icon className={less.upload_text_line1} type="plus"/>
         <div className={less.upload_text_line2}>点击此处上传转账凭证</div>
         <div className={less.upload_text_line3}>最多添加 <span className={less.link_txt}>6</span> 张</div>
      </div>);
      const uploadButton = (
         <div className={less.upload_text}>
            {this.state.spinLoading ? upLoadingView : beforeUploadingView}
         </div>
      );
      const isIE9or8 = navigator.userAgent.indexOf("MSIE 9.0") >= 0 || navigator.userAgent.indexOf("MSIE 8.0") >= 0;
      return (
         <div className="clearfix forUploadStyle">
            <Upload
               accept=".jpg,.png,.bmp"
               action="/upload"
               listType="picture-card"
               fileList={fileList}
               beforeUpload={isIE9or8 ? null : this.beforeUpload.bind(this)}
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