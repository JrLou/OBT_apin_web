/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-08 13:36:12 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-11-29 14:29:40
 */
import {
    HttpTool,
    CookieHelp
} from '../../../../../lib/utils/index.js';
import md5 from 'md5';
import {
    message
} from 'antd';
import API from '../../../../api/APINYH';

// export const defaultAccount = 'b3619ef5dc944e4aad02acc7c83b220d';
// export const defaultPwd = '4b91884d9290981da047b4c85af35a39';
// export const appid = 'b3619ef5dc944e4aad02acc7c83b220d';
export const defaultAccount = '';
export const defaultPwd = '';
export const appid = 'b3619ef5dc944e4aad02acc7c83b220d';

/**
 * 登录
 * @param {*} account 
 * @param {*} password 
 * @param {*} code 
 */
export function loginPromise(account, password) {
    return new Promise((resolve, reject) => {
        HttpTool.request(HttpTool.typeEnum.GET, API.tokens, (code, message, json, option) => {
            if (json.accessToken) {
                json.Authorization = json.accessToken;
                // 保存登录token
                CookieHelp.saveUserInfo(json);
                resolve(json);
            } else {
                reject(message);
            }
        }, (code, message) => {
            reject(message);
        }, {
                account,
                signature: md5(account + password),
                appid
            });
    });
}

/**
 * 获取登录码
 * @param {*} account 
 */
export function getLoginCodePromise(account, type) {
    return new Promise((resolve, reject) => {
        HttpTool.request(HttpTool.typeEnum.GET, API.codes, (code, message, json, option) => {
            if (json) {
                resolve(json);
            } else {
                reject(message);
            }
        }, (code, message) => {
            reject(message);
        }, {
                account,
                appid,
                type
            });
    });
}
/**
 * 获取登录码
 * @param {*} account 
 * @param {*} type 
 */
export function validateLoginPromise(entry) {
    let params = {
        account: '',
        mobile: '',
        picCode: ''
    };
    params = Object.assign({}, params, entry);
    return new Promise((resolve, reject) => {
        HttpTool.request(HttpTool.typeEnum.POST, API.verifyInfo, (code, message, json, option) => {
            resolve(message);
        }, (code, message) => {
            reject(message);
        }, params);
    });
}

/**
 * 使用默认账号登录
 * @param {*} callback 
 */
// export function defaultLoginPromise(type, callback, failCallback, notSetCookiee) {
//     getLoginCodePromise(defaultAccount, type).then((data) =>
//         loginPromise(defaultAccount, defaultPwd, data)
//     ).then((data) => {
//         if (!notSetCookiee) {
//             data.Authorization = data.accessToken;
//             CookieHelp.saveUserInfo(data);
//         }
//         if (callback && typeof (callback) === 'function') callback();
//     }).catch((error) => {
//         if (failCallback && typeof (failCallback) === 'function') failCallback();
//     });
// }

/**
 * token不正确时跳转
 */
// export function refreshToken(code) {
//     // 未登录并且不在首页，则跳转到首页
//     if (code == -421 || code == -422 || code == -403 || code == -400) {
//         let pathname = window.location.pathname;
//         CookieHelp.clearCookie();
//         defaultLoginPromise(0, () => { // 获取默认token
//             if (pathname !== '/' && pathname !== '/Search') {
//                 window.app_open(this, '/', null, "self");
//             } else {
//                 window.location.reload();
//             }
    
//         });
//     }
// }

/**
 * 获取用户信息
 */

export function AccoutInfoPromise(callback) {
    return new Promise((resolve, reject) => {
        document.getElementsByTagName('body')[0].style.display = "none";
        HttpTool.request(HttpTool.typeEnum.POST, API.memberInfo, (code, message, json, option) => {
            CookieHelp.saveCookieInfo("phone", json.mobile);
            document.getElementsByTagName('body')[0].style.display = "block";
            if (window.fundebug && window.fundebug.user) {
                window.fundebug.user = {
                    name: json.account,
                    email: json.email
                };
            }
            resolve({
                json,
                option
            });
        }, (code, message) => {
            reject(message);
        }, {});
    });
}