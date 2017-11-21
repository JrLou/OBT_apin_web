/**
 * Created by louxudong on 2017/11/7.
 */
import React, {Component} from 'react';
import {Popover} from 'antd';
let LXDHelp = {
    /**
     * 输入航程数组和航程类型，动态拼接航程展示
     * @param list  Array 航程数组 eg:[{cityDep:'宁波',cityArr:'杭州'}]
     * @param type  Number 航程类型  1：单程  2：往返  3：多程
     * @param style Object 自定义外侧div样式(可选)
     * @return {xml}
     */
   routeTranslate(list,type,style){
        if(!(list instanceof Array)){
            return (<div></div>);
        }
        let flightType = type?type:1;
        let tipList = ['-','→','⇌','-'];

        let view = [];
        let length = list.length;
        if(type == 1 || type ==2){
            //单程 或 往返
            view.push(
                <span key={'cell'}>
                    {list[0].cityDep||list[0].cityNameDep}
                    {tipList[flightType]}
                    {list[0].cityArr||list[0].cityNameArr}
                </span>
            );
        }else{
            for(let key in list){
                view.push(
                    <span key={`cell${key}`}>
                    {list[key].cityDep||list[key].cityNameDep}
                        {tipList[flightType]}
                        {list[key].cityArr||list[key].cityNameArr}
                        {key<length-1?'，':''}
                </span>
                );
            }
        }


        //样式
        let divStyle =  style
                        ?style
                        :{
                            display: 'inline-block',
                            maxWidth: '100px',
                            whiteSpace: 'nowrap',
                            textOverflow:'ellipsis',
                            overflow:'hidden',
                            verticalAlign:'middle',
                        };
        return(
            <Popover content={view}>
                <div style={divStyle}>
                    {view}
                </div>
            </Popover>

        );
   },

    /**
     * 从时间对象中解析出特定时间格式字符串
     * @param time
     * @returns {string}   eg:20170324
     */
    getDateFormat(time){
        let dateString = '';
        if(time){
            let newDate = new Date(time);
            let year = newDate.getFullYear();
            let month = (newDate.getMonth()+1)>9?(newDate.getMonth()+1):'0'+(newDate.getMonth()+1);
            let day = newDate.getDate()>9?newDate.getDate():'0'+newDate.getDate();
            dateString = ''+year+month+day;
        }
        return dateString;
    },

    /**
     * 去除字符串前后的空格
     * @param text
     * @returns {string}
     */
    removeSpace(text){
        if(typeof(text) === 'string'){
            return text.replace(/(^\s+)|(\s+$)/g,'');
        }else{
            return '';
        }
    },

    /**
     * 判断数组中是否含有某值
     * @param key
     * @param array
     * @returns {boolean}
     */
    hasKey(key,array){
        let result = false;
        if(array instanceof Array){
            if(array.indexOf(key)>=0){
                result = true;
            }
        }
        return result;
    },

    /**
     * 这个方法已经被弃用，现在使用新的核对的方法
     * 这个方法已经被弃用，现在使用新的核对的方法
     * 这个方法已经被弃用，现在使用新的核对的方法
     *
     * 根据后端返回的订单状态和extraCode辅助字段，返回前端页面需要的订单状态
     * @param state（即orderStatus）
     * @param extraCode
     * @returns {Number}
     *
     *extraCode: 0订金审核中；1全款审核中；2待付订金；3待付全款；4审核失败；5尾款审核中；6未录入乘机人；7等待出票；8确认中；
     当orderStatus 为4的时候，extraCode存在 0,1,2,3的情况；orderstatus为2,3,的情况，extraCode存在4,；orderstaus为5的时候，extraCode存在4,5两种情况；orderstaus为6的时候，extraCode存在6，7两种情况；orderstaus为1的时候，extraCode存在8的情况；
     *
     *  * 最终得到的订单状态说明(页面需要展示的状态)：
     * 0：订单取消 1：等待确认 2：待付押金 3：待付款 5：待付尾款 7：已出票 8：订单关闭
     * 12：已付款（未录乘机人） 13：等待出票 14：支付审核中 15：支付审核失败
     */
    transformOrderState(state,extraCode){
        let returnState = parseInt(state);
        let returnRemark = parseInt(extraCode);
        if(LXDHelp.hasKey(returnState,[2,3,4,5,6])){
            switch(returnRemark){
                case 0:returnState = 14;break;  //state = 4
                case 1:returnState = 14;break;  //state = 4
                case 2:returnState = 2;break;  //state = 4
                case 3:returnState = 3;break;  //state = 4
                case 4:returnState = 15;break;  //state = 2,3,5
                case 5:returnState = 14;break;   //state = 5
                case 6:returnState = 12;break;   //state = 6
                case 7:returnState = 13;break;   //state = 6
                default:break;
            }
        }
        return returnState;
    },

    /**
     * 对航班详情组件对数据进行格式化
     * @param voyages       Array 航班列表（必填）
     * @param flightType    Number 航班类型（必填）
     * @param freeBag       Number 免费托运（必填）
     * @param weightLimit   Number 每件重量上线（必填）
     * @returns {{}}
     */
    getFlightData(voyages,flightType,freeBag,weightLimit){
        let formatData = {
            flightType:flightType?flightType:1,
            freeBag:freeBag?freeBag:0,
            weightLimit:weightLimit?weightLimit:0,
            voyages:[],
        };
        if(voyages instanceof Array){
            let routeList = [];
            let formatList = [];
            //进行一次排序
            for(let key in voyages){
                //获取航程index
                let tripIndex = parseInt(voyages[key].tripIndex);       //航程
                let flightIndex = parseInt(voyages[key].flightIndex);   //航段
                let newRoute = voyages[key];
                newRoute.child = [];
                if(!routeList[tripIndex]){
                    routeList[tripIndex] = [];
                }
                routeList[tripIndex][flightIndex] = newRoute;
            }
            //组装数据
            for(let n in routeList){
                let oneList = routeList[n];
                for(let m in oneList){
                    if(!formatList[n]){
                        formatList[n] = oneList[m];
                    }else{
                        formatList[n].child.push(oneList[m]);
                    }
                }
            }
            formatData.voyages = formatList;
        }

        return formatData;
    },

    /**
     * 传入时间字符串，将秒数去掉
     * @param timeString
     */
    sliceTimeString(timeString){
        if(!timeString){
            return'';
        }
        return timeString.slice(0,-3);
    },

    /**
     * 图片地址改成 七牛
     * @param url
     * @param width
     * @return {string}
     */
    changeImgUrl(url,width) {
        if (!url) {
            return '';
        }
        let w = width ? width : 150;
        let newUrl = `${url}?imageView2/0/w/${w}/interlace/1/q/75`;
        return newUrl;
    }

};
module.exports = LXDHelp;