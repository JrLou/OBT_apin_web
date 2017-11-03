import React, {Component} from 'react';
import less from './UnionPay.less';
import {Button, Row,Input,Form,Icon,message} from 'antd';
const FormItem = Form.Item;
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

    refreshList(){
        this.show(true,()=>{
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
        setTimeout(() => {
            let code = (Math.random() * 10).toFixed(0) - 0;
            let data = [];
            // code = 10;
            if (code > 0) {
                for (let i = 0; i < code; i++) {
                    data.push({
                        code: "62202171700458" + i.toString().repeat(4),
                        type: "招商",
                        icon: ""
                    });
                }
            }
            cb(code, code > 0 ? "获取成功" : "暂无卡列表/获取失败", data);
        }, Math.random() * 1000);
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
        data=  data.concat([{}]);
        return (
            <div>
                <Row>
                    {data.map((obj, index) => {
                        let last = data.length === index + 1;
                        return (
                            <Item
                                key={index}
                                span={(6).toFixed(0)}
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
                                {last ?
                                    (
                                        <div>
                                            <Button type="primary" icon={"plus"}
                                            >
                                                添加银行卡
                                            </Button>
                                        </div>
                                    ) : (
                                        <div>
                                            <div>卡号:{obj.code}</div>
                                            <div>银行:{obj.type}</div>
                                        </div>
                                    )
                                }


                            </Item>
                        );
                    })}
                </Row>
                <InputLayout ref={(ref)=>{this.inputLayout = ref;}}/>
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
                {this.state.error ? <div className={less.loading}> {"服务器繁忙:" + this.state.error}</div> : null}
                <div>还没有开通卡? <a onClick={() => {
                    this.openAddCard();
                }}>点击开通</a></div>
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

                                        //第一步:得到银行卡号

                                        if(this.state.selectIndex<0){
                                            message.error("请选择银行卡");
                                            return;
                                        }
                                        if(this.state.cardList&&this.state.cardList.length>this.state.selectIndex){
                                          let card =   this.state.cardList[this.state.selectIndex];
                                            let data = this.inputLayout.getData();
                                            if(data.error){
                                                message.error(data.error);
                                                return;
                                            }
                                            data.card = card.code;
                                            console.log(card);

                                            if(this.props.onAction){
                                                this.props.onAction("unionpay",data,()=>{
                                                    //开始支付 10 秒 轮询支付
                                                    let diffTime = new Date().getTime();
                                                    let pay = ()=>{
                                                        this.doUnionPay(data,(code,msg,data)=>{
                                                            if(code>0){
                                                                //支付成功
                                                                this.props.onAction("unionpaysuccess");
                                                            }else{
                                                                console.log(msg);
                                                                if((new Date().getTime()-diffTime)/1000>10){
                                                                    //不再查询,支付失败了
                                                                    console.log("真的失败了");
                                                                    this.props.onAction("unionpayerror",msg);
                                                                }else{
                                                                    //支付失败,等1秒,再次提交
                                                                    setTimeout(()=>{ pay();},1000);
                                                                }

                                                            }
                                                        });
                                                    };
                                                    pay();
                                                });
                                            }
                                        }else{
                                            message.error("选择银行卡异常");
                                        }

                                        //第二步:得到手机号和验证码
                                        //第三步:调用支付
                                    }}
                            >付款</Button>
                            : null
                    }
                </div>
                <UnionPayAdd
                    onAction={(data) => {
                        //打开开通
                        if(this.props.onAction){
                            this.props.onAction("unionopen",data);
                        }

                    }}
                    ref={(ref) => {
                        this.unionPayAdd = ref;
                    }}/>
            </div>
        );
    }
    onAction(type){
        if(type==="closeAdd"){
            //关闭当前的添加页面,并刷新列表页面
            this.unionPayAdd.show(false);
            this.refreshList();
        }
    }

}

class InputLayout extends Component{
    constructor(props){
        super(props);
        this.defaultTime = 5;
        this.state = {
            moblie:"",
            code:"",
            time:0,
            loading:false,
        };
    }
    getData(){
        return {
            moblie: this.state.moblie,
            code:this.state.code,
            error:this.state.moblie.length!==11?"请填写正确的手机号":(this.state.code.length!==6?"请填写正确的验证码":null)
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

    autoTime(time){
        if(time>0){
            let diff = time-1;
            this.setState({
               time:diff
            },()=>{
                setTimeout(()=>{this.autoTime(diff);},1000);
            });
        }else{
            this.setState({
                time:0
            });
        }

    }
    render(){

        return (
            <div>
                <Input
                    addonBefore={"输入手机号"}
                    onChange={(e) => {
                        let v = e.target.value;
                        this.setState({
                            moblie:v
                        },()=>{


                        });

                    }}
                    style={{width:250}}
                    prefix={<Icon type="mobile" style={{fontSize: 13}}/>} placeholder={"请输入预留手机号"}/>
                <div>
                    <Input
                        addonBefore={"短信验证码"}
                        onChange={(e) => {
                            let v = e.target.value;
                            this.setState({
                                code:v
                            });
                        }}
                        style={{width:250}}
                        prefix={<Icon type="key" style={{fontSize: 13}}/>}
                        placeholder={"请输入短信验证码"}
                    />
                    <Button
                        loading={this.state.loading}
                        type="primary"
                            disabled={this.state.time>0||this.state.moblie.length !== 11}
                            onClick={()=>{
                                if(this.state.loading||this.state.time>0){
                                    return;
                                }
                                this.setState({
                                    loading:true
                                });
                                this.loadPhoneCode({}, (code, msg, data) => {
                                    this.setState({
                                        loading:false
                                    },()=>{
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
                        {(this.state.time>0?("("+this.state.time+"s)"):"")+"获取手机验证码"}

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