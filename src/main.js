import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './utils/i18n';
import {
    get
} from '@/utils/storage.js';

import './assets/css/icon.css';
import './utils/directives';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, { size: 'small', zIndex: 2000 });


Vue.use(VueI18n);
const i18n = new VueI18n({
    locale: 'zh',
    messages
});


Vue.config.productionTip = false;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = '后台管理系统';
    const token = get('userInfo') ? get('userInfo').token : '';
    if (!token && to.path !== '/login') {
        next('/login');
    }
    else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});

new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
}).$mount('#app');
