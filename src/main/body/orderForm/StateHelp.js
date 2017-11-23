/**
 * Created by louxudong on 2017/11/16.
 */

let StateHelp = {
    //列表页的转化
    transformForList(data){
        //后台返回的订单状态newData
        let returnState = parseInt(data.orderStatus);
        //是否确认乘机人
        let isPassed = data.passed;
        //付款类型
        let payType = data.payType;
        switch(returnState){
            //4 付款中（后台特有，前端需要转化）
            case 4:returnState = StateHelp.payingStateForList(payType);break;
            //6 已付款
            case 6:returnState = StateHelp.hasPayed(isPassed);break;
            //0 订单取消
            case 0:break;
            //1 等待确认
            case 1:break;
            //2 待付订金
            case 2:break;
            //3 待付全款
            case 3:break;
            //5 待付尾款
            case 5:break;
            //7 已出票
            case 7:break;
            //8 已关闭
            case 8:break;
            default:break;
        }

        //返回转化后的状态
        return returnState;
    },

    //详情页的转化
    transformForDetail(data){
        //后台返回的订单状态
        let returnState = parseInt(data.orderStatus);
        //交易流水
        let pays =  data.pays;
        //是否确认乘机人
        let isPassed = data.passed;
        //付款类型
        let payType = data.payType;
        //倒计时
        let countDown = data.countDown;
        switch(returnState){

            //4 付款中（后台特有，前端需要转化）
            case 4:returnState = StateHelp.payingState(pays,payType);break;
            //5 待付尾款
            case 5:returnState = StateHelp.waitingPay(pays,countDown);break;
            //6 已付款
            case 6:returnState = StateHelp.hasPayed(isPassed);break;
            case 0:break;
            case 1:break;
            case 2:returnState = (countDown == 0)?8:2;
                    break;
            case 3:returnState = (countDown == 0)?8:3;
                    break;
            case 7:break;
            case 8:break;
            default:break;
        }

        //返回转化后的状态
        return returnState;
    },

    //对返回状态为4的订单状态做转化(列表页)
    payingStateForList(payType,){
        if(payType == 1){
            //付款类型为 1 全款
            return 3;   //待付全款
        }else{
            //付款类型为 2 一押
            return 2;   //待付押金
        }
    },


    //对返回状态为4的订单状态做转化(详情页)
    payingState(pays,payType,countDown){
        let state = 4;
        //遍历交易流水信息
        for(let i in pays){
            if(pays.length>0){
                for(let j in pays[i].records){
                    let payType = pays[i].records[j].payType;
                    let auditStatus = pays[i].records[j].auditStatus;
                    //线下，且审核中
                    if(payType == 0 && auditStatus == 0){
                        state = 14;//状态改为审核中
                        return state;
                    }
                }
            }
        }
        //没有满足条件的交易流水，逻辑同列表
        if(countDown == 0){
            //超时关闭订单
            return 8;
        }
        state = StateHelp.payingStateForList(payType);
        return state;
    },

    //5的转化
    waitingPay(pays,countDown){
        let state = 5;
        //遍历交易流水信息
        for(let i in pays){
            if(pays.length>0){
                for(let j in pays[i].records){
                    let payType = pays[i].records[j].payType;
                    let auditStatus = pays[i].records[j].auditStatus;
                    //线下，且审核中
                    if(payType == 0 && auditStatus == 0){
                        state = 14;//状态改为审核中
                        return state;
                    }
                }
            }
        }
        //没有满足条件的交易流水，逻辑同列表
        if(countDown == 0){
            //超时关闭订单
            return 8;
        }
        state = 5;//待付尾款
        return state;
    },

    //6的转化
    hasPayed(isPassed){
        let passed = isPassed;
        if(passed){
            //已付款，且已确定乘机人，返回13 等待出票
            return 13;
        }else{
            //已付款，未录乘机人
            return 12;
        }
    },
};
module.exports = StateHelp;