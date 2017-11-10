/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-08 13:36:12 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-09 20:29:56
 */
import { HttpTool } from '../../../../../lib/utils/index.js';
import md5 from 'md5';
import { message } from 'antd';

export function loginPromise(account, password, code) {
    return new Promise((resolve, reject) => {
        HttpTool.request(HttpTool.typeEnum.POST, "/memberapi/v1.1/tokens", (code, message, json, option) => {
            if (json.accessToken) {
                resolve(json);
            } else {
                reject(message);
            }
        }, (error) => {
            reject(error);
        }, {
                account,
                option: md5(md5(account + password) + code)
            });
    });
}

/**
 * 获取登录码
 * @param {*} account 
 * @param {*} type 
 */
export function getLoginCodePromise(account, type) {
    return new Promise((resolve, reject) => {
        HttpTool.request(HttpTool.typeEnum.POST, "/memberapi/v1.1/tokens/codes", (code, message, json, option) => {
            if (json) {
                resolve(json);
            } else {
                reject(message);
            }
        }, (error) => {
            reject(error);
        }, {
                account
            });
    });
}
/**
 * 获取登录码
 * @param {*} account 
 * @param {*} type 
 */
export function validateLogin(key,value) {
    const params = {
        account: '', mobile: '', picCode: ''
    };
    params[key] = value;
    return new Promise((resolve, reject) => {
        HttpTool.request(HttpTool.typeEnum.POST, "/memberapi/v1.1/verifyInfo", (code, message, json, option) => {
            if (json) {
                log("sssssssssssss111111111111111111111111111");
                log(json);
                resolve(json);
            } else {
                reject(message);
            }
        }, (error) => {
            reject(error);
        }, params);
    });
}
