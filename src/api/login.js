import request from '@/utils/request';
export default {
    //登陆
    guestLogin(params) {
        return request.post('/JnsXh/Guest/login', params);
    },
    //手机号验证
    checkUserPhone(params) {
        return request.post('/JnsXh/Guest/checkPhone', params);
    },
    // 重置密码
    updatePassword(params) {
        return request.post('/JnsXh/Guest/updatePassword', params);
    },
    //发送短信验证码
    findPassword(params) {
        return request.post('/JnsXh/Guest/findPassword', params);
    },
    //短信验证码验证接口
    checkCaptcha(params) {
        return request.post('/JnsXh/Guest/checkCaptcha', params);
    }
};
