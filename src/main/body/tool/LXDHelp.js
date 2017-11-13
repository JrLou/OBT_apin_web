/**
 * Created by louxudong on 2017/11/7.
 */
import React, {Component} from 'react';
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

        //样式
        let divStyle = style
                        ?style
                        :{
                            display: 'inline-block',
                            maxWidth: '100px',
                            whiteSpace: 'nowrap',
                            textOverflow:'ellipsis',
                            overflow:'hidden',
                        };
        return(
            <div style={divStyle}>
                {view}
            </div>
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
     * 根据后端返回的订单状态和remark辅助字段，返回前端页面需要的订单状态
     * @param state
     * @param remark
     * @returns {Number}
     */
    transformOrderState(state,extraCode){
        let returnState = parseInt(state);
        let returnRemark = parseInt(extraCode);
        if(LXDHelp.hasKey(returnState,[2,3,4,5,6])){
            switch(returnRemark){
                case 0:returnState = 14;break;
                case 1:returnState = 15;break;
                case 2:returnState = 12;break;
                case 3:returnState = 13;break;
                case 5:returnState = 3;break;
                case 6:returnState = 2;break;
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
    }
};
module.exports = LXDHelp;