/*
 * @Description: 缓存方法
 * @Author: xwq
 * @Date: 2020-12-10 10:22:33
 */

export function get(key) {
    if (!key || typeof key != 'string') return;
    let ExTest = /^[\{||\[/]/;
    if (ExTest.test(localStorage.getItem(key))) {
        return JSON.parse(localStorage.getItem(key));
    } else {
        return localStorage.getItem(key);
    }

}

export function set(key, data) {
    if (!key || typeof key != 'string') return;
    let dataInfo = '';
    if (typeof data == 'object') {
        dataInfo = JSON.stringify(data);
    } else {
        dataInfo = data ? data : '';
    }
    localStorage.setItem(key, dataInfo);
}

export function remove(key) {
    if (!key || typeof key != 'string') return;
    localStorage.removeItem(key);
}
