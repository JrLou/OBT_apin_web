/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component} from 'react';
import {Button,Input} from  'antd';
import AutoInput from '../AutoInput'
import less from './index.less'
/**
 * 搜索view
 */
class SearchLayout extends Component {

    constructor(props) {
        super(props)

        let {data} = this.props;
        if(!data){
            data = {}
        }
        this.state =  Object.assign({
            loading:false,
        },data)
        this.img_login_check = require('../../../../images/login_check.png')
        this.img_login_uncheck = require('../../../../images/login_uncheck.png')
    }


    getData(){
        return {
            from:this.refs.from.getValue(),
            to:this.refs.to.getValue(),
            one:this.state.one,
            two:this.state.two,
        }
    }
    homeView(){
        return(

        <div style={{
            width: "100%"
        }}>
            <div className={less.left} style={{zIndex:5,position:"relative",
                width: "100%"}}>
                <div style={{fontSize:14,color:"#393939",marginBottom:4}}>出发城市：</div>
                <AutoInput
                    ref="from"
                    defaultValue={this.state.from}
                    placeholder="中文／拼音／三字码"/>
            </div>
            <div className={less.left} style={{zIndex:2,position:"relative",
                width: "100%"}}>
                <div style={{fontSize:14,color:"#393939",marginBottom:4}}>到达城市：</div>
                <AutoInput
                    ref="to"
                    defaultValue={this.state.to}
                    placeholder="中文／拼音／三字码"/>
            </div>
            <div style={{float:"left",marginTop:6,zIndex:1,position:"relative",}}>
                <div className={less.left}
                     onClick={() => {
                         this.setState({
                             one: !this.state.one,
                         })
                     }}>
                    <img style={{
                        width: 10,
                        marginRight: 5,
                        float: "left",
                        height: 10,
                        marginTop:6
                    }} src={this.state.one ? this.img_login_check : this.img_login_uncheck}
                    />
                    <div style={{float: "left",fontSize:14}}>单程</div>
                </div>
                <div className={less.left}
                     onClick={() => {
                         this.setState({
                             two: !this.state.two,
                         })
                     }}>
                    <img style={{
                        width: 10,
                        marginRight: 5, float: "left",
                        height: 10,
                        marginTop:6
                    }} src={this.state.two ? this.img_login_check : this.img_login_uncheck}
                    />
                    <div style={{float: "left",fontSize:14}}>往返</div>
                </div>

                <div style={{clear:"both"}}/>
                <Button
                    loading={this.state.loading}
                    type="primary"
                    style={{marginTop:16,marginLeft:"50%",width:169,height:38,backgroundColor:"#29A6FF",color:"#fff"}}
                    onClick={() => {

                        if (this.props.submit) {
                            this.props.submit(this.getData())
                        }
                    }}>
                    {"搜索"+(this.state.loading?"中":"")}
                </Button>
            </div>
        </div>            )

    }

    searchView(){
        return(
        <div style={{
            width: "100%",
            paddingTop:20
        }}>
            <div className={less.left} style={{marginLeft:42}}>
                <div
                    onClick={() => {
                        this.setState({
                            one: !this.state.one,
                        })
                    }} style={{marginTop:-3}}>
                    <img style={{
                        width: 10,
                        marginRight: 5,
                        marginTop:6,
                        float: "left",
                        height: 10,
                    }} src={this.state.one ? this.img_login_check : this.img_login_uncheck}
                    />
                    <div style={{fontSize:14,color:"#4F5762"}}>单程</div>
                </div>
                <div
                    onClick={() => {
                        this.setState({
                            two: !this.state.two,
                        })
                    }} style={{marginTop:13}}>
                    <img style={{
                        width: 10,
                        marginRight: 5, float: "left",
                        height: 10,
                        marginTop:6,
                    }} src={this.state.two ? this.img_login_check : this.img_login_uncheck}
                    />
                    <div style={{float: "left",fontSize:14,color:"#4F5762"}}>往返</div>
                </div>
            </div>
            <div className={less.left} style={{width:1,marginLeft:20,height:52,backgroundColor:"#cbd3e5"}}/>

            <div className={less.left} style={{width:"30%",marginTop:20}}>
                <div style={{marginTop:7,fontSize:14,color:"#393939",float:"left",zIndex:2}}>出发城市：</div>
                <AutoInput
                    ref="from"
                    style={{marginLeft:70,zIndex:1}}
                    defaultValue={this.state.from}
                    placeholder="中文／拼音／三字码"/>
            </div>
            <div className={less.left} style={{width:"30%",marginTop:20}}>
                <div style={{marginTop:7,fontSize:14,float:"left",color:"#393939",zIndex:2}}>到达城市：</div>
                <AutoInput
                    ref="to"
                    style={{marginLeft:70,zIndex:1}}
                    defaultValue={this.state.to}
                    placeholder="中文／拼音／三字码"/>
            </div>
            <div className={less.left} style={{marginTop:20}}>
                <div style={{clear:"both"}}/>
                <Button
                    loading={this.state.loading}
                    type="primary"
                    style={{marginLeft:"20%",width:169,height:38,backgroundColor:"#29A6FF",color:"#fff"}}
                    onClick={() => {

                        if (this.props.submit) {
                            this.props.submit(this.getData())
                        }
                    }}>
                    {"搜索"+(this.state.loading?"中":"")}
                </Button>
            </div>
        </div>)
    }

    render() {
        let {type} = this.props;
        return (
            <div style={{width:"100%"}}>
                {type===1?this.homeView():this.searchView()}
            </div>
        )
    }

    setLoading(loading){
        this.setState({
            loading:loading,
        })
    }
}
module.exports = SearchLayout;