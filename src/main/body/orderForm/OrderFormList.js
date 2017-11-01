/**
 * Created by louxudong on 2017/10/30.
 */
import React, {Component} from 'react';
import css from './OrderFormList.less';
import { HttpTool } from '../../../../lib/utils/index.js';
import APILXD from "../../../api/APILXD.js";
import LoadingView from "../component/LoadingView.js";
import Table from "../component/Table/index.js";
import {Pagination} from 'antd';

class OrderFormList extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount(){

    }


    render(){
        let columns = [
            {
                title:'序号',
                dataIndex:'key',
            }, {
                title:'订单号',
                dataIndex:'orderNum',
            },{
                title:'航程',
                dataIndex:'route',
            },{
                title:'出发日期',
                dataIndex:'data',
            },{
                title:'航程类型',
                dataIndex:'routeType',
            },{
                title:'人数(成人／儿童)',
                dataIndex:'peopleNum',
            },{
                title:'含税价格',
                dataIndex:'price',
            },{
                title:'订单状态',
                dataIndex:'orderState',
            },{
                title:'操作',
                dataIndex:'operation',
                render:(text,record)=>(
                    <span
                        className={css.operation}
                        onClick={()=>{
                                window.app_open(this, "/OrderFormDetail", {
                                    data:{}
                                });
                            }}
                    >
                        {text}
                    </span>
                ),
            },
        ];
        let dataSource = [
            {
                index:1,
                key:1,
                orderNum:'20170923132332333',
                route:'杭州-宁波',
                data:'2017-09-13',
                routeType:'往返',
                peopleNum:'12/2',
                price:'¥1200',
                orderState:'等待确认',
                operation:'查看详情',
            },
            {
                index:1,
                key:1,
                orderNum:'20170923132332333',
                route:'波罗地亚吉卜力岛-阿西列宁科克丽缇岛',
                data:'2017-09-13',
                routeType:'往返',
                peopleNum:'12/2',
                price:'¥1200',
                orderState:'等待确认',
                operation:'查看详情',
            },
            {
                index:1,
                key:1,
                orderNum:'20170923132332333',
                route:'杭州-宁波',
                data:'2017-09-13',
                routeType:'往返',
                peopleNum:'12/2',
                price:'¥1200',
                orderState:'等待确认',
                operation:'查看详情',
            },
        ];


        return(
            <div className={css.mainPage}>
                <div className={css.searchContainer}>
                    查询条件
                </div>
                <div className={css.resultContainer}>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                    />
                    <div className={css.pagination}>
                        <Pagination
                            showQuickJumper
                            total={500}
                            defaultCurrent={1}
                            defaultPageSize={8}
                            onChange={(num)=>{this.pageNumChange(num);}}
                        />
                    </div>
                </div>
            </div>
        );
    }

    /**
     * 分页器改变页码
     * @param num
     */
    pageNumChange(num){
        log(num);
    }
}

OrderFormList.contextTypes = {
    router: React.PropTypes.object
};
module.exports = OrderFormList;