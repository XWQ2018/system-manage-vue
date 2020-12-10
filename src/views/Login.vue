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
                            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                        </el-input>
                    </el-form-item>
                    <div class="login-btn">
                        <el-button type="primary" @click="submitForm">登录</el-button>
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
                            @keyup.enter.native="submitForm1()"
                        >
                            <el-button v-if="!slotLabel" slot="append" @click="getViriCode">获取验证码</el-button>
                            <el-button v-if="slotLabel" :style="{ color: '#66B1FF' }" slot="append"
                                >{{ countDownTime }}后重发</el-button
                            >
                        </el-input>
                    </el-form-item>
                    <div class="login-btn">
                        <el-button type="primary" @click="submitForm1">提交</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import loginApi from "@/api/login";
import { formValidate } from "@/utils/common.js";
export default {
    data: function() {
        let validatePhone = (rule, value, callback) => {
            if (!formValidate("phone", value)) {
                callback(new Error("手机号格式不正确"));
            } else {
                callback();
            }
        };
        // let validateVerifycode = (rule, value, callback) => {
        //     if (!formValidate("phone", value)) {
        //         callback(new Error("手机号格式正确"));
        //     } else {
        //         callback();
        //     }
        // };
        return {
            active: 1,
            param: {
                username: "admin",
                password: "123123",
            },
            param1: {
                userphone: "",
                verifycode: "",
            },
            rules: {
                username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
                password: [{ required: true, message: "请输入密码", trigger: "blur" }],
            },
            rules1: {
                userphone: [
                    { required: true, message: "请输入手机号", trigger: "blur" },
                    { min: 11, max: 11, message: "请输入正确的手机号", trigger: "blur" },
                    { validator: validatePhone, trigger: "blur" },
                ],
                verifycode: [
                    { required: true, message: "请输入验证码", trigger: "blur" },
                    { min: 6, max: 6, message: "请输入正确的验证码", trigger: "blur" },
                    // { validator: validateVerifycode, trigger: "blur" },
                ],
            },
            status: false,
            slotLabel: false,
            countDownTime: null,
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate((valid) => {
                if (valid) {
                    this.$message.success("登录成功");
                    localStorage.setItem("ms_username", this.param.username);
                    this.$router.push("/");
                } else {
                    this.$message.error("请输入账号和密码");
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        getViriCode() {
            if (this.status) {
                loginApi.findPassword({ phone: this.param1.userphone }).then((res) => {
                    if (res.code == 20000) {
                        console.log("findPassword===", res);
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
        submitForm1() {
            this.$refs.forget.validate((valid) => {
                if (valid) {
                    console.log(555);
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
    font-size: 12px;
    line-height: 30px;
    color: #fff;
    text-align: center;
    cursor: pointer;
}
</style>
