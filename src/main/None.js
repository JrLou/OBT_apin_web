/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import { Layout} from 'antd';
class page extends Component{

    constructor(props){
        super(props)
        this.state = {
            time:10,
        }
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
                    time,
                })

            },1000)
        }
        exe();
    }


    render(){
        return(
            <Layout>
              {"404页面,查找不到指向页面 ("+this.state.time+"秒后,回到首页)"}
            </Layout>
        );
    }
};
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;