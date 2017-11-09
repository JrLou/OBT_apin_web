import React, {Component} from 'react';
import less from './PayInfo.less';

class PayInfo extends Component {
   constructor(props) {
      super(props);
      this.state = {
         use: 0,
      };
   }

    /**
     *
     * @param use 单位 / 分
     */
   upDatePrice(use) {
      this.setState({
         use: use*100
      });
   }

   getData() {
      return this.props.data || {};
   }

   render() {
      let data = this.getData();

      let passengersInfo = "";
      if(data.adultCount){
          passengersInfo +=(data.adultCount+"/成人");
      }
       if(data.childCount){
           passengersInfo +=(data.childCount+"/儿童");
       }


      return (
         <div
            {...this.props}
         >
            <div className={less.payInfo}>
               <div className={less.payInfo_top}>订单信息</div>
               <div className={less.payInfo_middle}>
                  <div className={less.fr + " " + less.payInfo_middle_priceBox}>
                     订单金额：<span className={less.payInfo_middle_priceBox_rmb}>￥</span>
                     <span className={less.payInfo_middle_priceBox_price}>{data.price}</span>
                     <br/>
                     （请在 <span className={less.payInfo_middle_priceBox_rmb}>{data.expiredTime}</span> 内支付）
                  </div>
                  <div>
                     <p>
                        订单编号：
                        <span className={less.payInfo_middle_msg}>{data.orderNo}</span>
                     </p>
                     <p>
                        订单金额：
                        <span className={less.payInfo_middle_msg}>￥{data.price}</span>
                     </p>
                     <p>
                        乘机人数：
                        <span className={less.payInfo_middle_msg}>{passengersInfo}</span>
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