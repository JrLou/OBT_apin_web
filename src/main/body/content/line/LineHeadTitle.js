/**
 * Created by apin on 2017/10/11.
 */
import React, { Component } from 'react';
import {message,Button,Icon} from 'antd';
import css from './LineHeadTitle.less';
import MyDiv from '../../component/MyDiv.js';
import {CookieHelp } from '../../../../../lib/utils/index.js';
class page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow:true,
            step:0,
            isClick:"auto",
            isMyOut:true,
        };
    }

    componentWillReceiveProps(nextProps) {

    }
    componentDidMount() {

    }
    render() {
        let {dataSource} = this.props;
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

                <div className={css.requireAlertBg} style={{transform:translateX,}}>
                    <div className={css.alertImage}
                         style={{pointerEvents:this.state.isClick}}
                         onClick={()=>{
                             this.actionInOut();
                         }}>
                    <Icon type={this.state.isShow?"right":"left"}
                          style={{width: "24px",
                              height: "24px",
                              lineHeight:"24px",
                              fontWeight:"bold"
                          }}/>
                    </div>


                    <div className={css.requireAlert}>
                        {this.state.isMyOut?<div className={css.requireAlert_center}>
                            <div>
                                <span>{"若无合适的日期或航班可"}</span>
                                <span style={{fontWeight:"bold"}}>{"发布需求"}</span>，
                            </div>
                            <div>
                                <span style={{color:"#29A6FF"}}>{"爱拼机"}</span>
                                <span>{"将为您寻找合适的航班信息"}</span>
                            </div>
                        </div>:<div className={css.requireAlert_center}>
                            <div className={css.noFlight} onClick={()=>{
                                this.actionInOut();
                            }}>没有航班</div>
                        </div>}

                        <div className={css.requireAlert_right}>
                            <MyDiv div={
                                <div className={css.requireBtn} onClick={()=>{
                                    const isLogin = CookieHelp.getCookieInfo('IS_LOGIN');

                                    let obj = {
                                        lineType:dataSource.flightType,
                                        listData:[{fromCity:dataSource.depCity,toCity:dataSource.arrCity}]
                                    };
                                    if (isLogin){
                                        window.app_open(this.props.obj, "/PublishMsg", {
                                            data:obj
                                        },"new");
                                    }else {
                                        window.modal.showModal(0,()=>{
                                            window.app_open(this.props.obj, "/PublishMsg",
                                                {
                                                    lineType:dataSource.flightType,
                                                    toCity:dataSource.depCity,
                                                    fromCity:dataSource.arrCity,
                                                    isMult:false
                                                }, "new");
                                        });
                                    }
                                }}>提交需求</div>
                            }/>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
        return div;
    }
    actionInOut(){
        this.setState({
            isClick:"none",
            isShow:!this.state.isShow
        },()=>{
            if (this.state.isShow){
                this.setState({
                    isMyOut:true,
                });
            }
            let moveStep = this.state.isShow?290:0;
            let myInterval = setTimeout(()=>{
                this.timeOut(moveStep);
            },0);
        });
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
                        isMyOut:true,
                        isClick:"auto"
                    });
                }
            }else {
                moveStep = moveStep+5;
                if (moveStep<=290){
                    this.setState({
                        step:moveStep
                    });
                    setTimeout(()=>{
                        this.timeOut(moveStep);
                    },0);
                }else {
                    this.setState({
                        isMyOut:false,
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