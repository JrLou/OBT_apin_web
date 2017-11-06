/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-06 13:39:17 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-06 17:32:10
 */
import React, { Component } from 'react';

import css from './step.less';

class Step extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { index, description, current } = this.props;
        return (
            <div className={`${css.step} ${current >= index + 1 && css.active}`} style={this.props.style}>
                <div className={css.line}></div>
                <div className={css.index}>{index + 1}</div>
                <div className={css.des}>{description}</div>
            </div>
        );
    }
}

class Steps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: props.step || 1,
            steps: [{
                description: '1.提交订单',
            }, {
                description: '2.确认资源',
            }, {
                description: '3.支付订单',
            }, {
                description: '4.出票完成',
            }]
        };
    }
    render() {
        const { current, steps } = this.state;
        return (
            <div className={css.steps}>
                {steps.map((step, index) => <Step style={{ width: '25%' }} current={current} key={index} index={index} description={step.description}></Step>)}
            </div>
        );
    }
}

module.exports = Steps;
