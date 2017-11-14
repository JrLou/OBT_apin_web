import React, {Component} from "react";
import {Input, Button, Icon, message} from 'antd';
import {HttpTool} from "../../../../lib/utils/index.js";
import Panel from '../../../pay/Panel';
import UploadCmp from './UploadCmp';
import less from "./BankUpload.less";


class BankUpload extends Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: true,
         errorMsg: "",
         is2modify: false,//是否是审核失败时候的《修改上穿页面》
         inputData: {},//当为《修改上穿页面》时，存储<InputLayout>组件所有需要的数据
         fileList: [],//当为《修改上穿页面》时，存储<UploadCmp>组件所有需要的数据
      };
      this.sourceData = [];//记录原始出入的数据，如果相同，则提示用户。
   }

   componentWillMount() {
      this.getPayInfo();
   }

   //获取url上面传来的数据
   getUrlInfo() {
      let msgString = decodeURIComponent(window.location.search).replace('?', '');
      let dataArr = msgString.split("=");//["data", "{"orderId":1,"price":39400}"]
      let data = {};
      for (let i = 0; i < dataArr.length; i += 2) {
         data[dataArr[i]] = JSON.parse(dataArr[i + 1]);
      }
      return data.data;//{"orderId":1,"price":39400}
   }

   loadPayInfo2modify(param, cb) {
      HttpTool.request(HttpTool.typeEnum.POST,
         "/bo/orderapi/v1.0/orders/recordQuery",
         (code, msg, json, option) => {
            cb(code, msg, json);
         }, (code, msg) => {
            cb(code, msg);
         }, param
      );
   }

   mothedStr2fileListArr(urlStr) {
      return urlStr.split(",").map((currV, i, arr) => {
         return {
            uid: i,
            name: "第" + i + "张",
            status: 'done',
            url: currV,
            thumbUrl: currV,
         };
      });
   }

   mothedStr2urlArr(urlStr) {
      return urlStr.split(",").map((currV, i, arr) => {
         return {
            uid: i,
            url: currV,
         };
      });
   }

   getPayInfo(cb) {
      let urlData = null;
      try {
         urlData = this.getUrlInfo();
      } catch (e) {
         this.setState({
            errorMsg: "传入的参数格式有误",
            loading: false
         });
         return;
      }

      //当有id字段的时候，代表这是：修改的页面，这里需要回显页面，所以请求接口
      if (urlData.id) {
         if (!urlData.orderId) {
            this.setState({
               errorMsg: "缺少订单号",
               loading: false
            });
            return;
         }
         this.loadPayInfo2modify({recordId: urlData.id}, (code, msg, data) => {
            this.sourceData = data;
            if (code > 0) {
               if (data === null) {
                  //打开404页面
                  window.app_open(this, "/None", {}, "self");
                  return;
               }
               let _inputData = {
                  accountName: data.accountName,
                  account: data.account,
                  bank: data.bank,
                  amount: data.payAmount,
               };
               let _fileList = this.mothedStr2fileListArr(data.voucherUrl);
               let _urlArr = this.mothedStr2urlArr(data.voucherUrl);
               this.setState({
                  payment: data.payment,
                  errorMsg: "",
                  orderId: urlData.orderId,
                  loading: false,
                  inputData: _inputData,
                  fileList: _fileList,
                  urlArr: _urlArr,
               });
            } else {
               this.setState({
                  errorMsg: msg,
                  loading: false,
               });
            }
         });
         return;
      }

      //当没有id字段时，则是空白的支付页面
      if (!urlData || !urlData.orderId || !urlData.price || urlData.payment == undefined) {
         this.setState({
            errorMsg: "缺少订单信息",
            loading: false
         });
      } else {
         this.setState({
            amount: urlData.price,
            orderId: urlData.orderId,
            payment: urlData.payment,//todo 定金？尾款？ 需要喜峰哥页面传过来
            loading: false,
            errorMsg: "",
         });
      }
   }

   getdefaultView() {
      return (
         <div>
            <div className={less.bankBox}>
               <div className={less.bankBox_top}>收款账户信息</div>
               <div className={less.bankBox_middle}>
                  <div className={less.bankBox_middle_tips}>
                     <span className={less.tipsIcon}><Icon type="exclamation-circle"/></span>
                     <span>建议在周一至周六，9:00~18:00内使用该转账功能。若在此时间之外，有可能导致审核异常，如有疑问，请&nbsp;{this.getConnetUs()}</span>
                  </div>
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
                  <div className={less.bankBox_middle_tips}>
                     <span className={less.tipsIcon}><Icon type="exclamation-circle"/></span>
                     <span>请优先选择"建行"转账，转账需确保1小时内到账，不然资金到账延时会导致财务审核不通过，敬请谅解！</span>
                  </div>
                  <InputLayout
                     ref={(ref) => {
                        this.inputLayout = ref;
                     }}
                     amount={this.state.amount}
                     data={this.state.inputData}

                  />
               </div>
            </div>
            <div className={less.bankBox}>
               <div className={less.bankBox_top}>上传转账证明</div>
               <div className={less.bankBox_middle}>
                  <div>
                     <UploadCmp
                        fileList={this.state.fileList}
                        urlArr={this.state.urlArr}
                        ref={(ref) => {
                           this.uploadCmp = ref;
                        }}
                     />
                  </div>
               </div>
            </div>
            <div className={less.txtCenter}>
               <Button
                  type={"primary"}
                  className={less.submitBtn}
                  onClick={() => {
                     this.handleSubmit();
                  }}
               >
                  提交
               </Button>
            </div>
            <Panel
               onAction={(action, showType) => {
                  if (action === "order" || action === "ok" && showType === "success") {
                     //打开订单页
                     this.openOrder();
                  }
               }}
               ref={(ref) => {
                  this.panel = ref;
               }}/>
         </div>
      );
   }

   openOrder() {
      window.app_open(this, "/OrderFormDetail", {
         id: this.getUrlInfo().orderId
      }, "self");
   }

   getLoadingView() {
      return <div className={less.loading}>正在为您拉取订单信息,请稍候...</div>;
   }

   getErrorView() {
      return (
         <div>
            <h1 style={{color: "red", textAlign: "center"}}>{this.state.errorMsg}</h1>
         </div>
      );
   }

   getConnetUs() {
      return (
         <a
            onClick={() => {
               if (window.ysf && window.ysf.open) {
                  // window.ysf.open();
                  window.ysf.product({
                     show: 1, // 1为打开， 其他参数为隐藏（包括非零元素）
                     title: "订单支付异常",
                     desc: "异常原因:" + (this.state.errorMsg || "未知"),
                     note: "订单号:" + this.orderId,
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
         </a>
      );
   }

   getAllData() {
      let data = this.inputLayout.getData();

      let backUrlArr = this.uploadCmp.backUrl.map((currV) => {
         return currV.url;
      });
      let stringUrl = backUrlArr.join(",");
      data.voucherUrl = stringUrl;

      Object.assign(data, this.state);
      data.payType = 0;//线下支付；
      return data;
   }

   isUserChange(param) {
      let isChange = false;
      for (let k in param) {
         if (k == "orderId") {
            continue;
         }
         if (k == "amount") {
            param["payAmount"] == this.sourceData[k] || (isChange = true);
         } else {
            param[k] == this.sourceData[k] || (isChange = true);
         }
      }
      return isChange;
   }

   handleSubmit() {
      //第一步:得到所有数据
      // 1填写的所有Form
      //2上传了至少一张图
      let data = this.getAllData();
      if (data.error) {
         message.error(data.error);
         return;
      }

      if (!data.voucherUrl.length) {
         message.error("请上传图片");
         return;
      }

      data.showType = "paying";
      data.orderId = this.state.orderId;
      let param = {
         account: data.account,
         accountName: data.accountName,
         amount: data.amount,
         bank: data.bank,
         orderId: data.orderId,
         payType: data.payType,
         payment: data.payment,
         voucherUrl: data.voucherUrl
      };
      //判断用户是否有更改
      if (!this.isUserChange(param)) {
         message.warn("您未做任何修改，无需提交");
         return;
      }

      this.panel.show(true, {
         content: "正在提交...",
         // title: "支付信息",
         showType: "verpay"
      }, () => {
         this.loadSubmit(param, (code, msg, data) => {
            if (code > 0) {
               //支付成功
               this.panel.show(true, {
                  showType: "success",
                  content: "凭证上传成功，审核中",
               }, () => {
                  //
               });
            } else {
               //支付失败
               this.panel.show(true, {
                  showType: "error",
                  content: <div>
                     <p>{msg}</p>
                     <p>如有疑问，请&nbsp;{this.getConnetUs()}</p>
                  </div>,
               }, () => {
                  //
               });
            }
         });
      });
   }

   //提交接口
   loadSubmit(param, cb) {
      // setTimeout(() => {
      //    let code = (Math.random() * 10).toFixed(0) - 5;
      //    let data = {};
      //    cb(code, code > 0 ? " 凭证上传成功，审核中" : "网络异常，上传失败！如有疑问，", data);
      // }, Math.random() * 1000 + 2000);

      HttpTool.request(HttpTool.typeEnum.POST,
         "/bo/orderapi/v1.0/orders/pay/offline",
         (code, msg, json, option) => {
            cb(code, msg, json);
         }, (code, msg, option) => {
            cb(code, msg);
         }, param);
   }

   render() {
      let contentView = null;
      if (this.state.loading) {
         contentView = this.getLoadingView();
      } else if (this.state.errorMsg) {
         contentView = this.getErrorView();
      } else {
         contentView = this.getdefaultView();
      }
      return (
         <div className={less.content}>
            {contentView}
         </div>
      );
   }
}


class InputLayout extends Component {
   constructor(props) {
      super(props);
      this.state = {
         accountName: this.props.data.accountName || '',//账户名
         account: this.props.data.account || "",//卡号
         bank: this.props.data.bank || "",//银行名
         amount: this.props.data.amount || this.props.amount,//转账金额
         error: null,
         loading: false,
      };
   }

   setFomrFileds(e, propName) {
      let v = e.target.value;
      if (v.length >= 64 || (propName == "account" && v.length >= 24)) {//后台设置的最大长度就是64
         return;
      }
      this.setState({
         [propName]: v
      }, () => {
         //
      });
   }

   isRightCardNum(account) {
      return account.length >= 12 && account.length <= 24;
   }

   formatDataState() {//删除首尾的空格
      let _state = JSON.parse(JSON.stringify(this.state));
      for (let k in _state) {
         if (typeof _state[k] === "string") {
            _state[k] = _state[k].trim();
         }
      }
      this.state = _state;
   }

   getData() {
      this.formatDataState();
      return {
         accountName: this.state.accountName,
         account: this.state.account,
         bank: this.state.bank,
         amount: this.state.amount,
         error: !this.state.accountName
            ?
            "请填写账户名"
            : (!this.isRightCardNum(this.state.account)
                  ?
                  "请填写正确的卡号"
                  : (!this.state.bank ? "请填写银行名" : null)
            )
      };
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
                     value={this.state.accountName}
                     onChange={(e) => {
                        this.setFomrFileds(e, "accountName");
                     }}
                     prefix={<Icon type="mobile" style={{fontSize: 13}}/>} placeholder={"请输入账户名"}
                  />
               </div>
               <div className={less.form_group + " " + less.fl}>
                  <label htmlFor="account" className={less.control_label}>卡号：</label>
                  <br/>
                  <Input
                     {...iptProps}
                     id="account"
                     onChange={(e) => {
                        if (Number.isInteger(+e.target.value)) {
                           this.setFomrFileds(e, "account");
                        }
                     }}
                     value={this.state.account}
                     prefix={<Icon type="credit-card" style={{fontSize: 13}}/>} placeholder={"请输入卡号"}
                  />
               </div>
            </div>

            <div className={less.container2Son}>
               <div className={less.form_group + " " + less.fl}>
                  <label htmlFor="bank" className={less.control_label}>银行：</label>
                  <br/>
                  <Input
                     {...iptProps}
                     value={this.state.bank}
                     id="bank"
                     onChange={(e) => {
                        this.setFomrFileds(e, "bank");
                     }}
                     prefix={<Icon type="bank" style={{fontSize: 13}}/>} placeholder={"请输入转账银行"}
                  />
               </div>

               <div className={less.form_group + " " + less.fl}>
                  <label htmlFor="amount" className={less.control_label}>转账金额：</label>
                  <br/>
                  <Input
                     {...iptProps}
                     id="amount"
                     value={this.state.amount + "元"}
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