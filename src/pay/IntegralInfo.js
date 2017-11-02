import React, {Component} from 'react';
import less from './Pay.less';

class IntegralInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            upData:0,
        };
    }

    componentDidMount() {
        if(this.props.onPriceChange){
            this.props.onPriceChange(this.getData().use);
        }
    }

    getData(){
        return this.props.data ||{};
    }
    render() {
        let data = this.getData();

        return (
            <div
                {...this.props}
            >
                <div className={less.integralInfo}>

                    <div className={less.integralInfoImg}>
                        图片
                    </div>
                    <div className={less.integralInfoRight}>
                        <div>积分抵扣</div>
                        <div>
                            您目前有{data.all}积分    可抵用付款500元
                            请输入您要抵用的积分
                            <input defaultValue={data.use}
                                   onChange={(e)=>{
                                       let v =Number(e.target.value);
                                       if(Number.isInteger(v)) {
                                           data.use = v;

                                           this.setState({
                                               upData:this.state.upData+1
                                           });
                                       }else{
                                           //请输入数字
                                       }
                                       if(this.props.onPriceChange){
                                           this.props.onPriceChange(data.use);
                                       }
                                   }}
                            />
                            可抵用{(data.use/1000).toFixed(2)}元
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
IntegralInfo.contextTypes = {
    router: React.PropTypes.object
};
module.exports = IntegralInfo;