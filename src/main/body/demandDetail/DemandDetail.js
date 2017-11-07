import React, {Component} from "react";

import {Carousel, Input, Button, Row, Col, message} from "antd";
import less from "./DemandDetail.less";
import View from "../component/DemandInfoView/index";
import {HttpTool} from "../../../../lib/utils/index.js";
/**
 * 待出价      1
 * 询价中      2
 * 待确认      3
 *
 * 已确认      4
 * 已关闭      5
 * 已取消      0
 * 全部       -1
 */
class page extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData(){
        let success = (code, msg, json, option) => {
            this.state=json;
                log(json);
            alert(json);
        };
        let failure = (code, msg, option) => {

        };
        HttpTool.request(HttpTool.typeEnum.GET, "/demandapi/v1.0/demands/81a366cd6c754cbcbbc978a8b956982b", success, failure, {},
            {
                ipKey: "hlIP"
            });
        }

    render() {
        return (
            <div>
                <View type={"询价中多程"} data={this.state}/>
            </div>
        );
    }

}


page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;




