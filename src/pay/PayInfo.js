import React, {Component} from 'react';
import less from './PayInfo.less';

class PayInfo extends Component {
   constructor(props) {
      super(props);
      this.state = {
         use: 0,
      };
   }

   upDatePrice(use) {
      this.setState({
         use: use
      });
   }

   getData() {
      return this.props.data || {};
   }

   render() {
      let data = this.getData();
      data.payPrice = data.price - this.state.use;
      return (
         <div
            {...this.props}
         >
            <div className={less.payInfo}>
               <div className={less.payInfo_top}>订单信息</div>
               <div className={less.payInfo_middle}>
                  <div className={less.fr + " " + less.payInfo_middle_priceBox}>
                     订单金额：<span className={less.payInfo_middle_priceBox_rmb}>￥</span>
                     <span className={less.payInfo_middle_priceBox_price}>{((data.payPrice) / 100).toFixed(2)}</span>
                     <br/>
                     （请在 <span className={less.payInfo_middle_priceBox_rmb}>00：29：59</span> 内支付）
                  </div>
                  <div>
                     <p>
                        订单编号：
                        <span className={less.payInfo_middle_msg}>{data.orderId}</span>
                     </p>
                     <p>
                        订单金额：
                        <span className={less.payInfo_middle_msg}>￥{((data.payPrice) / 100).toFixed(2)}</span>
                     </p>
                     <p>
                        乘机人数：
                        <span className={less.payInfo_middle_msg}>{data.passengersInfo}</span>
                     </p>
                  </div>

               </div>
               <div className={less.payInfo_bottom}>
                  <p>航班价格变动频繁，请尽快完成支付以免耽误出行</p>
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