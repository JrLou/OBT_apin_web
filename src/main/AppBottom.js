/**
 * Created by lixifeng on 17/3/24.
 */
import React, {Component} from 'react';
class page  extends Component {

    render() {
        return (
            <div
                style={{
                    lineHeight:"25px",
                    textAlign:"center",
                }}
            >
                设为首页 | 收藏本站 | 隐私条款 | 免责声明 | 联系我们
                <br/>
                Copyright©2015 杭州爱拼机网络科技有限公司版权所有 浙ICP备 15024358号-1
                <br/>
                <img src="/dang.jpg"/>
            </div>
        );
    }
};
module.exports = page;