/*
 * @Description: 捕车_java接口统一请求处理
 * @Author: xwq
 * @Date: 2019-06-19 09:58:35
 */
import axios from 'axios';
import Qs from 'qs';

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_API_BCJAVA_URL, // api 的 base_url
    timeout: 5000, // request timeout
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    // 拦截处理请求数据
    transformRequest: [function (data) {
        data = Qs.stringify(data);
        return data;
    }],
});

// request interceptor
service.interceptors.request.use(
    config => {
        // Do something before request is sent
        // if (store.getters.token) {
        //   // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
        //   config.headers['X-Token'] = getToken()
        // 统一请求都有token
        if (config.data === undefined) {
            config.data = {};
        }
        return config;
    },
    error => {
        // Do something with request error
        // console.log(error) // for debug
        return Promise.reject(error).catch(reason => {
            return reason;
        });
    }
);

// response interceptor
service.interceptors.response.use(
    //   response => response,
    /**
     * 请求code不为0即为请求失败，直接弹出接口返回error信息即可。
     */
    response => {
        const res = response.data;
        if (res.retCode !== '0') {
            return Promise.reject(res).catch(reason => {
                return reason;
            });
        } else {
            return res;
        }
    },
    error => {
        // console.log('err' + error) // for debug
        return Promise.reject(error).catch(reason => {
            return reason;
        });
    }
);

export default service;