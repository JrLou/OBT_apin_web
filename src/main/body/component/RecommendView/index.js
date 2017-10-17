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
        super(props);
        this.state = {
            dataSource: []
        };
    }

    componentDidMount() {

    }

    render() {

        let {data,template} = this.props;

        if (!data)return null;
        return (
            <div
                className={css.cell}
                {...this.props}
            >
                <div className={css.border}>
                    <div
                        className={css.content}

                    >
                        <div  className={css.imageFrame} style={{
                            backgroundImage: "url(" + data.image + ")"
                        }}/>
                        <div className={css.showFrame}>
                            {
                                this.getImageBottom(data,template)
                            }
                            <div className={css.tag}>
                                {data.tag}
                            </div>
                        </div>
                    </div>
                    {
                        this.getBottom(data,template)
                    }

                </div>

            </div>
        );
    }


    getCountShow(data,template)
    {
        if(template==1){
            return (
                <div className={css.bottomRight}>
                    <font className={css.moneyBlack}>{"已团"}</font>
                    <font className={css.money}>{data.count+"张"}</font>
                    <br/>
                    <font className={css.moneyGray}>{"还剩"+data.count+"张"}</font>
                </div>
            );
        }else {
            return (
                <div >
                    <font className={css.moneyWhite}>{"已团"}</font>
                    <font className={css.money}>{data.count+"张"}</font>
                    <font className={css.moneyWhiteV}>{"|"}</font>
                    <font className={css.moneyWhite}>{"还剩"+data.count+"张"}</font>
                </div>
            );
        }

    }

    getTitleLayout(data,template){

        let img = null;
        if(data.type==1){
            img = require('../../../../images/wfw.png');
        }else{
            img = require('../../../../images/dcw.png');
        }
        return (
            <div>
            <div className={template==1?css.title:css.titleBlack} >
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
                <div style={{clear:"both"}}/>
            </div>
        );

    }
    getImageBottom(data,template) {

        return (
            <div className={css.titleLayout}>
                {template==1?this.getTitleLayout(data,template):this.getCountShow(data,template)}
            </div>
        );
    }

    getBottom(data,template) {
        if(template==1){
            return (
                <div className={css.bottom}>
                    <div className={css.bottomLeft}>
                        <font className={css.money}>{"￥"}</font>
                        <font className={css.moneyBig}>{data.money}</font>
                        <font className={css.moneyGray}>{"起"}</font>
                        <br/>
                        <font className={css.moneyGray}>{"(含税)"}</font>
                    </div>
                    {this.getCountShow(data,template)}
                </div>
            );
        }else{
            return (
                <div className={css.bottom}>
                    <div className={css.bottomLeft}>
                        {this.getTitleLayout(data,template)}
                        <div
                            className={css.moneyGray}
                        >{data.time}</div>
                    </div>

                    <div className={css.bottomRight}>
                        <font className={css.money}>{"￥"}</font>
                        <font className={css.moneyBig}>{data.money}</font>
                        <font className={css.moneyGray}>{"起"}</font>
                    </div>
                </div>
            );
        }

    }
}
module.exports = RecommendView;