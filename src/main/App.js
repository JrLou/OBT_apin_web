/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
import AppTop from './AppTop.js';
import AppBottom from './AppBottom.js';
import { Layout} from 'antd';
const { Header, Content, Footer } = Layout;

class page extends Component{

    render(){
        return(
            <Layout>
                <Header style={{backgroundColor:"#fff"}}>
                    <AppTop root={this}/>
                </Header>
                <Content >
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