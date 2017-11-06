/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-04 15:07:27 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-06 10:58:42
 */
import React, { Component } from 'react';
import { Table, Modal } from 'antd';

import css from './score.less';

class ScoreList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true
        };
        this.handleCancel = this.handleCancel.bind(this);
    }
    render() {
        const dataSource = [{
            key: '1',
            name: '签到',
            age: 100,
            address: '2017年9月21日 13:11:20'
        }, {
            key: '2',
            name: '签到',
            age: 100,
            address: '2017年9月21日 13:11:20'
        }];

        const columns = [{
            title: '来源／用途',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '积分变化',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: '日期',
            dataIndex: 'address',
            key: 'address',
        }];

        const { visible } = this.state;

        return (
            <div className={css.scoreContainer}>
                <h6 className={css.scoreTitle}>我的积分</h6>
                <div className={css.scoreHead}>
                    <div className={css.scoreDes}>
                        <p className={css.title}>当前总积分</p>
                        <p className={`${css.scoreNum} ${css.scoreTotal}`}>1200</p>
                    </div>
                    <div className={css.scoreDes}>
                        <p className={css.title}>积分已抵扣</p>
                        <p className={`${css.scoreNum} ${css.scoreConsume}`}>￥300</p>
                    </div>
                    <div className={css.line}></div>
                </div>
                <Table prefixCls="my-ant-table" dataSource={dataSource} columns={columns} className={css.scoreList} />
                <Modal title="每周连续登陆积分奖励规则"
                    visible={visible}
                    footer={null}
                    prefixCls="my-ant-modal"
                    onCancel={this.handleCancel}
                >
                    <ul className={css.rule}>
                        <li>• 七天为一个记分周期，每天首次登录可获得积分。</li>
                        <li>• 每个记分周期内的初始积分数都为100。</li>
                        <li>• 一个记分周期内若连续登陆，则后一天积分在前一天基础上翻倍；若有中断登陆，则下一次登录奖励从初始积分数开始计算。</li>
                        <li>• 一个记分周期内若遇周六、周日、法定节假日，则当日领取奖励在原有规则基础上翻一倍。</li>
                        <li>• 积分只能在支付尾款时冲抵。</li>
                    </ul>
                    <div className={css.explain}>本活动最终解释权归爱拼机所有</div>
                </Modal>
            </div>
        );
    }

    handleCancel() {
        this.setState({
            visible: false
        });
    }
}

module.exports = ScoreList;
