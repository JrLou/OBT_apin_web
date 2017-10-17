import React, {Component} from 'react';

import {Carousel, Input, Button,Row, Col} from 'antd';
import less from './Index.less';

import RecommendView from '../component/RecommendView';
import SpecialView from '../component/SpecialView';
import SearchLayout from '../component/SearchLayout';
import SearchHelp from '../search/SearchHelp.js';
import {HttpTool} from '../../../../lib/utils/index.js';
import routes from '../../../vm/routes.js';

import Scroll from 'react-scroll'; // Imports all Mixins
// Or Access Link,Element,etc as follows

var Link       = Scroll.Link;
var Events     = Scroll.Events;
var scroll     = Scroll.animateScroll;
var scrollSpy  = Scroll.scrollSpy;

class page extends Component {
    constructor(props) {
        super(props);
        this.scrollToTop = this.scrollToTop.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.page = 1;//页码
        this.state = {

            dataSource:[],
            loading:false
        };
    }

    componentDidMount() {

        Events.scrollEvent.register('begin', function() {
            console.log("begin", arguments);
        });

        Events.scrollEvent.register('end', function() {
            console.log("end", arguments);
        });

        scrollSpy.update();

        window.addEventListener('scroll', this.handleScroll);
        this.getNetData();
        this.getBoutiqueData();
    }
    /*获取精品航线数据*/
    getBoutiqueData(){
        var param = {

        };
        var success = (code, msg, json, option) => {
            log(json);
        };
        var failure = (code, msg, option) => {
            log(msg);
        };
        HttpTool.request(HttpTool.typeEnum.POST,"/airlineapi/v1.0/bestList",success, failure, param,
            {
                ipKey:'hlIP'
            });
    }

    componentWillUnmount() {
        Events.scrollEvent.remove('begin');
        Events.scrollEvent.remove('end');
        window.removeEventListener('scroll', this.handleScroll);
    }
    handleScroll(){
        // var bodyRect = document.body.getBoundingClientRect();
        let sy = this.getScrollTop() + this.getWindowHeight();
        let sh = this.getScrollHeight();
       // log(sh -sy);
        if(sh -sy <100){
          this.toBottom();
        }
    }


    toBottom(){
            this.getNetData();
    }
    getScrollTop(){
        let scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
        if(document.body){
            bodyScrollTop = document.body.scrollTop;
        }
        if(document.documentElement){
            documentScrollTop = document.documentElement.scrollTop;
        }
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        return scrollTop;
    }
    //文档的总高度

    getScrollHeight(){
        let scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
        if(document.body){
            bodyScrollHeight = document.body.scrollHeight;
        }
        if(document.documentElement){
            documentScrollHeight = document.documentElement.scrollHeight;
        }
        scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
        return scrollHeight;
    }

//浏览器视口的高度

    getWindowHeight(){
        let windowHeight = 0;
        if(document.compatMode == "CSS1Compat"){
            windowHeight = document.documentElement.clientHeight;
        }else{
            windowHeight = document.body.clientHeight;
        }
        return windowHeight;
    }
    scrollToTop() {
        scroll.scrollToTop();
    }
    scrollToBottom() {
        scroll.scrollToBottom();
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
            );
        });
    }
    setLoading(loading,cb){
        this.setState({
            loading:loading
        },cb);
    }
    isLoading(){
        return this.state.loading;
    }

    getNetData(){
        if(this.isLoading()){
            return;
        }

        this.setLoading(true,()=>{
            setTimeout(()=>{
                this.setLoading(false,()=>{
                    this.setState({
                        dataSource:this.state.dataSource.concat(routes.getData(12))
                    },()=>{
                        // scroll.scrollToBottom();
                        // this.scrollToTop();
                    });
                });
            },200);
        });

    }
    getSpecialList(data) {
        if(!data)return;
        return data.map((data, index) => {
            return (
            <SpecialView
                key={index}
                onClick={() => {
                    SearchHelp.openSearch(this,data);
                }}
                data={data}/>
            );

        });
    }

    getSwitchLayout() {

        return (
            <div className={less.topRight} >

               <div className={less.topRightContent}>
                   <Carousel autoplay >
                       {
                           [1,2,3].map((data,index)=>{
                               return  (
                                   <div
                                       key={index}
                                       className={less.topRightCarousel}>
                                       {data}
                                   </div>
                               );
                           })
                       }
                   </Carousel>
               </div>
            </div>

        );
    }

    render22(){
        let arr = [];
        for(let i =0;i<100;i++){
            arr.push(<div key={i}>{i}</div>);
        }
        return (
            <div
                style={{margin:"auto",maxWidth:1200}}
                ref={(ref)=>{
                    this.myScroll = ref;
                }}>
                {arr}
                    </div>
        );
    }
    render() {

        return (
            <div
                style={{margin:"auto",maxWidth:1200}}>
                {/*<li> <a onClick={() => scroll.scrollToBottom()}>Scroll To 100!</a></li>*/}
                <Row>
                    <Col span={6}>
                        <div  className={less.topLeft}>
                            <div className={less.topLeftBorder}>
                                <div className={less.topLeftTitle}>团飞机票搜索</div>
                                <div className={less.topLeftContent}>
                                    <SearchLayout
                                        data={window.apin.getCache("search")}
                                        type={1}
                                        submit={(data)=>{
                                            SearchHelp.openSearch(this,data);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col span={18}
                    >
                        {/*轮播部分*/}
                        {this.getSwitchLayout()}
                    </Col>
                </Row>
                {/*精品特价航线*/}
                <div className={less.center}>
                    <div className={less.centerTitleLayout}>
                        <div className={less.centerIcon}/>
                        <div className={less.centerTitle}>精品特价航线</div>

                        <div className={less.centerTitleMoreLayout}>
                            <div className={less.centerTitleMore}>更多路线推荐</div>
                            <div className={less.centerIconMore}/>
                        </div>                  </div>
                    <Row >
                    {this.getRecommendList()}
                    </Row>
                    <br/>
                </div>
                {/*底部更多特价部分*/}
                <div  className={less.center}>
                    <div className={less.centerTitleLayout}>
                        <div className={less.bottomIcon}/>
                        <div className={less.centerTitle}>更多机票路线</div>
                    </div>
                <Row>
                    {this.getSpecialList(this.state.dataSource)}
                </Row>
                    <br/>
                </div>
                {this.state.loading?<div className={less.more}>
                    加载中...</div>:
                    <div className={less.more}
                        onClick={()=>{
                            this.getNetData();
                        }}
                    >
                    下拉加载更多</div>}


            </div>
        );

    }


}


page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;




