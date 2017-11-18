/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-04 15:07:27 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-18 14:38:15
 */
import React, { Component } from 'react';
import { Table, Modal } from 'antd';
import { HttpTool } from '../../../../lib/utils/index.js';

import css from './score.less';

class ScoreList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // visible: true,
            memberPoints: [],
            remainPoint: 0,
            usedPoint: 0,
            loading: true,
            pageSize: 10,
            current: 1,
            total: 0
        };
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getPointsList = this.getPointsList.bind(this);
    }


    componentDidMount() {
        this.getPointsList(1);
    }

    render() {
        const { memberPoints } = this.state;

        const columns = [{
            title: '来源／用途',
            dataIndex: 'origin',
            key: 'origin',
            render: (text) => {
                switch (text) {
                    case 0:
                        return '消费抵扣';
                    case 1:
                        return '注册';
                    default:
                        return '';
                }
            }
        }, {
            title: '积分变化',
            dataIndex: 'points',
            key: 'points',
            render: (text) => {
                if (text > 0) text = '+' + text;
                return <div className={css.large}>{text}</div>;
            }
        }, {
            title: '日期',
            dataIndex: 'createdTime',
            key: 'createdTime',
        }];

        const { visible, loading, pageSize, current, total, remainPoint, usedPoint } = this.state;

        return (
            <div className={css.scoreContainer}>
                <h6 className={css.scoreTitle}>我的积分</h6>
                <div className={css.scoreHead}>
                    <div className={css.scoreDes}>
                        <p className={css.title}>当前总积分</p>
                        <p className={`${css.scoreNum} ${css.scoreTotal}`}>{remainPoint}</p>
                    </div>
                    <div className={css.scoreDes}>
                        <p className={css.title}>积分已抵扣</p>
                        <p className={`${css.scoreNum} ${css.scoreConsume}`}>￥{usedPoint / 1000}</p>
                    </div>
                    <div className={css.line}></div>
                </div>
                <Table
                    prefixCls="my-ant-table"
                    dataSource={memberPoints}
                    columns={columns}
                    className={css.scoreList}
                    onChange={this.handleChange}
                    pagination={{ pageSize, current, total }}
                />
                {/*<Modal title="每周连续登陆积分奖励规则"
                    visible={visible}
                    footer={null}
                    prefixCls="my-ant-modal"
                    onCancel={this.handleCancel}
                    loading={loading}
                >
                    <ul className={css.rule}>
                        <li>• 七天为一个记分周期，每天首次登录可获得积分。</li>
                        <li>• 每个记分周期内的初始积分数都为100。</li>
                        <li>• 一个记分周期内若连续登陆，则后一天积分在前一天基础上翻倍；若有中断登陆，则下一次登录奖励从初始积分数开始计算。</li>
                        <li>• 一个记分周期内若遇周六、周日、法定节假日，则当日领取奖励在原有规则基础上翻一倍。</li>
                        <li>• 积分只能在支付尾款时冲抵。</li>
                    </ul>
                    <div className={css.explain}>本活动最终解释权归爱拼机所有</div>
        </Modal>*/}
            </div>
        );
    }

    /**
     * 获取积分列表
     */
    getPointsList(pageNo) {
        log(pageNo);
        const { pageSize } = this.state;
        HttpTool.request(HttpTool.typeEnum.POST, '/bm/memberapi/v1.0/orders/pointsList', (code, message, json, option) => {
            log(json);
            const { memberPoints, remainPoint, usedPoint } = json;
            this.setState({
                memberPoints, remainPoint, usedPoint, total: option.option, current: pageNo
            });
        }, () => {
        }, {
                pageSize, pageNo
            });
    }


    handleCancel() {
        this.setState({
            visible: false
        });
    }
    handleChange(pagination) {
        log(pagination);
        const { current } = pagination;
        this.getPointsList(current);
    }
}

module.exports = ScoreList;
