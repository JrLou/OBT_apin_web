/*
 * @Author: 钮宇豪 
 * @Date: 2017-12-04 15:31:35 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-12-06 10:14:54
 */

import React, { Component } from 'react';
import { Input } from 'antd';
import css from './sign.less';

class InputPlaceholder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFocus: false
        };
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }
    render() {
        const { isFocus } = this.state;
        const { value, placeholder, style, input, placeStyle } = this.props;
        const props = Object.assign({}, this.props, {
            ref: (input) => this.input = input,
            onBlur: this.handleBlur,
            style: {}
        });
        props.placeholder = "";
        return <div className={css.placeholderWrapper} style={style}>
            {
                !isFocus && !value && <div
                    className={css.placeholder}
                    onClick={this.handleFocus}
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
        this.input.refs.input.focus();
        this.setState({
            isFocus: true
        });
    }
    handleBlur() {
        this.setState({
            isFocus: false
        });
    }
}

const placeholder = function (input, style, placeStyle) {
    // var isPlaceholderSupported = (typeof document !== 'undefined')
    //     && 'placeholder' in document.createElement('input');
    const isIE = navigator.appName == "Microsoft Internet Explorer";
    if (!isIE)
        return React.cloneElement(input, { style });
    else
        return <InputPlaceholder {...input.props} input={input} style={style} placeStyle={placeStyle}></InputPlaceholder>;

};

export default placeholder;
