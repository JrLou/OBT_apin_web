/*
 * @Author: 钮宇豪 
 * @Date: 2017-11-24 17:24:51 
 * @Last Modified by: 钮宇豪
 * @Last Modified time: 2017-12-05 13:26:24
 */

let API = {
    tokens: "/uc/authapi/v2.0/tokens",
    codes: "/uc/authapi/v2.0/tokens/codes",
    verifyInfo: "/bm/memberapi/v1.1/verifyInfo",
    memberInfo: "/bm/memberapi/v1.1/memberInfo",
    modifyMemberInfo: "/bm/memberapi/v1.1/modifyMemberInfo",
    updatePassword: '/bm/memberapi/v1.1/users/updatePassword',
    resetPassword: '/bm/memberapi/v1.1/users/resetPassword',
    // resetPassword: '/uc/userapi/v1.1/users/id/sign',
    getSmsCode: '/bm/memberapi/v1.1/getSmsCode',
    addMember: '/bm/memberapi/v1.1/addMember',
    pointsList: '/bm/memberapi/v1.0/orders/pointsList'
};
module.exports = API;