import React, {Component} from 'react';

import {Pagination, Button, Input, Select,Col,Row} from 'antd';
import RecommendView from '../component/RecommendView';
import SearchLayout from '../component/SearchLayout';
import OneWayDetail from '../content/OneWayDetail.js';
import SearchHelp from '../search/SearchHelp.js';
import {HttpTool} from "../../../../lib/utils/index.js";
//获取模拟数据
import routes from '../../../vm/routes.js';
import less from './Search.less';
class page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            loading: true
        };
        this.resutMessage = null;
        this.par = window.app_getPar(this);

        this.pageSize = 16;
        this.pageIndex = 1;
        this.pageAllSize = 21;
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
        this.loadData(this.par.data);
    }

    /**
     *
     * @param loading 加载动画
     * @param cb,顺序执行代码
     */
    setLoading(loading, cb) {
        this.setState(
            {
                loading: loading
            }, cb
        );
        this.searchLayout.setLoading(loading);
    }

    /**
     * @param param 请求参数(根据搜索框与列表数据提取,不建议此外修改)
     */
    loadData(par) {
        // arrCity	到达城市名	string
        // depCity	出发城市名	string
        // flightType	航程类型：0、未定义；1、单程；2、往返；3、多程	number


        this.setLoading(true, () => {
            let param = {
                arrCity	:par.to,
                depCity	:par.from,
                flightType:par.one?1:2,
                pageIndex:this.pageIndex,
                pageSize:this.pageSize
            };
            let success = (code, msg, json, option) => {
                log(json);
                this.pageAllSize = 21;
                this.resutMessage = "";
                if(!json){
                    //无结果
                    this.resut = null;
                }else if(json&&json.length===1&&param.arrCity&&param.depCity){
                    //有结果,并有详情
                    //一定是结果的页面 转换成对像
                    this.resut = json[0];
                }else{
                    alert(json.length);
                    this.resut = json;
                }
                //更新页面,此代码,一定是在此位置
                this.setLoading(false, () => {
                });
            };
            let failure = (code, msg, option) => {
                //无结果
                this.resutMessage = code+msg;
                this.resut = null;
                this.setLoading(false, () => {
                });
            };
            HttpTool.request(HttpTool.typeEnum.POST, "/airlineapi/v1.0/list", success, failure, param,
                {
                    ipKey: "hlIP"
                });
        });
    }

    render() {
        return (
            <div className={less.content}>
                <SearchLayout
                    ref={(ref) => {
                        this.searchLayout = ref;
                    }}
                    data={this.par.data}
                    type={2}
                    submit={(data) => {
                        this.loadData(data);
                    }}
                />
                <div style={{paddingTop:42}}>
                {this.state.loading ? this.getLogingLayout() : this.getContentLayout(this.resut)}
                </div>
            </div>
        );
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
                    <Row className={less.listRow}>
                    {list.map((data, index) => {
                        return (
                            <Col  key={index} span={6}>
                            <RecommendView
                                template={2}
                                onClick={() => {
                                    SearchHelp.openSearch(this,data);
                                }}
                                data={data} key={index}/>
                            </Col>
                        );
                    })}
                    </Row>

                <div style={{clear: "both"}}/>
                <div className={less.bottom}>
                    <Pagination total={this.pageAllSize}
                                defaultPageSize={this.pageSize}
                                current={this.pageIndex}
                                itemRender={this.itemRender.bind(this)}
                        onChange={(page, pageSize)=>{
                            log(page);
                            this.pageIndex = page;
                            this.loadData(this.searchLayout.getData());
                        }}
                        />
                </div>
            </div>
        );
    }

    itemRender(current, type, originalElement) {
        if (type === 'prev') {
            return <a>上一页</a>;
        } else if (type === 'next') {
            return <a>下一页</a>;
        }
        return originalElement;
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
        );
    }

    /**
     * 加载中布局
     * @returns {XML}
     */
    getLogingLayout() {
        return (
        <div className={less.load}>
            <div>
                正在为您搜索航班信息...
            </div>
            <img src={require('../../../images/check.png')}
            />
        </div>

        );
    }

    /**
     * 无结果布局
     * @returns {XML}
     */
    getNoneLayout() {
        return (
            <div className={less.empty}>
                <div className={less.emptyText}>
                    <div>没有查询到航班信息，请重新搜索或联系客服询问航班 </div>
                    <div>{this.resutMessage}</div>
                    <Button type="primary">联系客服</Button>
                </div>
            </div>
        );
    }
}
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;

