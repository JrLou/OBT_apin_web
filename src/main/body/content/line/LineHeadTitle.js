/**
 * Created by apin on 2017/10/11.
 */
import React, { Component } from 'react';
import css from './LineHeadTitle.less';
class page extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    render() {
        let {dataSource} = this.props;
        if (!dataSource){
            return null;
        }
        var div = (<div className={css.main}>
            <div className={css.con}>
                <div className={css.left}>
                    <img className={css.img} src={dataSource.arrCityImgUrl?dataSource.arrCityImgUrl:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1507698872895&di=e104eaeed7c2a466f932aa30d8885831&imgtype=0&src=http%3A%2F%2Fimgditan.cang.com%2F201309%2F15%2F2013091522503938058130.JPG"}/>
                </div>
                <div className={css.right}>
                    <div className={css.title}>
                        <div className={css.titleHead}>{dataSource.depCity}</div>
                        <img className={css.imgIcon}
                             src={require("../../../../images/trip_single.png")}/>
                        <div className={css.refTitleHead}>{dataSource.arrCity}（往返）</div>
                    </div>

                    <div className={css.rightLine} style={{marginTop:"50px"}}>
                        <div className={css.lineLeft}>时间</div>
                        <div className={css.lineRight}>{dataSource.startDate}</div>
                        <div className={css.center}> 至</div>
                        <div className={css.lineRight}>{dataSource.endDate}</div>
                    </div>

                    <div className={css.rightLine}>
                        <div className={css.lineLeft}>团购价</div>
                        <div className={css.thirdLineRight}>
                            <span style={{color:"#FC5948",fontSize:"12px"}}>{"¥ "}</span>
                            <span style={{color:"#FC5948",fontSize:"20px"}}>{dataSource.basePrice}</span>
                            <span style={{color:"#333333",fontSize:"12px"}}>{" 起"}</span>

                        </div>
                    </div>

                    <div className={css.rightLine}>
                        <div className={css.lineLeft}>库存</div>
                        <div className={css.thirdLineRight}>
                            <span>{"剩余 "}</span>
                            <span style={{color:"#333333",fontSize:"20px"}}>{dataSource.remainCount}</span>
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
};
module.exports = page;