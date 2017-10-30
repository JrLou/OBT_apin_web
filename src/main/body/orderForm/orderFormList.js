/**
 * Created by louxudong on 2017/10/30.
 */
import React, {Component} from 'react';
import css from './orderFormList.less';
import { HttpTool } from '../../../../lib/utils/index.js';
import APILXD from "../../../api/APILXD.js";
import LoadingView from "../component/LoadingView.js";

class orderFormList extends Component{
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

orderFormList.contextTypes = {
    router: React.PropTypes.object
};
module.exports = orderFormList;