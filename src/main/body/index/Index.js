import React, {Component} from 'react';

import {Carousel, Input, Button,Row, Col} from 'antd';
import less from './Index.less';

import RecommendView from '../component/RecommendView'
import SpecialView from '../component/SpecialView'
import SearchLayout from '../component/SearchLayout'

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
                        window.app_open(this, "/OneWayDetail", data);
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
                    window.app_open(this, "/OneWayDetail", data);
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
                    margin: "auto", height: 150,
                    width: "100%"
                    , backgroundPosition: "center", backgroundRepeat: "no-repeat"
                }}/>
                <div style={{
                    backgroundColor: "#bb5c86",
                    margin: "auto", height: 150,
                    width: "100%"
                    , backgroundPosition: "center", backgroundRepeat: "no-repeat"
                }}/>
            </Carousel>
        )
    }

    render() {


        return (
            <div style={{paddingLeft:100,paddingRight:100}}>
                <Row style={{}}>
                    <Col span={6}  style={{}}>
                        <SearchLayout
                            data={window.apin.getCache("search")}
                            submit={(data)=>{
                                log(data)
                                window.app_open(this, "/Search", {
                                    data:data,
                                    callBack:(data)=>{

                                        alert(data)
                                        this.setState({},()=>{

                                        })
                                    }
                                });
                            }}
                        />
                    </Col>
                    <Col span={18}  style={{backgroundColor:"#aaa"}} >
                        {/*轮播部分*/}
                        {this.getSwitchLayout()}
                    </Col>
                </Row>

                {/*精品特价航线部分*/}
                <div style={{height: 50, marginTop: 40}}>
                    <img style={{
                        width: 30,
                        float: "left",
                        height: 30,
                    }} src={require('../../../images/login_check.png')}
                    />
                    <div style={{
                        float: "left",
                        marginTop: 5,
                        marginLeft: 20,
                        fontSize: 16
                    }}>精品特价航线
                    </div>
                    <div style={{
                        textAlign: "right",
                        marginTop: 5,
                        marginLeft: 20,
                        fontSize: 16
                    }} onClick={() => {
                        window.app_open(this, "/Search", {title: "搜索"});
                    }}>查看更多
                    </div>
                </div>
                <div style={{clear:"both"}}>
                    {this.getRecommendList()}
                </div>
                {/*底部更多特价部分*/}
                <div style={{clear:"both"}}>
                    {this.getSpecialList()}
                </div>
                <div style={{clear:"both"}}/>
                <div style={{width: 1250, textAlign: "right", padding: 30, marginBottom: 30, fontSize: 16}}>换一组</div>

            </div>
        )
    }


}


page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;




