/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import less from './App.less';
import Panel from './assembly/Panel.js';
import { Row, Col } from 'antd';
import Control from './assembly/Control.js';
class page extends Component {
    constructor(props) {
        super(props);
        this.control = new Control();
    }


    render() {

        return (
            <Row justify="space-around" align="middle" className={less.main}>
                <Col span={4} className={less.mainLeft}>
                    {this.getMenu()}
                </Col>
                <Col span={24-4} className={less.mainRight}>
                    {this.getTab()}
                </Col>
            </Row>
        );
    }

    componentDidMount() {
        this.control.bind(this.menuPanel,this.tabPanel);
    }

// <div onClick={()=>{
//     this.tabPanel.getPanel().addTab({
//         title:"123",
//         getView:()=>{
//             return (
//                 <div>你好啊,这是树页面</div>
//             );
//         }
//     })
// }}>add</div>

    getMenu(){
        let vmData = (max,title = "",count)=>{
            max--;
            if(max<0){
                return null;
            }
            let data = [];
            for(let i = 0;i<count;i++){
                let t = title+i;
                let arr = vmData(max,t+"_",count);
                let obj = {
                    title:t,
                    icon:"lock"
                };
                if(arr){
                    obj.data = arr;
                }
                data.push(obj);
            }
            return data;
        }
        let data = vmData(2,"标题",10)
        return (<Panel com={"menu"}
                       relation={ this.tabPanel }
                       data={data}
                       action={"vm"}
                       ref={(ref) => {
                           this.menuPanel = ref;
                       }}

        />);
    }
    getTab(){
        return (<Panel

            com={"tab"}
            tabPosition={"top"}
            type={'editable-card'}
            onTabClick={(key)=>{
                //alert(key)
            }}
            ref={(ref) => {
                this.tabPanel = ref;
            }}/>);
    }
}
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;