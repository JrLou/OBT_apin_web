import React, {Component} from 'react';
import less from './Pay.less';
class Loading extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
        };
    }
    show(loading,callBack){
        this.setState({
            loading
        },callBack);
    }

    render(){
        return this.state.loading?(
            <div className={less.loading}>
                <div>loading</div>
            </div>
        ):null;
    }
}
Loading.contextTypes = {
    router: React.PropTypes.object
};
module.exports = Loading;