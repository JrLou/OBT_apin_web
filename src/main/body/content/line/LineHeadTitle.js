/**
 * Created by apin on 2017/10/11.
 */
import React, { Component } from 'react';
import css from './LineHeadTitle.less';
class page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource:props.dataSource
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            dataSource:nextProps.dataSource
        });
    }
    componentDidMount() {

    }
    render() {
        let {dataSource} = this.state;
        if (!dataSource ||dataSource.length<1){
            return null;
        }
        var div = (<div className={css.main}>
            <div className={css.con}>
                <div className={css.left}>
                    <img className={css.img} src={this.getImageUrlForQiNiu(dataSource.arrCityImgUrl)}/>
                </div>
                <div className={css.right}>
                    <div className={css.title}>
                        <div className={css.titleHead}>{dataSource.depCity}</div>
                        <img className={css.imgIcon}
                             src={dataSource.flightType==2?require("../../../../images/trip_round.png"):require("../../../../images/trip_single.png")}/>
                        <div className={css.refTitleHead}>{dataSource.arrCity}（往返）</div>
                    </div>

                    <div className={css.rightLine} style={{marginTop:"30px"}}>
                        <div className={css.lineLeft}>时间</div>
                        <div className={css.lineRight}>{dataSource.startDate}</div>
                        <div className={css.center}> 至</div>
                        <div className={css.lineRight}>{dataSource.endDate}</div>
                    </div>

                    <div className={css.rightLine}>
                        <div className={css.lineLeft}>团购价</div>
                        <div className={css.thirdLineRight}>
                            <span className={css.price}>{"¥ "}</span>
                            <span className={css.refPrice}>{dataSource.basePrice}</span>
                            <span className={css.text}>{" 起"}</span>
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
    getImageUrlForQiNiu(url, w = 500) {
        if (!url) {
            return require("../../../../images/default.png");
        }
        return url.split("?")[0] + "?imageView2/0/w/" + w + "/interlace/1/q/75";
    }
}
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;