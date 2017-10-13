import React, {Component} from 'react';

import {Carousel, Input, Button,Row, Col} from 'antd';
import less from './Index.less';

import RecommendView from '../component/RecommendView'
import SpecialView from '../component/SpecialView'
import SearchLayout from '../component/SearchLayout'
import SearchHelp from '../search/SearchHelp.js'

import routes from '../../../vm/routes.js'
class page extends Component {
    constructor(props) {
        super(props)
    }

    getRecommendList() {

        return routes.getData(8).map((data, index) => {
            return (
                <RecommendView
                    onClick={() => {
                        SearchHelp.openSearch(this,data);
                    }}
                    data={data} key={index}/>
            )
        });
    }

    getSpecialList() {
        return routes.getData(12).map((data, index) => {
            return (
            <SpecialView
                onClick={() => {
                    SearchHelp.openSearch(this,data);
                }}
                data={data} key={index}/>
            )
        });
    }

    getSwitchLayout() {

        return (
            <Carousel autoplay>
                <div style={{
                    backgroundColor: "#bb4ba1",
                    margin: "auto", height: 328,
                    width: 810,
                    backgroundPosition: "center", backgroundRepeat: "no-repeat"
                }}/>
                <div style={{
                    backgroundColor: "#bb5c86",
                    margin: "auto", height: 328,
                    width: 810
                    , backgroundPosition: "center", backgroundRepeat: "no-repeat"
                }}/>
            </Carousel>
        )
    }

    render() {


        return (
            <div style={{margin:"auto",width:1500,paddingLeft:100,paddingRight:100}}>
                <Row style={{}}>
                    <Col span={6}  style={{marginTop:10,width:380,height:328,backgroundColor:"#29A6FF",borderRadius:4,}}>
                        <div style={{color:"#fff",textAlign:"center",fontSize:18,marginTop:14}}>团飞机票搜索</div>
                        <div style={{borderRadius:4,marginLeft:2,width:376,height:275,backgroundColor:"#fff",marginTop:10,position:"absolute"}}>
                        <SearchLayout
                            data={window.apin.getCache("search")}
                            submit={(data)=>{
                                SearchHelp.openSearch(this,data);
                            }}
                        />
                        </div>
                    </Col>
                    <Col span={18}  style={{width:810,backgroundColor:"#aaa",marginLeft:12,marginTop:10}} >
                        {/*轮播部分*/}
                        {this.getSwitchLayout()}
                    </Col>
                </Row>

                {/*精品特价航线部分*/}
                <div style={{width:1200,height:694,backgroundColor:"#fff"}}>
                <div style={{height: 60, marginTop: 12}}>
                    <img style={{
                        width: 20,
                        float: "left",
                        height: 20,
                        marginLeft:525,
                        marginTop:30
                    }} src={require('../../../images/login_check.png')}
                    />
                    <div style={{
                        float: "left",
                        marginTop:25,
                        marginLeft: 20,
                        fontSize: 20,
                    }}>精品特价航线
                    </div>
                    <div style={{
                        textAlign: "right",
                        marginTop: 5,
                        marginLeft: 20,
                        fontSize: 16,
                        paddingRight:11,
                        paddingTop:25
                    }} onClick={() => {
                        window.app_open(this, "/Search", {title: "搜索"});
                    }}>更多路线推荐
                        SearchHelp.openSearch(this,{});
                    }}>查看更多
                    </div>
                </div>
                <div style={{clear:"both"}}>
                    {this.getRecommendList()}
                </div>
                </div>
                {/*底部更多特价部分*/}
                <div style={{clear:"both",width:1200,}}>
                    {this.getSpecialList()}
                </div>
                <div style={{clear:"both"}}/>
                <div style={{width: 1250, textAlign: "center", padding: 30, marginBottom: 30, fontSize: 16}}>加载中...</div>

            </div>
        )
    }


}


page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;




