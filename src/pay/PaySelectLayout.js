import React, {Component} from 'react';
import less from './Pay.less';
import { Col, Row} from 'antd';
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
                    return <div>支付宝图片</div>;
                },
                span: 8,
            },
            {
                type: "wechat",
                title: "微信支付",
                getView: () => {
                    return "微信支付";
                },
                span: 8,
            }, {
                type: "online",
                title: "银联支付",
                getView: () => {
                    return "银联支付";
                },
                span: 8,
            }, {
                type: "bank",
                title: "银行转账",
                getView: () => {
                    return "银行转账";
                },
                span: 10,
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
                <Row>

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
                </Row>
                <div
                    className={less.payMore}
                    onClick={() => {
                        this.setState({
                            showMore: !this.state.showMore
                        },()=>{
                            data.defaultshowMore = this.state.showMore;
                        });
                    }}>{"" + (this.state.showMore ? "收起↑" : "更多支付方式↓")}</div>
            </div>
        );
    }
}



PaySelectLayout.contextTypes = {
    router: React.PropTypes.object
};
module.exports = PaySelectLayout;