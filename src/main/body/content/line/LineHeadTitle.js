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
            <div className={css.title}>
                杭州 ⇌ 曼谷（往返）
            </div>

            <div className={css.con}>
                <div className={css.left}>
                    <img className={css.img} src={"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1507698872895&di=e104eaeed7c2a466f932aa30d8885831&imgtype=0&src=http%3A%2F%2Fimgditan.cang.com%2F201309%2F15%2F2013091522503938058130.JPG"}/>
                </div>
                <div className={css.right}>
                    <div className={css.rightLine}>
                        <div className={css.lineLeft}>类型</div>
                        <div className={css.lineRight}>单程</div>
                    </div>

                    <div className={css.rightLine}>
                        <div className={css.lineLeft}>航程</div>
                        <div className={css.refLineRight}>杭州</div>
                        <div className={css.center}> 至</div>
                        <div className={css.refLineRight}>曼谷</div>
                    </div>

                    <div className={css.rightLine}>
                        <div className={css.lineLeft}>团购价</div>
                        <div className={css.thirdLineRight}>$2333起</div>
                    </div>

                    <div className={css.rightLine}>
                        <div className={css.lineLeft}>库存</div>
                        <div className={css.thirdLineRight}>剩余2333个座位</div>
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