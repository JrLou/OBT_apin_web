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
                {"|".repeat(100).split("|").map((data,key)=>{
                    return <div key={key}>用户管理页面0-{key}</div>;
                })}
                <div className={css.down}>   {this.getTable()}</div>
            </div>
        );
    }
    //
    getTable(){
        return (<Panel com={"table"}
                       action={"data"}
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