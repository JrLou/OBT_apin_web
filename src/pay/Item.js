import React, {Component} from 'react';
import less from './Pay.less';
import {Col} from  'antd';
class Item extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Col
                {...this.props}
            >
                <div className={this.props.select ? less.payItemSelect : less.payItem}>
                    {this.props.children}
                </div>
            </Col>
        );
    }
}
Item.contextTypes = {
    router: React.PropTypes.object
};
module.exports = Item;