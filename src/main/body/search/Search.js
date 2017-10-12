import React, { Component } from 'react';

import {Carousel,Button,Input } from 'antd';

import less from './Search.less';
class page extends Component {
    constructor(props) {
        super(props)
        this.state = {
            current: 1,
        }
        this.onChange=(page)=>{
            this.setState({
                current:page
            })
        }
    }
    render(){
        this.searchData=[1,2,3,4,5,6,7,8,9,10,11,12];
        var searchLists = this.searchData.map((val, index) => {
            return (
                <SearchView key={index} />
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
                            <img src={require("../../../images/login_check.png")}/>
                        </div>

                        <div style={{paddingTop:10,float:"left"}}>
                            <h3 style={{color:"#fff",}}>爱拼机</h3>
                            <h4 style={{color:"#fff"}}>www.apin.com</h4>
                        </div>
                    </div>
                    <div style={{textAlign:"right",paddingTop:5,fontSize:17}}>客服电话：12334344567</div>
                </div>

                {/*搜索输入框部分*/}
                <div>
                    <div style={{marginTop:20}}>
                        <div style={{float:"left"}}>航程类型：<Input style={{width:200,marginRight:10}}  type="text" placeholder="全部"/></div>
                    </div>
                    <div style={{marginTop:20}}>
                        <div style={{float:"left"}}>出发城市：<Input style={{width:200,marginRight:10}}  type="text" placeholder="全部"/></div>
                    </div>
                    <div style={{marginTop:20}}>
                        <div style={{float:"left"}}>目的城市：<Input style={{width:200,marginRight:10}}  type="text" placeholder="全部"/></div>
                    </div>
                    <Button style={{
                        backgroundColor:"#66ecfb" ,
                        color: "#000",
                        width:80,
                        marginLeft:30,
                        height:33,
                    }}>
                        搜索
                    </Button>

                </div>
                {/*空部分*/}
                <div style={{marginTop:20,width:1250}}>
                    <div style={{ margin:"auto",height:"653px",width:"873px",background: "url('../../../images/icon.ico')",backgroundPosition:"center",backgroundRepeat:"no-repeat",position:'relative'}}>
                        <div style={{ position:"absolute",top:"62%",left:"32%"}}>
                            <h2 style={{fontFamily:"MicrosoftYaHei",fontSize:"14px",color: "#FFFFFF",letterSpacing: 0,lineHeight: "16px"}}>没有查询到航班信息，请重新搜索或联系客服询问航班 </h2>
                            <Button type="primary" style={{ width: '140px',fontSize:"12px",position:"absolute",left:"120px",top:"80px"}} size="large" >联系客服</Button>
                        </div>
                    </div>
                </div>

                {/*搜索列表部分*/}
                <div style={{width:1250,height:700}}>
                    {searchLists}
                </div>

                <div style={{width:1250,textAlign:"right"}}>
                    <Pagination showQuickJumper current={this.state.current} total={500} onChange={this.onChange} />
                </div>

            </div>
        )
    }
}
//底部每日特价view
class SearchView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{marginTop:20,marginLeft:30, float:"left",}}>
                <div style={{width:280,height:200,backgroundColor:"#0aa",paddingTop:10}}>
                    <div style={{ margin:"auto",height:150,marginLeft:10,width:260,background: "url('../../../images/icon.ico')",backgroundPosition:"center",backgroundRepeat:"no-repeat",position:'relative'}}>
                        <div style={{position:"absolute",top:"10",left:"10",fontSize:"14px",color: "#FFFFFF",}}>杭州-曼谷</div>
                        <div style={{position:"absolute",fontSize:"14px",color: "#FFFFFF",top:"10",right:"10"}}>往返</div>
                        <div style={{position:"absolute",fontSize:"14px",color: "#FFFFFF",bottom:"10",left:"10"}}>2017-9-1至2018-2-10</div>

                    </div>
                    <div style={{width:260,marginLeft:10,marginTop:10,float:"left"}}>
                        <div style={{width:100,float:"left"}}>
                            <div style={{color:"#a00",float:"left"}}>$233</div>
                            <div style={{float:"left",color:"#ccc"}}>起</div> </div>
                        <div style={{width:160,float:"left",textAlign:"right"}}>233333次浏览</div>
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

{/*<div className={less.content}>*/}

    {/*这是搜索结果页面*/}

    {/*<Button className={less.rightRow} icon={"back"}*/}
            {/*onClick={() => {*/}
                {/*window.app_open(this, "/", {title: "回首页"});*/}
            {/*}}*/}
    {/*>回首页</Button>*/}
{/*</div>*/}

