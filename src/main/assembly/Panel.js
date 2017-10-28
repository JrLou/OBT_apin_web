import React, {Component} from 'react';
import Window from './Window.js';
import Tab from './Tab.js';
import Menu from './Menu.js';
import css from './Panel.less';

class Panel extends Window {

    constructor(props) {
        super(props);
    }


    getPanel() {
        return this.com||{};
    }


    render() {
        //返回空结构
        let {com} = this.props;
        let Com = null;
        switch (com) {
            case "tab":
                Com = Tab;
                break;
            case "menu":
                Com = Menu;
                break;
            default:
                break;
        }
        return (
            <div >

                {Com ? <Com {...this.props} ref={(ref) => {
                    this.com = ref;
                }}/> : <div>请添加正确的com类型</div>}
            </div>
        );
    }
}

// {"|".repeat(100).split("|").map((data,key)=>{
//     console.log(key)
//     return <div key={key}> aa{key}</div>
// })}

module.exports = Panel;