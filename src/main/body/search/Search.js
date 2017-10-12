/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import {Button} from 'antd';
import less from './Search.less';

class page extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={less.content}>

                这是搜索结果页面

                <Button className={less.rightRow} icon={"back"}
                        onClick={() => {
                            window.app_open(this, "/", {title: "回首页"});
                        }}
                >回首页</Button>
            </div>
        );
    }


}
page.contextTypes = {
    router: React.PropTypes.object
}
module.exports = page;