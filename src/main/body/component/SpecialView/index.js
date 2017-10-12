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
                marginTop: 15, marginLeft: 25, width: 250, float: "left", height: 120,
                backgroundImage: 'url(' + data.image2 + ')',
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",

                backgroundColor: "#fff",
                paddingTop: 10
            }}
                {...this.props}
            >
                <div style={{fontSize: 20, marginLeft: 20}}>{
                    data.from + "-" + data.to
                }</div>
                <div style={{marginLeft: 20, marginTop: 20, fontSize: 15}}>
                    {data.time} ¥{data.money}起
                </div>
            </div>
        )
    }
}
module.exports = SpecialView;