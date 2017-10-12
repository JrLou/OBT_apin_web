import React, { Component } from 'react';

import {Carousel,Input, Button } from 'antd';
import less from './Index.less';
class page extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSelectOneWay: false,
            isSelectReturn:true,
            startPlace:"",
            endPlace:"",
        }
    }
    startPlace(e) {
        this.setState({startPlace: e.target.value});
    }
    endPlce(e){
        this.setState({endPlce: e.target.value});
    }
    render(){
        this.recommendData=[1,2,3,4,5,6,7,8];
        var recommendLists = this.recommendData.map((val, index) => {
            return (
                <RecommendView key={index} />
            )
        });
        this.specialData=[1,2,3,4,5,6,7,8,9,10,11,12];
        var specialLists = this.specialData.map((val, index) => {
            return (
                <SpecialView key={index} />
            )
        });

        return(
            <div>
                {/*顶部*/}
                <div style={{width:1250,height:"100",marginTop:40}}>
                    <div style={{float:"left"}}>
                        <div style={{
                            marginRight:20,
                            width:70,height:70,float:"left",border:1,borderColor:"#fff",borderRadius:35}}>
                            <img src={require("../../images/login_check.png")}/>
                        </div>

                        <div style={{paddingTop:10,float:"left"}}>
                            <h3 style={{color:"#fff",}}>爱拼机</h3>
                            <h4 style={{color:"#fff"}}>www.apin.com</h4>
                        </div>
                    </div>
                    <div style={{textAlign:"right",paddingTop:5,fontSize:17}}>客服电话：12334344567</div>
                </div>

                <div style={{marginTop:20,}}>
                    {/*搜索部分*/}
                    <div style={{width:400,height:150,float:"left"}}>
                        <div style={{marginLeft:25,fontSize:13}}>
                            出发地：
                            <Input onChange={this.startPlace.bind(this)} style={{width:200}} type="text" placeholder="中文／拼音／三字码"/>
                        </div>
                        <div style={{marginLeft:25,fontSize:13,marginTop:20}}>
                            目的地：
                            <Input onChange={this.endPlce.bind(this)} style={{width:200}} type="text" placeholder="中文／拼音／三字码"/>
                        </div>
                        <div style={{marginTop:10}}>
                            <div style={{float:"left",margin:20,cursor: 'pointer'}}
                                 onClick={() => {
                                     this.setState({
                                         isSelectOneWay: !this.state.isSelectOneWay,
                                     })
                                 }}>
                                <img style={{ width:16,
                                    marginRight:5,float:"left",
                                    height:16,}} src={this.state.isSelectOneWay ? require('../../images/login_check.png') : require('../../images/login_uncheck.png')}
                                /><div style={{float:"left"}}>单程</div>
                            </div>
                            <div style={{float:"left",margin:20,cursor: 'pointer'}}
                                 onClick={() => {
                                     this.setState({
                                         isSelectReturn: !this.state.isSelectReturn,
                                     })
                                 }}>
                                <img style={{ width:16,
                                    marginRight:5,float:"left",
                                    height:16,}}  src={this.state.isSelectReturn ? require('../../images/login_check.png') : require('../../images/login_uncheck.png')}
                                /><div style={{float:"left"}}>往返</div>
                            </div>
                            <Button style={{
                                backgroundColor:"#66ecfb" ,
                                color: "#000",
                                width:80,
                                marginTop:15,
                                marginLeft:10,
                                height:30,
                            }}>
                                搜索
                            </Button>
                        </div>
                    </div>
                    {/*轮播部分*/}
                    <div style={{width:800,marginLeft:400}}>
                        <Carousel autoplay>
                            <div style={{ margin:"auto",height:150,position:'relative',
                                width:800,background: "url('../../images/icon.ico')"
                                ,backgroundPosition:"center",backgroundRepeat:"no-repeat"}}/>
                            <div style={{ margin:"auto",height:150,position:'relative',
                                width:800,background: "url('../../images/icon.ico')"
                                ,backgroundPosition:"center",backgroundRepeat:"no-repeat"}}/>
                            <div style={{ margin:"auto",height:150,position:'relative',
                                width:800,background: "url('../../images/icon.ico')"
                                ,backgroundPosition:"center",backgroundRepeat:"no-repeat"}}/>
                            <div style={{ margin:"auto",height:150,position:'relative',
                                width:800,background: "url('../../images/icon.ico')"
                                ,backgroundPosition:"center",backgroundRepeat:"no-repeat"}}/>
                        </Carousel>
                    </div>

                </div>


                {/*精品特价航线部分*/}
                <div style={{width:1250,height:50,marginTop:40}}>
                    <img style={{ width:30,
                        float:"left",
                        height:30,}}  src={require('../../images/login_check.png')}
                    />
                    <div style={{
                        float:"left",
                        marginTop:5,
                        marginLeft:20,
                        fontSize:16
                    }}>精品特价航线  </div>
                    <div style={{
                        textAlign:"right",
                        marginTop:5,
                        marginLeft:20,
                        fontSize:16
                    }}>查看更多
                    </div>
                </div>
                <div style={{width:1250}}>
                    {recommendLists}
                </div>



                {/*底部更多特价部分*/}
                <div style={{width:1250,height:400,marginTop:20,float:"left",marginBottom:30}}>


                    <div style={{float:"left",width:1100,marginLeft:75}}>
                        {specialLists}
                    </div>

                </div>
                <div style={{width:1250,textAlign:"right",padding:30,marginBottom:30,fontSize:16}}>换一组</div>
                <div style={{width:1250,textAlign:"center",marginTop:30,}}>Copyright©2015 杭州爱拼机网络科技有限公司版权所有 浙ICP备 15024358号-1</div>

            </div>
        )
    }
}
//精品特价航线view
class RecommendView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{marginTop:20,marginLeft:30, float:"left",}}>
                <div style={{width:280,height:200,backgroundColor:"#0aa",paddingTop:10}}>
                    <div style={{ margin:"auto",height:150,marginLeft:10,width:260,background: "url('../../images/icon.ico')",backgroundPosition:"center",backgroundRepeat:"no-repeat",position:'relative'}}>
                        <div style={{position:"absolute",top:"10",left:"10",fontSize:"14px",color: "#FFFFFF",}}>杭州-曼谷</div>
                    </div>
                    <div style={{width:260,marginLeft:10,marginTop:10,float:"left"}}>
                        <div style={{width:100,float:"left"}}>
                            <div style={{color:"#a00",float:"left"}}>$233</div>
                            <div style={{color:"#a00",float:"left"}}>(含税)</div> </div>
                        <div style={{width:160,float:"left",textAlign:"right"}}>233333次浏览</div>
                    </div>
                </div>
            </div>
        )
    }

}

//底部每日特价view
class SpecialView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{marginTop:15,marginLeft:25,width:250,float:"left",height:120,backgroundColor:"#0aa",paddingTop:10}}>
                <div style={{fontSize:20,marginLeft:20}}>杭州-曼谷</div>
                <div style={{marginLeft:20,marginTop:20,fontSize:15}}>
                    2017-11-01  ¥233起
                </div>
            </div>
        )
    }

}

page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;

{/*<div className={less.body}>*/}
{/*<input/>*/}
{/*<Button className={less.rightRow} icon={"search"}*/}
{/*onClick={() => {*/}
{/*window.app_open(this, "/Search", {title: "搜索"});*/}
{/*}}*/}
{/*>跳转到搜索</Button>*/}


{/*<Button className={less.rightRow} icon={"search"}*/}
{/*onClick={() => {*/}
{/*window.app_open(this, "/Content", {title: "搜索"});*/}
{/*}}*/}
{/*>跳转到详情</Button>*/}
{/*</div>*/}



