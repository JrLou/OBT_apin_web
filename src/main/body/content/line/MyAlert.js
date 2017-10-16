/**
 * Created by apin on 2017/10/11.
 */
import React, { Component } from 'react';
import css from './MyAlert.less';
class MyAlert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
        };
    }
    componentDidMount() {

    }
    refreshView(){
        this.setState({
            isShow:true,
        });
    }
    render() {
        var div = (<div className={this.state.isShow?css.main:css.hidden}>
            <div className={css.alertbg}>
                <div className={css.title}>
                    请联系客服预订下单
                </div>
                <div className={css.con}>
                    <span style={{color:"#888D99",fontSize:"14px"}}>客服电话 :</span>
                    <span>0571-85071773</span>

                </div>

                <div className={css.btn} onClick={()=>{
                    this.setState({
                        isShow:false,
                    });
                }}>
                    关闭
                </div>
            </div>
        </div>);
        return div;
    }
}
MyAlert.contextTypes = {
    router: React.PropTypes.object
};
module.exports = MyAlert;