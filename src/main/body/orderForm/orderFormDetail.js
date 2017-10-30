/**
 * Created by louxudong on 2017/10/30.
 */
import React, {Component} from 'react';
import css from './orderFormDetail.less';
import { HttpTool } from '../../../../lib/utils/index.js';
import APILXD from "../../../api/APILXD.js";
import LoadingView from "../component/LoadingView.js";

class orderFormDetail extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount(){

    }


    render(){
        return(<div>订单详情页</div>);
    }
}

orderFormDetail.contextTypes = {
    router: React.PropTypes.object
};
module.exports = orderFormDetail;