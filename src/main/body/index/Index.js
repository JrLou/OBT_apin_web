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
                <Col  key={index} span={6}>
                <RecommendView
                    template={1}
                    onClick={() => {
                        SearchHelp.openSearch(this,data);
                    }}
                    data={data} key={index}/>
                </Col>
            )
        });
    }

    getSpecialList() {
        return routes.getData(12).map((data, index) => {
            return (
            <Col  key={index} span={4.8}>
            <SpecialView
                onClick={() => {
                    SearchHelp.openSearch(this,data);
                }}
                data={data}/>
            </Col>
            )

        });
    }

    getSwitchLayout() {

        return (
            <Carousel autoplay>
                <div style={{
                    backgroundColor: "#bb4ba1",
                    margin: "auto", height: 328,
                    width: "100%",
                    backgroundPosition: "center", backgroundRepeat: "no-repeat"
                }}/>
                <div style={{
                    backgroundColor: "#bb5c86",
                    margin: "auto", height: 328,
                    width: "100%"
                    , backgroundPosition: "center", backgroundRepeat: "no-repeat"
                }}/>
            </Carousel>
        )
    }

    render() {


        return (
            <div style={{margin:"auto",maxWidth:1200,

            }}>
                <Row style={{}}>
                    <Col span={6}  style={{marginTop:10,width:"33%",height:328,backgroundColor:"#29A6FF",borderRadius:4,}}>
                        <div style={{color:"#fff",textAlign:"center",fontSize:18,marginTop:14}}>团飞机票搜索</div>
                        <div style={{borderRadius:4,marginLeft:2,marginRight:2,width:"99%",height:275,backgroundColor:"#fff",marginTop:10,position:"absolute"}}>
                        <SearchLayout
                            data={window.apin.getCache("search")}
                            type={1}
                            submit={(data)=>{
                                SearchHelp.openSearch(this,data);
                            }}
                        />
                        </div>
                    </Col>
                    <Col span={18}  style={{width:"65%",backgroundColor:"#aaa",marginLeft:12,marginTop:10}} >
                        {/*轮播部分*/}
                        {this.getSwitchLayout()}
                    </Col>
                </Row>

                {/*精品特价航线部分*/}
                <div style={{width:"100%",height:694,}}>
                <div style={{height: 60, marginTop: 12}}>
                    <img style={{
                        width: 20,
                        float: "left",
                        height: 20,
                        marginLeft:"40%",
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
                        SearchHelp.openSearch(this,{});
                    }}>更多路线推荐
                    </div>
                </div>
                <Row style={{
                    backgroundColor:"#fff",
                    padding:5,
                    clear:"both",width:"100%"}}>
                    {this.getRecommendList()}
                </Row>
                </div>
                {/*底部更多特价部分*/}
                <Row style={{clear:"both", padding:5,
                    width:"100%", backgroundColor:"#fff",paddingBottom:7,
                }}>
                    {this.getSpecialList()}
                </Row>
                <div style={{clear:"both"}}/>
                <div style={{width: "100%", textAlign: "center", padding: 30, marginBottom: 30, fontSize: 16}}>加载中...</div>

            </div>
        )
    }


}


page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;




