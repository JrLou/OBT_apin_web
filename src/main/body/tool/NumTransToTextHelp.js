/**
 * Created by apin on 2017/11/7.
 */
let NumTransToTextHelp = {
    getValue(num){
        if (!num){
            return "零";
        }
        let upperCaseNumber = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '亿'];
        let length = num.toString().length;

        log(length);
        log("--------");

        num = parseInt(num);

        if (length == 1) {
            return upperCaseNumber[num];
        } else if (length == 2) {
            if (num == 10) {
                return upperCaseNumber[num];
            } else if (num > 10 && num < 20) {
                return '十' + upperCaseNumber[num.toString().charAt(1)];
            } else {
                return upperCaseNumber[num.toString().charAt(0)] + '十' + upperCaseNumber[num.toString().charAt(1)].replace('零', '');
            }
        }else {
            return "一百";
        }
    }
};
module.exports = NumTransToTextHelp;