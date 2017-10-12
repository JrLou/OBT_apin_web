/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component} from 'react';
import {AutoComplete} from 'antd';
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


    render() {

        let {data} = this.props;
        if (!data)return null;
        return (
            <div
                {...this.props}
                style={{marginTop: 20, marginLeft: 30, float: "left",}}>
                <div style={{
                    width: 280, height: 200,
                    backgroundColor: "#fff",
                    paddingTop: 10
                }}>
                    <div style={{
                        margin: "auto",
                        height: 150, marginLeft: 10, width: 260,
                        backgroundImage:'url('+data.image+')',
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat", position: 'relative'
                    }}>
                        <div
                            style={{position: "absolute", top: "10", left: "10", fontSize: "14px", color: "#FFFFFF",}}>{
                            data.from + "-" + data.to
                        }</div>
                    </div>
                    <div style={{width: 260, marginLeft: 10, marginTop: 10, float: "left"}}>
                        <div style={{width: 100, float: "left"}}>
                            <div style={{color: "#a00", float: "left"}}>${data.money}</div>
                            <div style={{color: "#a00", float: "left"}}>(含税)</div>
                        </div>
                        <div style={{width: 160, float: "left", textAlign: "right"}}>{data.views}次浏览</div>
                    </div>
                </div>
            </div>
        )
    }
}
module.exports = RecommendView;