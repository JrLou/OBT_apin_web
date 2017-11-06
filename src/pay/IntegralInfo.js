import React, {Component} from 'react';
import {InputNumber} from 'antd';
import less from './IntegralInfo.less';

class IntegralInfo extends Component {
   constructor(props) {
      super(props);
      this.state = {
         upData: 0,
      };
   }

   componentDidMount() {
      if (this.props.onPriceChange) {
         this.props.onPriceChange(this.getData().use);
      }
   }

   getData() {
      return this.props.data || {};
   }

   render() {
      let data = this.getData();

      return (
         <div
            {...this.props}
         >
            <div className={less.integralInfo}>
               <div className={less.integralInfo_right}>
                  <div className={less.integralInfo_top}>积分抵扣</div>
                  <div className={less.integralInfo_middle}>
                     <div className={less.integralInfo_middle_line1}>
                        <span className={less.integralInfo_middle_line1_light}>您目前有{data.all}积分:</span>
                        <span className={less.integralInfo_middle_line1_heavy}>可抵用付款500元</span>
                     </div>
                     <div className={less.integralInfo_middle_line2}>
                        <span className={less.integralInfo_middle_line2_light}>请输入您要抵用的积分:</span>
                        <InputNumber
                           defaultValue={data.use === 0 ? "": data.use}
                           min={0}
                           step={1}
                           size="large"
                           formatter={value => `${value}千`}
                           parser={value => value.replace('千', '')}
                           onChange={(e) => {
                              console.log(e);
                              let v = Number(e)*1000;// Number(e.target.value);
                              if (Number.isInteger(v)) {
                                 data.use = v;
                                 this.setState({
                                    upData: this.state.upData + 1
                                 });
                              } else {
                                 //请输入数字
                              }
                              if (this.props.onPriceChange) {
                                 this.props.onPriceChange(data.use);
                              }
                           }}
                           style={{width: "120"}}
                        />&nbsp;
                        <span className={less.integralInfo_middle_line2_msg}>
                                    可抵用<span
                           className={less.integralInfo_middle_line2_msg_price}>{(data.use / 1000).toFixed(2)}</span>元
                                </span>
                     </div>

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