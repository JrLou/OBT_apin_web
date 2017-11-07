import React, {Component} from "react";

import {Carousel, Input, Button, Row, Col, message} from "antd";
import less from "./Demand.less";
import View from "../component/MyDemandView/index";
class page extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <View/>
            </div>
        );
    }

}


page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;




