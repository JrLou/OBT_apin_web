/**
 * Created by louxudong on 2017/10/30.
 */
import React, {Component} from 'react';
import css from './OrderFormList.less';
import { HttpTool } from '../../../../lib/utils/index.js';
import APILXD from "../../../api/APILXD.js";
import LoadingView from "../component/LoadingView.js";

class OrderFormList extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount(){

    }


    render(){
        return(<div>123</div>);
    }
}

OrderFormList.contextTypes = {
    router: React.PropTypes.object
};
module.exports = OrderFormList;