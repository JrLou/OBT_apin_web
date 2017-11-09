import React, {Component} from 'react';
import less from './UnionPay.less';
import {Button, Row, Input, Form, Icon, message} from 'antd';
import {HttpTool} from "../../lib/utils/index.js";
import Item from './Item';
import UnionPayAdd from './UnionPayAdd.js';

class UnionPay extends Component {
   constructor(props) {
      super(props);
      this.state = {
         loading: true,
         error: "",
         cardList: [],
         selectIndex: 0
      };
   }

   show(loading, callBack) {
      this.setState({
         loading
      }, callBack);
   }

   setLoading(loading, cb) {
      this.setState({
         loading
      }, cb);
   }

   componentDidMount() {
      if (this.un) {
         return;
      }
      this.refreshList();
   }

   refreshList() {
      this.show(true, () => {
         this.loadUnionPayList({}, (code, msg, data) => {
            if (this.un) {
               return;
            }
            this.setState({
               loading: false,
               error: code > 0 ? "" : msg,
               cardList: data,
            });
         });
      });

   }

   componentWillUnmount() {
      this.un = true;
   }

   loadUnionPayList(param, cb) {
       HttpTool.request(HttpTool.typeEnum.POST, "/pc/v1.0/card/find/cards", (code, msg, json, option) => {
           cb(code,msg,json);
       }, (code, msg, option) => {
           cb(code,msg, {});
       }, param);
      // setTimeout(() => {
      //    let code = (Math.random() * 10).toFixed(0) - 1;
      //    let data = [];
      //    code = 11;
      //    if (code > 0) {
      //       for (let i = 0; i < code; i++) {
      //          data.push({
      //             code: "622***" + i.toString().repeat(4),
      //             type: "信用卡",
      //             icon: "./images/zhaoshang.png"
      //          });
      //       }
      //    }
      //    cb(code, code > 0 ? "获取成功" : "暂无卡列表/获取失败", data);
      // }, Math.random() * 1000);


       // /v1.0/card/getInUsedCards
   }

   doUnionPay(param, cb) {
      setTimeout(() => {
         let code = (Math.random() * 10).toFixed(0) - 5;
         let data = {};
         // code = 10;
         cb(code, code > 0 ? "支付成功" : "支付状态未知", data);
      }, Math.random() * 1000);
   }


   getLoadingView() {
      return <div className={less.loading}>正在为您拉取卡列表,请稍候...</div>;
   }

   getCardList(data) {
      //添加
      data = data.concat([{}]);
      return (
         <div>
            <div>
               {data.map((obj, index) => {
                  let last = data.length === index + 1;
                  return (
                     <Item
                        key={index}
                        select={this.state.selectIndex === index}
                        onClick={() => {
                           //选择当前选项
                           if (last) {
                              this.openAddCard();
                              return;
                           }
                           this.setState({
                              selectIndex: index
                           }, () => {

                           });
                           //清空其他选择
                        }
                        }
                     >
                        <div style={{textAlign: "center"}}>
                           {last ?
                              (
                                 <div className={less.addCardBtn}>
                                    <Icon type="plus"/>&nbsp;添加银行卡
                                 </div>
                              ) : (
                                 <div>
                                    <img className={less.bankLogoImg} src={require("./images/zhaoshang.png")} alt="bank_LOGO"/>
                                    <div>{obj.type}:&nbsp;&nbsp;{obj.code}</div>
                                 </div>
                              )
                           }
                        </div>

                     </Item>
                  );
               })}
            </div>
            <InputLayout ref={(ref) => {
               this.inputLayout = ref;
            }}/>
         </div>
      );
   }

   openAddCard() {
      //第一步:输入卡号 获取到卡号
      this.unionPayAdd.show(true);
      //第二步:把卡号上传给服务器,获取到开通URL
      //第三步:等待用户开通
   }

   getDefaultView() {
      return (
         <div className={less.loading}>
            <img className={less.nocardImg} src={require("./images/pay_noCard.png")} alt="没有卡列表"/>
            {this.state.error ? <div className={less.loading}> {"服务器繁忙:" + this.state.error}</div> : null}
            <div>还没有开通卡?
               <a onClick={() => {
                  this.openAddCard();
               }}>点击开通</a>
            </div>
            <div>
               <Button
                  style={{height: 60, width: 200, fontSize: 16, marginBottom: 12, marginTop: 15}}
                  type="primary"
                  onClick={() => {
                     this.openAddCard();
                     return;
                  }}
               >
                  <Icon type="plus" style={{fontWeight: "bolder"}}/>添加银行卡
               </Button>
            </div>
            <a
               className={less.backUp}
               onClick={(e) => {
                  e.preventDefault();
                  this.props.back();
               }}
            ><Icon type="left"/>返回上一级</a>
         </div>
      );

   }


