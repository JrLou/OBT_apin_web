/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-08 13:36:12 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-13 16:13:23
 */
import { HttpTool, CookieHelp } from '../../../../../lib/utils/index.js';
import md5 from 'md5';
import { message } from 'antd';

export const defaultAccount = 'b3619ef5dc944e4aad02acc7c83b220d';
export const defaultPwd = '4b91884d9290981da047b4c85af35a39';

/**
 * 登录
 * @param {*} account 
 * @param {*} password 
 * @param {*} code 
 */
export function loginPromise(account, password, code) {
    return new Promise((resolve, reject) => {
        HttpTool.request(HttpTool.typeEnum.POST, "/bm/memberapi/v1.1/tokens", (code, message, json, option) => {
            if (json.accessToken) {
                json.Authorization = json.accessToken;
                // 保存登录token
                CookieHelp.saveUserInfo(json);
                // 获取注册验证码也会带掉登录接口 保存APIN_USER token
                // IS_LOGIN判断是否真的登录
                CookieHelp.saveCookieInfo('IS_LOGIN', true);
                resolve(json);
            } else {
                reject(message);
            }
        }, (code, message) => {
            reject(message);
        }, {
                account,
                option: md5(md5(account + password) + code)
            });
    });
}

/**
 * 获取登录码
 * @param {*} account 
 */
export function getLoginCodePromise(account, option) {
    return new Promise((resolve, reject) => {
        HttpTool.request(HttpTool.typeEnum.POST, "/bm/memberapi/v1.1/tokens/codes", (code, message, json, option) => {
            if (json) {
                resolve(json);
            } else {
                reject(message);
            }
        }, (code, message) => {
            reject(message);
        }, {
                account,
                option
            });
    });
}
/**
 * 获取登录码
 * @param {*} account 
 * @param {*} type 
 */
export function validateLoginPromise(key, value) {
    const params = {
        account: '', mobile: '', picCode: ''
    };
    params[key] = value;
    return new Promise((resolve, reject) => {
        HttpTool.request(HttpTool.typeEnum.POST, "/bm/memberapi/v1.1/verifyInfo", (code, message, json, option) => {
            resolve(message);
        }, (code, message) => {
            reject(message);
        }, params);
    });
}

export function defaultLoginPromise(callback) {
    getLoginCodePromise(defaultAccount, 0).then((data) =>
        loginPromise(defaultAccount, defaultPwd, data)
    ).then((data) => {
        data.Authorization = data.accessToken;
        CookieHelp.saveUserInfo(data);
        if (callback && typeof (callback) === 'function') callback();
    }).catch((error) => {
        log(error);
    });
}
