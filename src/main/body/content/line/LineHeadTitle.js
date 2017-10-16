/**
 * Created by apin on 2017/10/11.
 */
import React, { Component } from 'react';
import css from './LineHeadTitle.less';
class page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        }
    }
    componentDidMount() {

    }

    render() {
        var div = (<div className={css.main}>
            <div className={css.con}>
                <div className={css.left}>
                    <img className={css.img} src={"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1507698872895&di=e104eaeed7c2a466f932aa30d8885831&imgtype=0&src=http%3A%2F%2Fimgditan.cang.com%2F201309%2F15%2F2013091522503938058130.JPG"}/>
                </div>
                <div className={css.right}>
                    <div className={css.title}>
                        杭州 ⇌ 曼谷（往返）
                    </div>

                    <div className={css.rightLine} style={{marginTop:"60px"}}>
                        <div className={css.lineLeft}>时间</div>
                        <div className={css.lineRight}>2017-09-21</div>
                        <div className={css.center}> 至</div>
                        <div className={css.lineRight}>2017-10-02</div>
                    </div>

                    <div className={css.rightLine}>
                        <div className={css.lineLeft}>团购价</div>
                        <div className={css.thirdLineRight}>
                            <span style={{color:"#FC5948",fontSize:"12px"}}>{"¥ "}</span>
                            <span style={{color:"#FC5948",fontSize:"20px"}}>2333</span>
                            <span style={{color:"#333333",fontSize:"12px"}}>{" 起"}</span>

                        </div>
                    </div>

                    <div className={css.rightLine}>
                        <div className={css.lineLeft}>库存</div>
                        <div className={css.thirdLineRight}>
                            <span>{"剩余 "}</span>
                            <span style={{color:"#333333",fontSize:"20px"}}>2333</span>
                            <span>{" 个座位"}</span>
                        </div>
                    </div>
                </div>
            </div>

            </div>);
        return div;
    }
}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;