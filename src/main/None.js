/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import { Layout} from 'antd';

import less from "./None.less";
class page extends Component{

    constructor(props){
        super(props);
        this.state = {
            time:100
        };
    }
    componentDidMount() {
        let exe  = ()=>{
            setTimeout(()=>{

                let time = this.state.time-1;
                if(time<1){
                    window.app_open(this,"/",{});
                    return;
                }
                exe();
                this.setState({
                    time
                });

            },1000);
        };
        exe();
    }


    render(){
        return(
            <Layout className={less.content}>
                <div className={less.empty}>
                    <div className={less.emptyText}>
                        <div>{"404页面,查找不到指向页面 ("+this.state.time+"秒后,回到首页)"}</div>
                    </div>
                </div>
            </Layout>
        );
    }
}
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;