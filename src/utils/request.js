import axios from 'axios';
import Qs from 'qs';
import { Message } from 'element-ui';
import {
    remove,
    get
} from '@/utils/storage';

const service = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [function (data) {
        data = Qs.stringify(data);
        return data;
    }],
});

const responseCode = {
    40500(msg) {
        Message.error({
            message: msg,
            duration: 1000
        })
    },
    40300(msg) {
        Message.error({
            message: msg,
            duration: 1000
        })
    },
    40600(msg) {
        Message.error({
            message: msg,
            duration: 1000
        })
    },
    40100(msg) {
        Message.error({
            message: msg,
            duration: 1000
        })
        setTimeout(() => {
            remove('token');

        }, 1000);
    },
    40400(msg) {
        Message.error({
            message: msg,
            duration: 1000
        })
    },
    40000() {
        return true;
    },
    50000() {
        Message.error({
            message: '系统繁忙，请稍后再试',
            duration: 1000
        })
        return true;
    }
};

service.interceptors.request.use(
    config => {
        if (config.data === undefined) {
            config.data = {};
        }
        if (get('userInfo')) {
            config.data.token = get('userInfo').token;
        }
        return config;
    },
    error => {
        return Promise.reject(error).catch(reason => {
            return reason;
        });
    }
);
service.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.code !== 20000) {
            if (responseCode[res.code]) {
                responseCode[res.code](res.msg);
            }
            return Promise.reject(res).catch(reason => {
                return reason;
            });
        } else {
            return res;
        }
    },
    error => {
        Message.error({
            message: error.message,
            duration: 1000
        })
        return Promise.reject(error).catch(reason => {
            return reason;
        });
    }
);

export default service;