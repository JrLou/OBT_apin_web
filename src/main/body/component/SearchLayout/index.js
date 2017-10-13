/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component} from 'react';
import {Button} from  'antd';
import InputAuto from '../InputAuto'
import less from './index.less'
/**
 * 搜索view
 */
class SearchLayout extends Component {

    constructor(props) {
        super(props)

        let {data} = this.props;
        if(!data){
            data = {}
        }
        this.state =  Object.assign({
            dataSource: []
        },data)
        this.img_login_check = require('../../../../images/login_check.png')
        this.img_login_uncheck = require('../../../../images/login_uncheck.png')
    }


    getData(){
        return {
            from:this.refs.from.getValue(),
            to:this.refs.to.getValue(),
            isSelectOneWay:this.state.isSelectOneWay,
            isSelectReturn:this.state.isSelectReturn,
        }
    }
    render() {

        return (
            <div style={{
                width: "100%"
            }}>
                <div className={less.left} >
                    <div style={{fontSize:14,color:"#393939",marginBottom:4}}>出发城市：</div>
                    <InputAuto
                        ref="from"
                        defaultValue={this.state.from}
                        placeholder="中文／拼音／三字码"/>
                </div>
                <div className={less.left}>
                    <div style={{fontSize:14,color:"#393939",marginBottom:4}}>到达城市：</div>
                    <InputAuto
                        ref="to"
                        defaultValue={this.state.to}
                        placeholder="中文／拼音／三字码"/>
                </div>
                <div className={less.left}>
                    <div className={less.left}
                         onClick={() => {
                             this.setState({
                                 isSelectOneWay: !this.state.isSelectOneWay,
                             })
                         }}>
                        <img style={{
                            width: 10,
                            marginRight: 5,
                            float: "left",
                            height: 10,
                        }} src={this.state.isSelectOneWay ? this.img_login_check : this.img_login_uncheck}
                        />
                        <div style={{float: "left",fontSize:14}}>单程</div>
                    </div>
                    <div className={less.left}
                         onClick={() => {
                             this.setState({
                                 isSelectReturn: !this.state.isSelectReturn,
                             })
                         }}>
                        <img style={{
                            width: 10,
                            marginRight: 5, float: "left",
                            height: 10,
                        }} src={this.state.isSelectReturn ? this.img_login_check : this.img_login_uncheck}
                        />
                        <div style={{float: "left",fontSize:14}}>往返</div>
                    </div>

                    <div style={{clear:"both"}}/>
                    <Button
                        type="primary"
                        style={{marginTop:16,marginLeft:104,width:169,height:38,backgroundColor:"#29A6FF",color:"#fff"}}
                        onClick={() => {

                            if (this.props.submit) {
                                this.props.submit(this.getData())
                            }
                        }}>
                        搜索航班
                    </Button>
                </div>
            </div>
        )
    }
}
module.exports = SearchLayout;