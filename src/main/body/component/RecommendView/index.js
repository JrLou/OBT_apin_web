/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component} from 'react';
import {AutoComplete} from 'antd';
import css from './index.less';
/**
 * //精品特价航线view
 */
class RecommendView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
        }
    }

    componentDidMount() {

    }

    render() {

        let {data} = this.props;
        if (!data)return null;
        return (
            <div
                className={css.cell}
                {...this.props}
            >
                <div className={css.border}>
                    <div
                        className={css.content}
                        style={{
                            backgroundImage: "url(" + data.image + ")"
                        }}
                    >
                        <div className={css.titleLayout}>
                            <div className={css.title}>
                                <div className={css.text}> {data.from}</div>
                                <div className={css.text2}>
                                    <div className={css.icon}>

                                    </div>
                                </div>
                                <div className={css.text}> {data.to}</div>
                            </div>
                        </div>
                        <div className={css.tag}>
                            {data.tag}
                        </div>
                    </div>

                    <div className={css.bottom}>
                        <div className={css.bottomLeft}>
                            <font className={css.money}>{"￥"}</font>
                            <font className={css.moneyBig}>{data.money}</font>
                            <font className={css.moneyBlack}>{"参考价"}</font>
                        </div>
                        <div className={css.bottomRight}>
                            <font className={css.moneyBlack}>{"已团"}</font>
                            <font className={css.money}>{data.count+"张"}</font>
                            <font className={css.moneyBlack}>{"|还剩"+data.count+"张"}</font>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
module.exports = RecommendView;