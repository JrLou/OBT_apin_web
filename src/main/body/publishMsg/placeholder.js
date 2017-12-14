/*
 * @Author: 钮宇豪 
 * @Date: 2017-12-04 15:31:35 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-12-04 18:37:07
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
        const { value, placeholder, style } = this.props;
        return <div className={css.placeholderWrapper} style={style}>
            {
                !isFocus && !value && <div className={css.placeholder} onClick={this.handleFocus}>
                    {placeholder}
                </div>
            }
            <Input
                ref={(input) => this.input = input}
                onBlur={this.handleBlur}
                {...this.props}
                style={style}
            />
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

const placeholder = function (input, style) {
    var isPlaceholderSupported = (typeof document !== 'undefined')
        && 'placeholder' in document.createElement('input');
    if (isPlaceholderSupported) return <Input {...input.props} style={style} />;
    else
        return <InputPlaceholder {...input.props} style={style}></InputPlaceholder>;

};

export default placeholder;
