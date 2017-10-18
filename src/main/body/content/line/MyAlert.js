/**
 * Created by apin on 2017/10/11.
 */
import React, { Component } from 'react';
import {Button} from 'antd';
import css from './MyAlert.less';
class MyAlert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false
        };
    }
    componentDidMount() {

    }
    refreshView(){
        this.setState({
            isShow:true
        });
    }
    render() {
        var div = (<div className={this.state.isShow?css.main:css.hidden}
                        onClick={()=>{
                            this.setState({
                                isShow:false
                            });
                        }}>
            <div className={css.alertbg}>
                <div className={css.title}>
                    {this.props.data?this.props.data:"请联系客服预订下单"}
                </div>
                <div className={css.con}>
                    <span style={{color:"#888D99",fontSize:"14px"}}>客服电话 :</span>
                    <span> 0571-58122998</span>
                </div>

                <div className={css.btn}><Button
                    type="primary"
                    className={css.btnText}
                    onClick={() => {
                        this.setState({
                            isShow:false
                        });
                    }}>{"关闭"}
                </Button>
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