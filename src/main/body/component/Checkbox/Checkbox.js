import React, {Component} from 'react';
import css from './Checkbox.less';

class Checkbox extends Component{
    constructor(props){
        super(props);
        this.state = {
            isChecked:this.props.defaultVal?this.props.defaultVal:false,
        };

        if(this.props.onChange instanceof Function){
            this.callback = this.props.onChange;
        }
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount(){

    }

    render(){
        let label = this.props.label;
        return(
            <div
                {...this.props}
                onClick={()=>{
                    this.changeState();
                }}
                style={{
                    cursor:'pointer'
                }}
                className={css.checkboxContainer}
            >
                <span
                    className={this.state.isChecked?css.checkIcon:css.unCheckIcon}
                ></span>
                <span className={css.labelStyle}>{label}</span>
            </div>
        );
    }

    changeState(){
        let state = !this.state.isChecked;
        log(state);
        this.setState({
            isChecked:state,
        },this.callback(state));
    }
}

Checkbox.contextTypes = {
    router: React.PropTypes.object
};
module.exports = Checkbox;