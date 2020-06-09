import request from '@/utils/request';
export default {
    // 获取未完成工单列表接口
    getMokeInfo(query) {
        return request({
            url: './table.json',
            method: 'get',
            params: query
        });
    }
};
