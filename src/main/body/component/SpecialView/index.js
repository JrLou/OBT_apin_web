/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component} from 'react';
import {AutoComplete} from 'antd';
/**
 * 底部每日特价view
 */
class SpecialView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        };
    }

    render() {
        let {data} = this.props;
        if (!data)return null;
        return (
            <div
                style={{
                marginTop: 7, marginLeft: "0.5%",marginRight:"0.5%", width: "19%",float:"left", height: 69,
                backgroundColor: "#f6f6f6",
                    display: "table",
                paddingTop: 12
            }}
                {...this.props}
            >
                <div style={{position:"absolute", width: "19%"}}>
                <div style={{fontSize: 14, marginLeft: 12, position:"absolute"}}>{
                    data.from + "-" + data.to
                }</div>
                <div style={{fontSize: 12, position:"absolute",right:5,color:"#888787"}}>
                    已团612张
                </div>
                <div style={{paddingLeft: 14, width: "100%",marginTop: 25, fontSize: 15, position:"absolute"}}>
                    <div style={{position:"absolute"}}>
                        <font style={{marginTop:5,color: "#FF5841", fontSize:10}}>¥</font>
                        <font style={{color: "#FF5841", fontSize:16}}>{data.money}</font>
                        <font style={{marginTop:5,color: "#2A2A2A",fontSize:10,}}>起</font>
                    </div>
                    <font style={{fontSize:12,marginTop:5,color:"#666",position:"absolute",right:11}}>10月13日</font>
                </div>
                </div>
            </div>
        );
    }
}
module.exports = SpecialView;