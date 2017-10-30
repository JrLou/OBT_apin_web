import React, {Component} from 'react';
import { Menu, Icon, Input} from 'antd';
const SubMenu = Menu.SubMenu;
import css from './Panel.less';
const Search = Input.Search;
import Base from './Base.js';

/**
 * data:[{title:"123",data:[data:[]]}]
 * onSelectRow(obj) obj:选择的行的对像
 */
class ComMenu extends Component {

    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        this.base = new Base(this);
        this.state = this.base.getDefaultState();


    }
    loadDataDone(){
        this.base.openDefaultKey();
        //通知打开绑定的组件/如果绑定的组件还没有被加载,或者正在加载中,打不开
    }
    componentDidMount() {
        console.log("好了:"+this.props.com)
        this.base.componentDidMount();
        //告诉其他人,我好了
        // this.base.sendBind({type:"ok"})
        // //打开吧

    }
    /**
     * 执行被唤醒
     * 注:如果当前组件没有被加载,此方法执行无效
     * @param obj
     */
    exeBind(obj){
        let {type} = obj;
        if(type==="ok"){
            //tab/或者其他准备好了,请求关联
            this.base.openDefaultKey();
        }else if(type==="key"){
            let key = obj.activeKey;
            if(this.state.selectedKeys&&this.state.selectedKeys.length===1&&key===this.state.selectedKeys[0]){
                return;
            }
            this.base.setSelect(key);
        }

    }
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


    render(){
        return this.base.render();
    }

    renderBase(){
        return this.state.net.data && this.state.net.data.length > 0 ? (
            <Menu
                {...this.prpos}
                className={css.main}
                mode="inline"
                selectedKeys={this.state.selectedKeys}
                defaultOpenKeys={this.state.defaultOpenKeys}
                onClick={( {item, key, keyPath})=>{
                    this.base.activeSelect(key);

                }
                }
            >
                {this.getMenuDataView(this.state.net.data,this.base.getCom())}
            </Menu>
        ) : this.base.getNoneView();
    }

}

module.exports = ComMenu;