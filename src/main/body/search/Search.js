import React, {Component} from 'react';

import {Pagination, Button, Input, Select} from 'antd';
import RecommendView from '../component/RecommendView'
import SearchLayout from '../component/SearchLayout'


import routes from '../../../vm/routes.js'
import less from './Search.less';
class page extends Component {
    constructor(props) {
        super(props)
        this.state = {
            current: 1,
            loading: true,
        }

        this.par = window.app_getPar(this);
    }

    componentWillUnmount() {
        //拿到搜索值,告诉上个页面
        window.apin.setCache("search", this.refs.search.getData())
    }

    getRecommendList() {

        let noData = (Math.random() * 10).toFixed(0) % 2 == 0;
        return noData ? this.getNoneLayout() : routes.getData(8).map((data, index) => {
            return (
                <RecommendView
                    onClick={() => {
                        window.app_open(this, "/OneWayDetail", data);
                    }}
                    data={data} key={index}/>
            )
        });
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        this.setState(
            {
                loading: true
            }
            , () => {
                setTimeout(() => {
                    this.setState(
                        {
                            loading: false
                        }
                    )
                }, 2000)
            })

    }

    render() {

        return (
            <div style={{margin: "auto", width: 1250}}>
                {/*搜索输入框部分*/}
                <div>
                    <SearchLayout
                        ref="search"
                        data={this.par.data}

                        submit={(data) => {
                            let a = this.refs.search.getData();
                            {/*alert("执行搜索:"+JSON.stringify(a))*/
                            }
                            this.loadData()
                            //  window.app_open(this, "/Search", data);
                        }}
                    />
                </div>

                {/*空部分*/}


                {/*搜索列表部分*/}
                <div style={{clear: "both"}}>
                    {this.state.loading ? this.getLogingLayout() : this.getRecommendList()}
                </div>

                <div style={{width: 1250, textAlign: "right"}}>
                    <Pagination showQuickJumper current={this.state.current} total={500} onChange={this.onChange}/>
                </div>

            </div>
        )
    }


    getLogingLayout() {
        return (
            <div style={{marginTop: 20, width: 1250}}>
                <div style={{
                    margin: "auto",
                    height: "653px",
                    width: "873px",
                    background: "url('../../../images/icon.ico')",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    position: 'relative'
                }}>
                    <div style={{position: "absolute", top: "62%", left: "32%"}}>
                        <h2 style={{
                            fontFamily: "MicrosoftYaHei",
                            fontSize: "14px",
                            color: "#000",
                            letterSpacing: 0,
                            lineHeight: "16px"
                        }}>加载中 </h2>
                    </div>
                </div>
            </div>
        )
    }

    getNoneLayout() {
        return (
            <div style={{marginTop: 20, width: 1250}}>
                <div style={{
                    margin: "auto",
                    height: "653px",
                    width: "873px",
                    background: "url('../../../images/icon.ico')",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    position: 'relative'
                }}>
                    <div style={{position: "absolute", top: "62%", left: "32%"}}>
                        <h2 style={{
                            fontFamily: "MicrosoftYaHei",
                            fontSize: "14px",
                            color: "#000",
                            letterSpacing: 0,
                            lineHeight: "16px"
                        }}>没有查询到航班信息，请重新搜索或联系客服询问航班 </h2>
                        <Button type="primary" style={{
                            width: '140px',
                            fontSize: "12px",
                            position: "absolute",
                            left: "120px",
                            top: "80px"
                        }} size="large">联系客服</Button>
                    </div>
                </div>
            </div>
        )
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;

{/*<div className={less.content}>*/
}

{/*这是搜索结果页面*/
}

{/*<Button className={less.rightRow} icon={"back"}*/
}
{/*onClick={() => {*/
}
{/*window.app_open(this, "/", {title: "回首页"});*/
}
{/*}}*/
}
{/*>回首页</Button>*/
}
{/*</div>*/
}

