/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-04 15:07:27 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-04 17:46:18
 */
import React, { Component } from 'react';
import { Table } from 'antd';

import css from './score.less';

class ScoreList extends Component {
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
            </div>
        );
    }
}

module.exports = ScoreList;
