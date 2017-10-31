/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import Panel from '../assembly/Panel.js';
import css from './UserPage.less';
class page extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className={css.main}>
                {"|".repeat(2).split("|").map((data,key)=>{
                    return <div key={key}>用户管理页面0-{key}</div>;
                })}
                <div className={css.down}>   {this.getTable()}</div>
            </div>
        );
    }
    //
    getTable(){
        let columns = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            sorter: true,
            render: text => <a href="#" style={{color: 'red'}}>{text}</a>,
        }, {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
            sorter: true,
        }, {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            sorter: true,
        }];

        for(let i=0;i<3;i++){
            columns.push({
                title: '其他'+i,
                dataIndex: 'other'+i,
                key: 'other'+i,
                sorter: false,
            })
        }

        return (<Panel com={"table"}
                       table={
                           {
                               columns
                           }
                       }
                       action={"vm"}
                       data={{title:"test"}}
                       ref={(ref) => {
                           this.tablePanel = ref;
                       }}

        />);
    }
}
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;