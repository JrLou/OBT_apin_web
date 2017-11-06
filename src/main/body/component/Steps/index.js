/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-06 13:39:17 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-06 14:24:58
 */
import React, { Component } from 'react';
import { Steps, Button, message } from 'antd';
const Step = Steps.Step;

const steps = [{
    title:'1',
    description: '1.提交订单',
}, {
    title:'2',
    description: '2.确认资源',
}, {
    title:'3',
    description: '3.支付订单',
},{
    title:'4',
    description: '4.出票完成',
}];

class PaySteps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 2,
        };
    }
    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }
    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }
    render() {
        const { current } = this.state;
        return (
            <div style={{ width: '640px' }}>
                <Steps prefixCls="my-ant-steps" current={current}>
                    {steps.map((item,index) => <Step key={item.title} title={item.title} description={item.description} />)}
                </Steps>
            </div>
        );
    }
}

module.exports = PaySteps;
