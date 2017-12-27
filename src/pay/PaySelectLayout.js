import React, {Component} from 'react';
import less from './Pay.less';
import {Col, Row} from 'antd';
// class PaySelectLayout extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             maxSelect: 3,
//             showMore: this.props.defaultshowMore||false,
//             selectIndex: this.props.defaultIndex||0,
//             loading: true
//         };
//         console.log();
//     }
//     getData(){
//         return this.props.data ||{};
//     }
//     getPayList() {
//         return [
//             {
//                 type: "ali",
//                 title: "支付宝",
//                 getView: () => {
//                     return <div>支付宝图片</div>;
//                 },
//                 span: 8,
//             },
//             {
//                 type: "wechat",
//                 title: "微信支付",
//                 getView: () => {
//                     return "微信支付";
//                 },
//                 span: 8,
//             }, {
//                 type: "online",
//                 title: "银联支付",
//                 getView: () => {
//                     return "银联支付";
//                 },
//                 span: 8,
//             }, {
//                 type: "bank",
//                 title: "银行转账",
//                 getView: () => {
//                     return "银行转账";
//                 },
//                 span: 10,
//             }
//         ];
//     }
//
//
//     render() {
//         let payList = this.getPayList();
//         if (!this.state.showMore) {
//             payList = payList.slice(0, this.state.maxSelect);
//         }
//         let data = this.getData();
//         return (
//             <div
//                 {...this.props}
//                 className={less.payLayout}
//             >
//                 <Row>
//
//                     {
//                         payList.map((obj, index) => {
//                             obj.select = this.state.selectIndex === index;
//                             if(obj.select){
//                                 data.type = obj.type;
//                                 data.defaultIndex = index;
//                             }
//                             return <PayItem
//                                 key={index}
//                                 {...obj}
//                                 onClick={() => {
//                                     //选择当前选项
//                                     this.setState({
//                                         selectIndex: index
//                                     }, () => {
//
//                                     });
//                                     //清空其他选择
//                                 }
//                                 }
//                             >
//                                 {obj.getView()}
//                             </PayItem>;
//                         })
//                     }
//                 </Row>
//                 <div
//                     className={less.payMore}
//                     onClick={() => {
//                         this.setState({
//                             showMore: !this.state.showMore
//                         },()=>{
//                             data.defaultshowMore = this.state.showMore;
//                         });
//                     }}>{"" + (this.state.showMore ? "收起↑" : "更多支付方式↓")}</div>
//             </div>
//         );
//     }
// }
//
//
// class PayItem extends Component {
//     constructor(props) {
//         super(props);
//     }
//
//     render() {
//         return (
//             <Col
//                 {...this.props}
//             >
//                 <div className={this.props.select ? less.payItemSelect : less.payItem}>
//                     {this.props.children}
//                 </div>
//             </Col>
//         );
//     }
// }
class PaySelectLayout extends Component {
   constructor(props) {
      super(props);
      this.maxSelect = 3;
   }

   getPayList() {
      return [
         {
            type: "ali",
            title: "支付宝",
            getView: () => {
               return <image src={require("../images/logo.png")}/>;
            },
            span: 8,
            selected: false,
         },
         {
            type: "wechat",
            title: "微信支付",
            getView: () => {
               return <image src={require("../images/logo.png")}/>;
            },
            span: 8,
            selected: false,
         }, {
            type: "online",
            title: "银联支付",
            getView: () => {
               return <image src={require("../images/logo.png")}/>;
            },
            span: 8,
            selected: false,
         }, {
            type: "bank",
            title: "银行转账",
            getView: () => {
               return <image src={require("../images/logo.png")}/>;
            },
            span: 24,
            selected: false,
         }
      ];
   }


   render() {
      let payList = this.getPayList();
      if (!this.props.pay.showMore) {
         payList = payList.slice(0, this.maxSelect);
      }

      return (
         <Row>
            {
               payList.map((payItem, index) => {
                  payItem.selected = this.props.pay.selectIndex === index;
                  return (
                     <PayItem
                        key={payItem.type}
                        span={payItem.span}
                        selected={payItem.selected}
                        onClick={() => {
                           // this.props.setPayState("selectIndex", index);
                           this.props.setPayState("pay", Object.assign( this.props.pay, {selectIndex:index}));
                        }}
                     >
                        {payItem.title}
                        {payItem.getView()}
                     </PayItem>
                  );
               })
            }
            <Col span={8}>
               <div onClick={() => {
                  // this.props.setPayState("showMore", !this.props.showMore);
                  this.props.setPayState("pay", Object.assign( this.props.pay, {showMore:!this.props.pay.showMore}));
               }}>
                  {this.props.pay.showMore ? "收起" : "显示更多"}
               </div>
            </Col>
         </Row>
      );
   }
}


class PayItem extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <Col {...this.props} >
            <div className={this.props.selected ? less.payItemSelect : less.payItem}>
               {this.props.children}

            </div>
         </Col>
      );
   }
}

PaySelectLayout.contextTypes = {
   router: React.PropTypes.object
};
module.exports = PaySelectLayout;

