import React, {Component} from 'react';
import less from './UnionPay.less';
import {Button,Row} from 'antd';
import  Item from './Item';
class UnionPay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error:"",
            cardList:[],
            selectIndex:0,
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
        if(this.un ){
            return;
        }
        this.loadUnionPayList({}, (code, msg, data) => {
            if(this.un ){
                return;
            }
            this.setState({
                loading:false,
                error:code>0?"":msg,
                cardList:data,
            });
        });
    }

    componentWillUnmount() {
        this.un = true;
    }

    loadUnionPayList(param, cb) {
        setTimeout(() => {
            let code = (Math.random() * 10).toFixed(0) - 5;
            let data = [];
            code = 3;
            if (code > 0) {
                for (let i = 0; i < code; i++) {
                    data.push({
                        code: "62202171700458" + i.toString().repeat(4),
                        type: "招商",
                        icon: ""
                    });
                }
            }
            cb(code, code > 0 ? "获取成功" : "获取失败", data);
        }, Math.random() * 1000 );
    }

    getLoadingView() {
        return <div className={less.loading}>正在为您拉取卡列表,请稍候...</div>;
    }

    getCardList(data) {
        return <Row >
            {data.map((obj,index)=>{
                return (
                    <Item
                        key={index}
                        span={24/2}
                        select={this.state.selectIndex === index}
                        onClick={() => {
                            //选择当前选项
                            this.setState({
                                selectIndex: index
                            }, () => {

                            });
                            //清空其他选择
                        }
                        }
                    >

                    </Item>
                );
            })}
        </Row>;
    }

    getDefaultView() {
        if(this.state.error){
            return <div className={less.loading}> {"服务器繁忙:"+this.state.error}</div>;
        }else{
            return <div className={less.loading}> 还没有开通卡? 点击开通</div>;
        }

    }

    getAddView() {
        return (
            <div style={{textAlign: "right"}}>
                <Button type="primary" icon={"plus"}>
                    添加银行卡
                </Button>
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

                {contentView}
                <div className={less.nextLayout}>

                    <Button type="primary"

                            onClick={() => {
                                this.props.back();
                            }}
                    >返回</Button>
                    {
                        hasCard ?
                            <Button type="primary"

                                    onClick={() => {

                                    }}
                            >下一步</Button>
                            : null
                    }
                </div>
            </div>
        );
    }
}


UnionPay.contextTypes = {
    router: React.PropTypes.object
};
module.exports = UnionPay;