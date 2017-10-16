/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component} from 'react';
import {AutoComplete} from 'antd';
import css from './index.less';
/**
 * 底部每日特价view
 */
class SpecialView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: []
        };
    }

    render() {
        let {data} = this.props;
        if (!data)return null;
        let img = null;
        if(data.type===1){
            img = require('../../../../images/wfw.png');
        }else{
            img = require('../../../../images/dcw.png');
        }
        return (
            <div
                className={css.cell}
                {...this.props}
            >
                <div className={css.bottom}>
                <div className={css.bottomLeft}>

                   <div className={css.table}>
                       <div className={css.text}> {data.from}</div>


                       <div className={css.text2}>
                           <div className={css.icon}
                                style={{
                                    backgroundImage: "url(" + img + ")"
                                }}
                           >
                           </div>
                       </div>


                       <div className={css.text}> {data.to}</div>
                   </div>


                    <div style={{clear:"both"}}>
                        <font className={css.money}>{"￥"}</font>
                        <font className={css.moneyBig}>{data.money}</font>
                        <font className={css.moneyGray}>{"起"}</font>
                    </div>



                </div>
                    <div className={css.bottomRight}>
                        <font className={css.date}>{"已团"}</font>
                        <font className={css.date}>{data.count+"张"}</font>
                        <br/>
                        <font className={css.date}>10月13日</font>
                    </div>
                </div>
            </div>
        );
    }
}
module.exports = SpecialView;