import React, {Component} from 'react';
import less from './Pay.less';
class PayInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            use:0,
        };
    }

    upDatePrice(use){
        this.setState({
            use:use
        });
    }
    getData(){
        return this.props.data ||{};
    }
    render() {
        let data = this.getData();
        data.payPrice = data.price-this.state.use;
        return (
            <div
                {...this.props}
            >
                <div className={less.payInfo}>

                    <div>
                        本次需支付金额:￥{((data.payPrice)/100).toFixed(2)}无
                    </div>
                    <div>
                        标题:{data.title}
                    </div>
                    <div>
                        描述:{data.desc}
                    </div>
                </div>
            </div>
        );
    }
}
PayInfo.contextTypes = {
    router: React.PropTypes.object
};
module.exports = PayInfo;