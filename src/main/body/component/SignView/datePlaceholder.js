import React, { Component } from 'react';
import css from './sign.less';

class DatePlaceholder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFocus: false,
            open:false,
        };
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }
    render() {
        const { isFocus } = this.state;
        const { value, placeholder, style, input,placeStyle } = this.props;
        const props = Object.assign({},this.props,{
            open:this.state.open,
            onOpenChange:this.openChange.bind(this),
            ref: (input) => this.input = input,
            onBlur: this.handleBlur,
            style: {}
        });
        return <div className={css.placeholderWrapper} style={style}>
            {
                !isFocus && !value && <div
                    className={css.placeholder}
                    onClick={()=>{this.handleFocus(input);}}
                    style={placeStyle}
                >
                    {placeholder}
                </div>
            }
            {
                React.cloneElement(input, props)
            }
        </div>;
    }
    handleFocus() {
        this.setState({
            open:true,
            isFocus: true
        });
    }
    handleBlur() {
        this.setState({
            open:false,
            isFocus: false
        });
    }
    openChange(value){
        this.setState({
            open:value,
            isFocus:value,
        });
    }
}

const placeholder = function (input, style, placeStyle) {
    var isPlaceholderSupported = (typeof document !== 'undefined')
        && 'placeholder' in document.createElement('input');
    if (isPlaceholderSupported) return React.cloneElement(input, { style });
    else
        return <DatePlaceholder {...input.props} input={input} style={style} placeStyle={placeStyle}></DatePlaceholder>;

};

export default placeholder;
