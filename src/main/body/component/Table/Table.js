/**
 * Created by louxudong on 2017/10/30.
 */
import React, {Component} from 'react';
import css from './Table.less';

class Table extends Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount(){

    }

    /**
     * 绘制表格头部
     * @param data
     * @returns {XML}
     */
    getTableHead(data){
        let headArray = [];
        if(data&&data.length>0){
            data.map((opt,key)=>{
               headArray.push(this.getHeadCell(opt,key));
            });
        }

        return(
            <tr>
                {headArray}
            </tr>
        );
    }

    /**
     * 绘制表头单元格
     * @param opt
     * @param key
     * @returns {XML}
     */
    getHeadCell(opt,key){
        if(opt instanceof Object){
            return(
                <th key={`thead${key}`}>
                    {opt.title}
                </th>
            );
        }
    }

    /**
     * 绘制表格主体
     * @param headData  表格头部数据
     * @param bodyData  表格主体数据
     * @returns {Array}
     */
    getTableBody(headData,bodyData){
        let bodyArray = [];
        if(bodyData&&bodyData.length>0){
            for(let key in bodyData){
                bodyArray.push(this.getBodyLine(bodyData[key],key,headData));
            }
        }

        return bodyArray;
    }

    /**
     * 绘制表格主体一行数据
     * @param opt 单行的数据
     * @param key map遍历的key值
     * @param headData  表格头部数据
     * @returns {XML}
     */
    getBodyLine(opt,key,headData){
        let lineView = [];
        if(headData&&headData.length>0){
            for(let key in headData){
                lineView.push(this.getBodyCell(headData[key],key,opt));
            }
        }

        return (
            <tr key={`bodyLine${key}`} className={css.bodyLine}>
                {lineView}
            </tr>
        );
    }

    /**
     * 绘制一个表格主体的单元格
     * @param obj  当前列表头数据
     * @param key  map遍历的key值
     * @param opt  当前行的表体数据
     * @returns {XML}
     */
    getBodyCell(obj,key,opt){
        if(obj instanceof Object && opt instanceof Object){
            if(obj.render&&obj.render instanceof Function){
                //如果在头部数据里自定义了绘制单元格的方法render，则使用此方法
                return (
                    <td key={`tbody${key}`}>
                        {obj.render(opt[obj.dataIndex],opt)}
                    </td>
                );
            }else{
                return (

                    <td key={`tbody${key}`}>
                        {opt[obj.dataIndex]}
                    </td>
                );
            }
        }
    }

    render(){
        this.columns = (this.props.columns instanceof Array)?this.props.columns:[];
        this.dataSource = (this.props.dataSource instanceof Array)?this.props.dataSource:[];

        return(
            <div className={css.containerOutside}>
                <table className={css.tableStyle}>
                    <thead>
                        {this.getTableHead(this.columns)}
                    </thead>
                    <tbody>
                        {this.getTableBody(this.columns,this.dataSource)}
                    </tbody>
                </table>
            </div>
        );
    }
}

Table.contextTypes = {
    router: React.PropTypes.object
};
module.exports = Table;