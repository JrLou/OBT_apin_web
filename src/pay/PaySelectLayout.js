import React, {Component} from 'react';
import {Icon} from 'antd';
import less from './PaySelectLayout.less';
import  Item from './Item';
class PaySelectLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxSelect: 3,
            showMore: this.props.defaultshowMore||false,
            selectIndex: this.props.defaultIndex||0,
            loading: true
        };
    }
    getData(){
        return this.props.data ||{};
    }
    getPayList() {
        return [
            {
                type: "ali",
                title: "支付宝",
                getView: () => {
                    return <img src={require("./images/pay_ali.png")} alt={"支付宝图片"}/>;
                },
            },
            {
                type: "wechat",
                title: "微信支付",
                getView: () => {
                    return <img src={require("./images/pay_wechat.png")} alt={"微信图片"}/>;
                },
            }, {
                type: "online",
                title: "银联支付",
                getView: () => {
                    return <img src={require("./images/pay_union.png")} alt={"银联图片"}/>;
                },
            }, {
                type: "bank",
                title: "银行转账",
                getView: () => {
                    return (
                       <div>
                           <div className={less.bankItme_msg}>
                               <p>银行转账</p>
                               <p>(上传转账凭证)</p>
                           </div>
                           <img src={require("./images/pay_bank.png")} alt={"银行图片"}/>
                       </div>
                    );
                },
            }
        ];
    }


    render() {
        let payList = this.getPayList();
        if (!this.state.showMore) {
            payList = payList.slice(0, this.state.maxSelect);
        }
        let data = this.getData();
        return (
            <div
                {...this.props}
                className={less.payLayout}
            >

                    <div className={less.payLayout_top}>请选择支付方式</div>
                    <div className={less.payLayout_middle}>
                        <div>
                           {
                              payList.map((obj, index) => {
                                 obj.select = this.state.selectIndex === index;

                                 if(obj.select){
                                    data.type = obj.type;
                                    data.defaultIndex = index;
                                 }
                                 return <Item
                                    key={index}
                                    {...obj}
                                    onClick={() => {
                                       //选择当前选项
                                       let last = payList.length===index+1&&this.state.showMore;
                                       if(last){
                                          //打开新的页面
                                          if(this.props.onAction){
                                             this.props.onAction();
                                          }
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
                                    {obj.getView()}
                                 </Item>;
                              })
                           }
                        </div>
                        <div
                           className={less.payMore}
                           onClick={() => {
                              this.setState({
                                 showMore: !this.state.showMore
                              },()=>{
                                 data.defaultshowMore = this.state.showMore;
                              });
                           }}>
                           {(this.state.showMore ? <span className={less.payMore_noshowmore}>收起<Icon type="up" /></span> : <span className={less.payMore_showmore}>更多支付方式<Icon type="down" /></span>)}
                        </div>
                    </div>



            </div>
        );
    }
}



PaySelectLayout.contextTypes = {
    router: React.PropTypes.object
};
module.exports = PaySelectLayout;