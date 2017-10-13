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
                style={{
                marginTop: 12, marginLeft: 11, width: 228, float: "left", height: 69,
                backgroundColor: "#f6f6f6",
                paddingTop: 12
            }}
                {...this.props}
            >
                <div style={{position:"absolute", width: 228}}>
                <div style={{fontSize: 14, marginLeft: 12, position:"absolute"}}>{
                    data.from + "-" + data.to
                }</div>
                <div style={{fontSize: 12, position:"absolute",right:5,color:"#888787"}}>
                    已团612张
                </div>
                <div style={{paddingLeft: 14, width: 228,marginTop: 23, fontSize: 15, position:"absolute"}}>
                    <div style={{float: "left",position:"absolute"}}>
                        <div style={{marginTop:5,color: "#FF5841", float: "left",fontSize:10}}>¥</div>
                        <div style={{color: "#FF5841", float: "left",fontSize:16}}>{data.money}</div>
                        <div style={{marginTop:5,color: "#2A2A2A", float: "left",fontSize:10,}}>起</div>
                    </div>
                    <div style={{fontSize:12,marginTop:5,color:"#666",position:"absolute",right:11}}>10月13日</div>
                </div>
                </div>
            </div>
        )
    }
}
module.exports = SpecialView;