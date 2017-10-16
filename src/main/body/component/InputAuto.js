/**
 * Created by lixifeng on 17/10/12.
 */
import React, {Component} from 'react';
import {AutoComplete} from 'antd';
import less from './InputAuto.less';
class InputAuto extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        };
        this.onSelect(this.props.defaultValue);

    }

    handleSearch(value) {
        this.setState({
            dataSource: !value ? [] : [
                value,
                value + value,
                value + value + value,
            ],
        });
    }

    onSelect(value) {
        console.log('onSelect', value);

        this.selectValue = value;
    }
    getValue(){
        console.log(this.refs.com);
        return this.selectValue;
    }
    render() {
        return <AutoComplete
            ref="com"
            dataSource={this.state.dataSource}
            className={less.input}
            onSelect={this.onSelect.bind(this)}
            onChange={(value)=>{
                this.selectValue = value;
            }}
            onSearch={this.handleSearch.bind(this)}
            {...this.props}
        />;

    }
}
module.exports = InputAuto;