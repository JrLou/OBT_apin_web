import React, {Component} from 'react';
import { Menu, Icon, Input} from 'antd';
const SubMenu = Menu.SubMenu;
import css from './Panel.less';
const Search = Input.Search;

/**
 * data:[{title:"123",data:[data:[]]}]
 * onSelectRow(obj) obj:选择的行的对像
 */
class TableCom extends Component {

    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        this.state = Object.assign(this.state||{},{
            selectedKeys:[],
            defaultOpenKeys:[],
        });
        console.log(this.props)
        console.log("==2")
    }

    componentDidMount() {
        // console.log("panelTable:"+this.props.base.getCom())
    }
    render(){

        return <div>123</div>
    }
    //a

    getMenuDataView(data,key = "") {
        return data.map((obj,index)=>{
            let unKey = key+index;
            return (
                obj.data?
                    (
                        <SubMenu
                            key={unKey} title={<span>{obj.icon?<Icon type={obj.icon}/>:null}<span>{obj.title}</span></span>}>
                            {
                                this.getMenuDataView(obj.data,unKey+"_")
                            }
                        </SubMenu>
                    )
                    :(<Menu.Item key={unKey} >{obj.title}</Menu.Item>)

            );
        });
    }
    render2(){
        return <div>123</div>
    }
    //012222
    // renderBase33(){
    //     return this.state.net.data && this.state.net.data.length > 0 ? (
    //         <Menu
    //             {...this.prpos}
    //             className={css.main}
    //             mode="inline"
    //             selectedKeys={this.state.selectedKeys}
    //             defaultOpenKeys={this.state.defaultOpenKeys}
    //             onClick={( {item, key, keyPath})=>{
    //                 this.activeSelect(key);
    //
    //             }
    //             }
    //         >
    //             {this.getMenuDataView(this.state.net.data,this.getCom())}
    //         </Menu>
    //     ) : this.getNoneView();
    // }

}
module.exports = TableCom;