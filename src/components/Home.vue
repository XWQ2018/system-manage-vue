<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar :menuItems="menuItems"></v-sidebar>
        <div class="content-box" :class="{ 'content-collapse': collapse }">
            <v-tags></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
                <el-backtop target=".content"></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
import vHead from "./Header.vue";
import vSidebar from "./Sidebar.vue";
import vTags from "./Tags.vue";
import bus from "@/utils/bus";
export default {
    data() {
        return {
            tagsList: [],
            collapse: false,
            menuItems: [
                {
                    icon: "el-icon-lx-home",
                    index: "dashboard",
                    title: "系统首页",
                },
                {
                    icon: "el-icon-lx-presentfill",
                    index: "table",
                    title: "基础表格",
                    subs: [
                        {
                            index: "form",
                            title: "测试二级",
                        },
                    ],
                },
                {
                    icon: "el-icon-lx-copy",
                    index: "tabs",
                    title: "系统消息",
                },
            ],
        };
    },
    components: {
        vHead,
        vSidebar,
        vTags,
    },
    created() {
        bus.$on("collapse-content", (msg) => {
            this.collapse = msg;
        });

        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on("tags", (msg) => {
            let arr = [];
            for (let i = 0, len = msg.length; i < len; i++) {
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        });
    },
};
</script>
