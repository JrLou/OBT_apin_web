/**
 * Created by louxudong on 2017/11/7.
 */
import React, {Component} from 'react';
let LXDHelp = {
    /**
     * 输入航程数组和航程类型，动态拼接航程展示
     * @param list  Array 航程数组 eg:[{cityDep:'宁波',cityArrive:'杭州'}]
     * @param type  Number 航程类型  0：单程  1：往返  2：多程
     * @param style Object 自定义外侧div样式(可选)
     * @return {xml}
     */
   routeTranslate(list,type,style){
        if(!(list instanceof Array)){
            return (<div></div>);
        }
        let flightType = type?type:0;
        let tipList = ['→','⇌','-'];

        let view = [];
        let length = list.length;
        for(let key in list){
            view.push(
                <span key={`cell${key}`}>
                                {list[key].cityDep}
                    {tipList[flightType]}
                    {list[key].cityArrive}
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
    }

};
module.exports = LXDHelp;