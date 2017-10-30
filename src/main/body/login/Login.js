/**
 * Created by apin on 2017/10/30.
 */
import React, { Component } from 'react';
import {Button} from 'antd';
import css from './Login.less';
import ClickHelp from '../tool/ClickHelp.js';
import MyInput from '../component/MyInput.js';
import MyDiv from "../component/MyDiv.js";
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow:true,
            isSelect:true
        };
    }
    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isShow:nextProps.isShow
        });
    }

    render() {
        let {isSelect,isShow} = this.state;
        var div = (<div className={isShow?css.main:css.mainHidden}>
            <div className={css.bgCon}>
                <div className={css.closeBtn} onClick={()=>{
                    window.close();
                }}>x</div>

                <div className={css.title}>登录账号</div>

                <div className={css.loginCell}>
                    <div style={{float:"left"}}>
                        <MyDiv div={<div className={isSelect?css.refAccountLogin:css.accountLogin} onClick={()=>{
                            this.setState({
                                isSelect:true
                            });
                        }}>账号密码登录</div>}/>
                    </div>

                    <div style={{float:"right"}}>
                        <MyDiv div={<div className={isSelect?css.accountLogin:css.refAccountLogin}
                                         onClick={()=>{
                                             this.setState({
                                                 isSelect:false
                                             });
                                         }}>账号密码登录</div>}/>
                    </div>
                </div>

                <div className={css.cell}>
                    <div className={css.cellTitle}>
                        <span>联系电话</span>
                        <span style={{fontSize:"20px",color:"red"}}>*</span>
                    </div>
                    <MyInput
                        ref="phone"
                        placeholder={"账户名/手机号"}
                        obj = {{
                            regular:/^1\d{10}$/
                        }}
                        maxLength={11}
                        className={css.defaultInput}
                        value={this.phoneNum}
                        callBack={(val)=>{
                            this.phoneNum = val;
                        }}
                    />
                </div>
                <div className={css.alertError}>{"请输入正确的手机号"}</div>

                <div className={css.cell}>
                    <div className={css.cellTitle}>
                        <span>密码</span>
                        <span style={{fontSize:"20px",color:"red"}}>*</span>
                    </div>
                    <MyInput
                        ref="phone"
                        placeholder={"密码"}
                        maxLength={11}
                        className={css.defaultInput}
                        value={this.phoneNum}
                        callBack={(val)=>{
                            this.phoneNum = val;
                        }}
                    />
                </div>
                <div className={css.alertError}>{"密码错误"}</div>

                <div className={css.btnCon}>
                    <MyDiv div={<div className={css.btn}
                                     onClick={()=>{
                                         this.showView(false);
                                     }}>登录</div>}/>
                </div>

                <div className={css.bottomCell}>
                    <div style={{float:"left"}}>
                        <MyDiv div={<div className={css.bottomText}
                                         style={{textAlign:"left"}}
                                         onClick={()=>{
                            alert("忘记密码");
                        }}>忘记密码</div>}/>
                    </div>

                    <div style={{float:"right"}}>
                        <MyDiv div={<div className={css.bottomText}
                                         style={{textAlign:"right"}}
                                         onClick={()=>{
                                             alert("注册账号");
                                         }}>注册账号</div>}/>
                    </div>
                </div>

            </div>
        </div>);
        return div;
    }
}
Login.contextTypes = {
    router: React.PropTypes.object
};
module.exports = Login;