/**
 * Created by apin on 2017/10/25.
 */
import React, { Component } from 'react';
import {Button} from 'antd';
import css from './StateProgress.less';
import ClickHelp from '../../../tool/ClickHelp.js';
class StateProgress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            num: props.num?props.num:0,
            imgBg_Width:25
        };
        this.stateArr = ["1.提交订单","2.确定资源","3.支付订单","4.出票完成"];
    }
    componentDidMount() {
        this.setTime();
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    setTime(){
        let i = 25;
        this.timer = setInterval(()=>{
            i = i>35?25:i+1;
            this.setState({
                imgBg_Width:i
            });
        },100);
    }

    componentWillReceiveProps(nextProps) {
        clearInterval(this.timer);
        this.setState({
            num: nextProps.num?nextProps.num:0,
            imgBg_Width:25,
        });
        this.setTime();
    }
    render() {
        let {num} = this.state;
        var div = (<div className={css.main}>
            {this.createItem(num)}
        </div>);
        return div;
    }
    createItem(num){
        var stateViewArr = [];
        for (let i = 0; i < this.stateArr.length; i++) {
            let stateItem = this.stateArr[i];
            let lineView = (<div className={css.lineBg}>
                <div className={i<=num?css.lineShow:css.line}></div>
                <div className={i<=num?css.lineShow:css.line}></div>
            </div>);
            // if (i == 0) {
            //     lineView = (<div className={css.lineBg}>
            //         <div className={css.lineHidden}></div>
            //         <div className={css.lineShow}></div>
            //     </div>);
            // }else if (i == (this.stateArr.length-1)){
            //     lineView = (<div className={css.lineBg}>
            //         <div className={i<=num?css.lineShow:css.line}></div>
            //         <div className={css.lineHidden}></div>
            //     </div>);
            // }else {
            //     lineView = (<div className={css.lineBg}>
            //         <div className={i<=num?css.lineShow:css.line}></div>
            //         <div className={i<=num?css.lineShow:css.line}></div>
            //     </div>);
            // }
            let itemView =
                (<div className={css.itemBG} key={i}>
                    <div className={css.table}>
                        {i<=num?<div className={i==num?css.imgHidden:css.imgShow}>

                            {i==num? <div className={css.imgCenter}
                                          style={{
                                              width:this.state.imgBg_Width,
                                              height:this.state.imgBg_Width
                                          }}></div>:null}

                        </div>: null}
                        <div className={i<=num?css.img_small:css.img_smallHidden}>{i+1}</div>

                        {lineView}
                    </div>
                    <div className={i<=num?css.titleShow:css.titleHidden}>{stateItem}</div>
                </div>);
            stateViewArr.push(itemView);
        }
        return stateViewArr;
    }
}
StateProgress.contextTypes = {
    router: React.PropTypes.object
};
module.exports = StateProgress;