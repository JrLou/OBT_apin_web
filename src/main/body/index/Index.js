import React, {Component} from 'react';

import {Carousel, Input, Button,Row, Col} from 'antd';
import less from './Index.less';

import RecommendView from '../component/RecommendView';
import SpecialView from '../component/SpecialView';
import SearchLayout from '../component/SearchLayout';
import SearchHelp from '../search/SearchHelp.js';

import routes from '../../../vm/routes.js';
class page extends Component {
    constructor(props) {
        super(props);
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


    render() {

        return (
            <div style={{margin:"auto",maxWidth:1200}}>
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
                        </div>
                    </div>
                    <Row >
                    {this.getRecommendList()}
                    </Row>
                    <br/>
                </div>
                {/*底部更多特价部分*/}
                <div  className={less.center}>
                    <div className={less.centerTitleLayout}>
                        <div className={less.centerIcon}/>
                        <div className={less.centerTitle}>更多机票路线</div>
                    </div>
                <Row>
                    {this.getSpecialList()}
                </Row>
                    <br/>
                </div>
                <div style={{clear:"both"}}/>
                <div className={less.more}>
                    加载中...</div>

            </div>
        );

    }


}


page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;




