/**
 * Created by apin on 2017/10/26.
 */
import React, {Component} from "react";
import css from "./MyDiv.less";

class MyInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isIn: false,
        };
    }

    componentDidMount() {

    }

    render() {
        let {div} = this.props;
        return (
            <div className={this.state.isIn?css.bgIn:css.bgOut}
                 onMouseLeave={()=>{
                     this.setState({
                         isIn:false
                     });
                 }}
                 onMouseEnter={()=>{
                     this.setState({
                         isIn:true
                     });
                 }}>
                {div}
            </div>
        );
    }
}

module.exports = MyInput;