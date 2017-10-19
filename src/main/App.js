/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import AppTop from './AppTop.js';
import AppBottom from './AppBottom.js';
import { Layout} from 'antd';
const { Header, Content, Footer } = Layout;
import less from './App.less';
class page extends Component{

    render(){
        return(
            <Layout className={less.main}>
                <AppTop root={this}/>
                <Content style={{marginTop:10}}>
                    {this.props.children}
                </Content>
                <Footer>
                    <AppBottom/>
                </Footer>
            </Layout>
        );
    }
}
page.contextTypes = {
    router: React.PropTypes.object
};
module.exports = page;