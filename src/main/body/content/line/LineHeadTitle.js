/**
 * Created by apin on 2017/10/11.
 */
import React, { Component } from 'react';
import {message,Button,Icon} from 'antd';
import css from './LineHeadTitle.less';
import MyDiv from '../../component/MyDiv.js';
class page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource:props.dataSource,
            isShow:true,
            step:0,
            isClick:"auto"
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
        var translateX = "translateX("+ this.state.step +"px)";

        var div = (<div className={css.main}>
            <div className={css.con}>
                <div className={css.left}>
                    <div className={css.img} style={{
                        backgroundImage: "url(" + this.getImageUrlForQiNiu(dataSource.arrCityImgUrl) + ")"
                    }}></div>
                </div>
                <div className={css.right}>
                    <div className={css.title}>
                        <div className={css.titleHead}>{dataSource.depCity}</div>

                        <img className={css.imgIcon}
                             src={dataSource.flightType==2?require("../../../../images/trip_round.png"):require("../../../../images/trip_single.png")}/>
                        <div className={css.refTitleHead}>{dataSource.arrCity}{dataSource.flightType==2?"（往返）":"（单程）"}</div>
                    </div>

                    <div className={css.rightLine} style={{marginTop:"40px"}}>
                        <div className={css.lineLeft}>时间</div>
                        <div className={css.lineRight}>{dataSource.startDate}</div>
                        <div className={css.center}> 至</div>
                        <div className={css.lineRight}>{dataSource.endDate}</div>
                    </div>

                    <div className={css.rightLine}>
                        <div className={css.lineLeft}>团购价</div>
                        <div className={css.thirdLineRight}>
                            <span className={css.price}>{"¥ "}</span>
                            <span style={{fontSize:"20px", color:"#FF5841"}}>{dataSource.basePrice}</span>
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

                <div className={css.requireAlert}
                     style={{
                    transform:translateX,
                }}>
                    <div className={css.requireAlert_left}
                         style={{pointerEvents:this.state.isClick}}
                         onClick={()=>{
                        this.setState({
                            isClick:"none",
                            isShow:!this.state.isShow
                        },()=>{
                            let moveStep = this.state.isShow?320:0;
                            let myInterval = setTimeout(()=>{
                                this.timeOut(moveStep);
                            },0);
                        });
                    }}>
                        <MyDiv div={<Icon type={this.state.isShow?"right":"left"} className={css.alert_img}/>}/>
                    </div>
                    <div className={css.requireAlert_center}>{"若无合适的日期或航班可发布需求，爱拼机将为您寻找合适的航班信息"}</div>
                    <div className={css.requireAlert_right}>
                        <Button type="primary"
                                style={{height:"32",letterSpacing:"1px",fontSize:"13px",borderRadius:"2px"}}
                                onClick={()=>{
                                    alert("提交需求");
                                }}>提交需求</Button>
                    </div>
                </div>
            </div>


        </div>);
        return div;
    }

    timeOut(moveStep){
            if (this.state.isShow){
                moveStep = moveStep-5;
                if (moveStep>0){
                    this.setState({
                        step:moveStep
                    });
                    setTimeout(()=>{
                        this.timeOut(moveStep);
                    },0);
                }else {
                    this.setState({
                        isClick:"auto"
                    });
                }
            }else {
                moveStep = moveStep+5;
                if (moveStep<=320){
                    this.setState({
                        step:moveStep
                    });
                    setTimeout(()=>{
                        this.timeOut(moveStep);
                    },0);
                }else {
                    this.setState({
                        isClick:"auto"
                    });
                }

            }
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