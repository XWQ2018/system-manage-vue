/*
 * @Description: 工具类方法
 * @Author: xwq
 * @Date: 2020-12-10 11:42:54
 */

export function formValidate(type = null, val = null) {
    console.log('参数==', arguments);
    const ValidateType = {
        //手机号
        phone: (v) => {
            let regT = /^1[3456789]\d{9}$/;
            return (regT.test(v));
        },
        //邮箱
        email: (v) => {
            let regT = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return (regT.test(v));
        },
        //身份证
        Car: (v) => {
            let regT = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            return (regT.test(v));
        },
        //合法url
        URL: (v) => {
            let regT = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
            return (regT.test(v));
        },
    };
    if (!type || !val || typeof val != 'string') return;
    if (!ValidateType[type]) {
        throw new Error('This method was not found');
    }
    return (ValidateType[type](val));
}
