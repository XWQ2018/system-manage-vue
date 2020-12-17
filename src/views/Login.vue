<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div v-if="active === 0">
                <div class="ms-title">登陆管理系统</div>
                <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                    <el-form-item prop="username">
                        <el-input v-model="param.username" placeholder="username">
                            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input
                            type="password"
                            placeholder="password"
                            v-model="param.password"
                            @keyup.enter.native="submitForm()"
                        >
                            <!-- <el-button slot="prepend" icon="el-icon-lx-lock"></el-button> -->
                            <el-button slot="prepend" icon="el-icon-lock"></el-button>
                        </el-input>
                    </el-form-item>
                    <div class="login-btn">
                        <el-button type="primary" @click="submitForm" style="font-size:18px">登陆</el-button>
                    </div>
                    <p class="login-tips" @click="active = 1">忘记密码</p>
                </el-form>
            </div>
            <div v-if="active === 1">
                <div class="ms-title">忘记密码</div>
                <el-form :model="param1" :rules="rules1" ref="forget" label-width="0px" class="ms-content">
                    <el-form-item prop="userphone">
                        <el-input
                            v-model="param1.userphone"
                            :maxlength="11"
                            placeholder="请输入手机号"
                            @input="checkPhone"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="verifycode">
                        <el-input
                            placeholder="请输入验证码"
                            :maxlength="6"
                            v-model="param1.verifycode"
                            @keyup.enter.native="forgetPwSubmit()"
                        >
                            <el-button v-if="!slotLabel" slot="append" @click="getViriCode">获取验证码</el-button>
                            <el-button v-if="slotLabel" :style="{ color: '#66B1FF' }" slot="append"
                                >{{ countDownTime }}后重发</el-button
                            >
                        </el-input>
                    </el-form-item>
                    <div class="login-btn">
                        <el-button type="primary" @click="forgetPwSubmit" style="font-size:18px">提交</el-button>
                    </div>
                </el-form>
            </div>
            <div v-if="active === 2">
                <div class="ms-title">重置密码</div>
                <el-form :model="resetPw" :rules="rules2" ref="reset" label-width="0px" class="ms-content">
                    <el-form-item prop="pw1">
                        <el-input
                            type="password"
                            v-model="resetPw.pw1"
                            :minlength="8"
                            :maxlength="16"
                            placeholder="请输入新密码"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="pw2">
                        <el-input
                            type="password"
                            v-model="resetPw.pw2"
                            :minlength="8"
                            :maxlength="16"
                            placeholder="再次输入密码"
                        >
                        </el-input>
                    </el-form-item>
                    <div class="login-btn">
                        <el-button type="primary" @click="handlerResetPw" style="font-size:18px">提交</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import loginApi from "@/api/login";