   render() {
      let contentView = null;

      let hasCard = this.state.cardList && this.state.cardList.length > 0;
      if (this.state.loading) {
         contentView = this.getLoadingView();
      } else if (hasCard) {
         contentView = this.getCardList(this.state.cardList);
      } else {
         contentView = this.getDefaultView();
      }
      return (
         <div>
            <div className={less.unionPay}>

               <div className={less.unionPay_top}>选择银联卡</div>
               <div className={less.unionPay_middle}>
                  {contentView}
               </div>
            </div>
            <div>
               {
                  hasCard ?
                     <div style={{textAlign: "right"}}>
                        <a
                           onClick={(e) => {
                              e.preventDefault();
                              this.props.back();
                           }}
                        ><Icon type="left"/>返回上一级</a>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button
                           type="primary"
                           className={less.payBtn}
                           onClick={() => {
                              //第一步:得到银行卡号
                              if (this.state.selectIndex < 0) {
                                 message.error("请选择银行卡");
                                 return;
                              }
                              if (this.state.cardList && this.state.cardList.length > this.state.selectIndex) {
                                 let card = this.state.cardList[this.state.selectIndex];
                                 let data = this.inputLayout.getData();
                                 if (data.error) {
                                    message.error(data.error);
                                    return;
                                 }
                                 data.card = card.code;
                                 console.log(card);

                                 if (this.props.onAction) {
                                    this.props.onAction("unionpay", data, () => {
                                       //开始支付 10 秒 轮询支付
                                       let diffTime = new Date().getTime();
                                       let pay = () => {
                                          this.doUnionPay(data, (code, msg, data) => {
                                             if (code > 0) {
                                                //支付成功
                                                this.props.onAction("unionpaysuccess");
                                             } else {
                                                console.log(msg);
                                                if ((new Date().getTime() - diffTime) / 1000 > 10) {
                                                   //不再查询,支付失败了
                                                   console.log("真的失败了");
                                                   this.props.onAction("unionpayerror", msg);
                                                } else {
                                                   //支付失败,等1秒,再次提交
                                                   setTimeout(() => {
                                                      pay();
                                                   }, 1000);
                                                }

                                             }
                                          });
                                       };
                                       pay();
                                    });
                                 }
                              } else {
                                 message.error("选择银行卡异常");
                              }

                              //第二步:得到手机号和验证码
                              //第三步:调用支付
                           }}
                        >付款</Button>
                     </div>
                     : null
               }
            </div>
            <UnionPayAdd
               onAction={(data) => {
                  //打开开通
                  if (this.props.onAction) {
                     this.props.onAction("unionopen", data);
                  }

               }}
               ref={(ref) => {
                  this.unionPayAdd = ref;
               }}/>
         </div>
      );
   }

   onAction(type) {
      if (type === "closeAdd") {
         //关闭当前的添加页面,并刷新列表页面
         this.unionPayAdd.show(false);
         this.refreshList();
      }
   }

}

class InputLayout extends Component {
   constructor(props) {
      super(props);
      this.defaultTime = 5;
      this.state = {
         moblie: "",
         code: "",
         time: 0,
         loading: false,
      };
   }

   getData() {
      return {
         moblie: this.state.moblie,
         code: this.state.code,
         error: this.state.moblie.length !== 11 ? "请填写正确的手机号" : (this.state.code.length !== 6 ? "请填写正确的验证码" : null)
      };

   }

   loadPhoneCode(param, cb) {
      setTimeout(() => {
         let code = (Math.random() * 10).toFixed(0) - 5;
         //todo 没有data吧?
         let data = [];
         cb(code, code > 0 ? "获取成功" : "获取失败", data);
      }, Math.random() * 1000);
   }
    componentWillUnmount() {
        this.un = true;
    }
   autoTime(time) {
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
               <label htmlFor="mobileIpt" className={less.label}>银行卡预留手机号：</label>
               <Input
                  id="mobileIpt"
                  size="large"
                  onChange={(e) => {
                     let v = e.target.value;
                     this.setState({
                        moblie: v
                     }, () => {

                     });

                  }}
                  style={{width: 130}}
                  prefix={<Icon type="mobile" style={{fontSize: 13}}/>} placeholder={"请输入银行卡预留手机号"}
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
                     this.loadPhoneCode({}, (code, msg, data) => {
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


UnionPay.contextTypes = {
   router: React.PropTypes.object
};
module.exports = UnionPay;