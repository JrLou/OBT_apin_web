import React, {Component} from 'react';

import {Pagination, Button, Input, Select} from 'antd';
import RecommendView from '../component/RecommendView'
import SearchLayout from '../component/SearchLayout'
import OneWayDetail from '../content/OneWayDetail.js'
import SearchHelp from '../search/SearchHelp.js'

//获取模拟数据
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
        //页面返回,传递给上个页面的值 (非单页面不生效)
        // if (this.searchLayout) {
        //     window.apin.setCache("search", this.searchLayout.getData())
        // }

    }

    /**
     *页面打开之后,根据条件进行搜索
     */
    componentDidMount() {
        this.loadData(this.par.data)
    }

    /**
     *
     * @param loading 加载动画
     * @param cb,顺序执行代码
     */
    setLoading(loading, cb) {
        this.setState(
            {
                loading: loading,
            }, cb
        )
        this.searchLayout.setLoading(loading)
    }

    /**
     * @param param 请求参数(根据搜索框与列表数据提取,不建议此外修改)
     */
    loadData(param) {
        this.setLoading(true, () => {
            //模拟请求网络
            setTimeout(() => {
                //请求结果
                //假设结果
                if (param.from == 0 && param.to == 0) {
                    //无结果
                    this.resut = null;
                } else if (param.from && param.to) {
                    //一定是结果的页面
                    this.resut = {};
                } else {
                    //列表页面
                    this.resut = routes.getData((Math.random() * 10).toFixed(0));
                }
                //更新页面,此代码,一定是在此位置
                this.setLoading(false, () => {
                })
            }, 2000)
        })
    }

    render() {
        return (
            <div style={{margin: "auto", width: 1250}}>
                <SearchLayout
                    ref={(ref) => {
                        this.searchLayout = ref;
                    }}
                    data={this.par.data}

                    submit={(data) => {
                        this.loadData(data)
                    }}
                />
                {this.state.loading ? this.getLogingLayout() : this.getContentLayout(this.resut)}
            </div>
        )
    }

    /**
     *
     * @param resut 中心区域应显示布局
     * @returns {*} 返回显示布局
     */
    getContentLayout(resut) {
        if (resut) {
            if (resut instanceof Array) {
                if (resut.length > 0) {
                    return this.getListLayout(resut);
                } else {
                    return this.getNoneLayout();
                }
            } else {
                return this.getResutLayout(resut);
            }
        } else {
            return this.getNoneLayout();
        }
    }

    /**
     * 列表页面
     * @param list 列表数据
     * @returns {XML} 返回列表布局
     */
    getListLayout(list) {
        return (
            <div>
                <div style={{clear: "both"}}>
                    {list.map((data, index) => {
                        return (
                            <RecommendView
                                onClick={() => {
                                    SearchHelp.openSearch(this,data)
                                }}
                                data={data} key={index}/>
                        )
                    })}
                </div>

                <div style={{clear: "both"}}/>
                <div style={{width: 1250, textAlign: "right"}}>
                    <Pagination showQuickJumper current={this.state.current} total={500} onChange={this.onChange}/>
                </div>
            </div>
        )
    }

    /**
     *
     * @param data 单结果页面
     * @returns {XML} 结果布局
     */
    getResutLayout(data) {

        return (
            <div style={{clear: "both"}}>
                <OneWayDetail data={data}/>
            </div>
        )
    }

    /**
     * 加载中布局
     * @returns {XML}
     */
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

    /**
     * 无结果布局
     * @returns {XML}
     */
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

