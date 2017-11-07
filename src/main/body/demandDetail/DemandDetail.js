import React, {Component} from "react";

import {Carousel, Input, Button, Row, Col, message} from "antd";
import less from "./DemandDetail.less";
import View from "../component/DemandInfoView/index";
/**
 * 需求处理中        1
 * 需求已确认        2
 * 需求已关闭        3
 * 需求已取消        4
 * 处理完成          5
 * 需求确认          6
 * 需求处理中（多程）  7
 * 待用户确认        8
 *
 */
class page extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <View type={8}/>
            </div>
        );
    }

}


page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;




