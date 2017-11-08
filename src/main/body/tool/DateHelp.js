/**
 * Created by apin on 2017/11/7.
 */
let DateHelp = {
    getValue(str){
        if (!str){
            return "";
        }
        let timeArr = str.split(":");
        let totalText = "";
        if (timeArr[0]&&timeArr[0]>0){
            totalText = timeArr[0]+"小时";
        }
        if (timeArr[1]&&timeArr[1]>0){
            totalText = totalText + timeArr[1]+"分钟";
        }
        return totalText;
    }
};
module.exports = DateHelp;