import { formValidate } from "@/utils/common.js";
import { set } from "@/utils/storage";
export default {
    data: function() {
        let validatePhone = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入手机号"));
            } else if (!formValidate("phone", value)) {
                callback(new Error("手机号格式不正确"));
            } else {
                callback();
            }
        };
        let validateResetPw = (rule, value, callback) => {
            if (value == "") {
                callback(new Error("请输入密码"));
            } else if (value.length < 8 || value.length > 16) {
                callback(new Error("密码长度规则是8~16位"));
            } else {
                callback();
            }
        };
        let validateResetCheckPw = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value.length < 8 || value.length > 16) {
                callback(new Error("密码长度规则是8~16位"));
            } else if (value != this.resetPw.pw1) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            active: 0,
            param: {
                username: "",
                password: "",
            },
            param1: {
                userphone: "",
                verifycode: "",
            },
            resetPw: {
                pw1: "",
                pw2: "",
            },
            rules: {
                username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
                password: [{ required: true, message: "请输入密码", trigger: "blur" }],
            },
            rules1: {
                userphone: [{ validator: validatePhone, trigger: "blur" }],
                verifycode: [
                    { required: true, message: "请输入验证码", trigger: "blur" },
                    { min: 6, max: 6, message: "请输入正确的验证码", trigger: "blur" },
                ],
            },
            rules2: {
                pw1: [{ validator: validateResetPw, trigger: "blur" }],
                pw2: [{ validator: validateResetCheckPw, trigger: "blur" }],
            },
            status: false,
            slotLabel: false,
            countDownTime: null,
            udpToken: null,
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate((valid) => {
                if (valid) {
                    let params = {
                        username: this.param.username,
                        password: this.param.password,
                    };
                    loginApi.guestLogin(params).then((res) => {
                        if (res.code == 20000) {
                            console.log(res);
                            this.$message.success("登录成功");
                            set("userInfo", res.data);
                            setTimeout(() => {
                                this.$router.push("/");
                            }, 1500);
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                } else {
                    this.$message.error("请输入账号和密码");
                    return false;
                }
            });
        },
        /**
         * @Description: 获取验证码
         * @Param:
         * @Author: xwq
         * @Date: 2020-12-16 17:02:58
         * @LastEditors: xwq
         * @LastEditTime: Do not edit
         * @return {*}
         */
        getViriCode() {
            if (this.status) {
                loginApi.findPassword({ phone: this.param1.userphone }).then((res) => {
                    if (res.code == 20000) {
                        this.countDownHandle(61);
                        setTimeout(() => {
                            this.slotLabel = true;
                        }, 500);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            }
        },
        /**
         * @Description: 验证手机号
         * @Param:
         * @Author: xwq
         * @Date: 2020-12-16 17:02:48
         * @LastEditors: xwq
         * @LastEditTime: Do not edit
         * @return {*}
         * @param {*} e
         */
        checkPhone(e) {
            if (e.length === 11) {
                if (formValidate("phone", this.param1.userphone)) {
                    this.$refs.forget.clearValidate("userphone");
                    loginApi.checkUserPhone({ phone: this.param1.userphone }).then((res) => {
                        if (res.code == 20000) {
                            this.status = true;
                        } else {
                            this.status = false;
                            this.$message.error(res.msg);
                        }
                    });
                } else {
                    this.$refs.forget.validateField("userphone");
                }
            }
        },
        /**
         * @Description: 忘记密码提交
         * @Param:
         * @Author: xwq
         * @Date: 2020-12-16 17:02:16
         * @LastEditors: xwq
         * @LastEditTime: Do not edit
         * @return {*}
         */
        forgetPwSubmit() {
            this.$refs.forget.validate((valid) => {
                if (valid) {
                    let params = {
                        phone: this.param1.userphone,
                        captcha: this.param1.verifycode,
                    };
                    loginApi.checkCaptcha(params).then((res) => {
                        if (res.code == 20000) {
                            this.udpToken = res.data.udpToken;
                            this.active = 2;
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        /**
         * @Description: 重置密码提交
         * @Param:
         * @Author: xwq
         * @Date: 2020-12-16 17:02:36
         * @LastEditors: xwq
         * @LastEditTime: Do not edit
         * @return {*}
         */
        handlerResetPw() {
            console.log("重置密码", this.resetPw.pw1);
            this.$refs.reset.validate((valid) => {
                if (valid) {
                    console.log("重置密码");
                    let params = {
                        phone: this.param1.userphone,
                        password: this.resetPw.pw1,
                        udpToken: this.udpToken,
                    };
                    loginApi.updatePassword(params).then((res) => {
                        if (res.code == 20000) {
                            this.$message.success("密码重置成功");
                            setTimeout(() => {
                                this.active = 0;
                            }, 1500);
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        /**
         * @Description: 倒计时计算
         * @Param:
         * @Author: xwq
         * @LastEditors: xwq
         * @LastEditTime: Do not edit
         * @return:
         * @Date: 2019-07-26 15:55:08
         */
        countDownHandle(time) {
            let timer;
            let _this = this;
            clearInterval(timer);
            timer = setInterval(() => {
                time--;
                if (time === 0) {
                    window.clearInterval(timer);
                    _this.slotLabel = false;
                }
                _this.countDownTime = time + " " + "S";
            }, 1000);
            /* 监听组件销毁前，移除定时器 */
            this.$once("hook:beforeDestroy", () => {
                clearInterval(timer);
            });
        },
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background: url(../assets/img/login-bg-default.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    /* left: 70%; */
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    margin-top: -190px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 16px;
    line-height: 30px;
    color: #fff;
    text-align: center;
    cursor: pointer;
}
</style>
