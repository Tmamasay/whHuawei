<template>
  <div class="login-container" :style="{backgroundImage:'url('+bgImg+')'}">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
      :style="{backgroundImage:'url('+loginImg+')'}"
    >
      <el-row>
        <el-col :span="12">
          <div class="login-text-warpper">
            <p class="login-text-des">{{textTips}}</p>
            <p class="login-text-author">—— {{textName}}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="login-form-warpper">
            <h3 class="login-form-title">{{ $t('login.title') }}</h3>
            <el-form-item prop="username" class="ele-form-item">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.username"
                :placeholder="$t('login.username')"
                name="username"
                type="text"
                auto-complete="on"
              />
            </el-form-item>

            <el-form-item prop="password" class="ele-form-item">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                :placeholder="$t('login.password')"
                name="password"
                auto-complete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin('loginForm')"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
            <p class="login-form-forgetP" @click="visible = true">忘记密码？</p>
            <el-button
              type="primary"
              round
              style="width:100%;line-height: 20px;margin-top: 40px;"
              @click.native.prevent="handleLogin('loginForm')"
            >{{ $t('login.logIn') }}</el-button>
            <p class="login-bottom-text">background management system</p>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog title="找回密码" :visible.sync="visible" :close-on-click-modal="false" width="445px">
      <el-form ref="forgetForm" size="medium" :model="forgetForm" :rules="setNewRules">
        <el-form-item prop="phone">
          <el-input
            v-model="forgetForm.phone"
            maxlength="11"
            autocomplete="off"
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="forgetForm.code"
            maxlength="6"
            autocomplete="off"
            placeholder="请填写验证码"
            style="width:260px;"
          />
          <el-button
            :disabled="canClick"
            size="medium"
            style="float:right;display:inline;"
            @click="getCode"
          >{{ content }}</el-button>
        </el-form-item>
        <el-form-item prop="newPwd" v-if="flag">
          <el-input
            v-model="forgetForm.newPwd"
            maxlength="20"
            autocomplete="off"
            placeholder="请输入新密码"
            type="password"
          />
        </el-form-item>
        <el-form-item prop="newPassworld" v-if="flag">
          <el-input
            v-model="forgetForm.newPassworld"
            maxlength="20"
            autocomplete="off"
            placeholder="请输入确认密码"
            type="password"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="visible = false">取 消</el-button>
        <el-button type="primary" size="medium" @click.native="findSubmit('forgetForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import login_bg from "@/assets/logim/login_bg.jpg";
import login_img from "@/assets/logim/login_cover.png";
import { loginMD5 } from "@/utils/index";
import { updatePwd, getPhoneCode, findPwd } from "@/api/user";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    const validatePassword2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.forgetForm.newPwd) {
        callback(new Error("新密码和确认密码不一致"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      const reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
      const ss = reg.test(value);
      if (!value) {
        callback(new Error("请输入手机号码"));
      } else if (!ss) {
        callback(new Error("手机号码格式错误"));
      } else {
        callback();
      }
    };
    return {
      bgImg: login_bg,
      loginImg: login_img,
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      setNewRules: {
        phone: [{ required: true, trigger: "blur", validator: validatePhone }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        newPassworld: [
          { required: true, trigger: "blur", validator: validatePassword2 }
        ],
        newPwd: [{ required: true, message: "请输入新密码", trigger: "blur" }]
      },
      forgetForm: {
        phone: "",
        code: "",
        newPwd: "",
        newPassworld: ""
      },
      clock: "", //定时器
      visible: false, //找回密码
      flag: false, //找回密码
      passwordType: "password",
      capsTooltip: false,
      redirect: undefined,
      canClick: false, // 添加canClick,
      content: "发送验证码", // 按钮里显示的内容
      totalTime: 60, // 记录具体倒计时时间
      textArray: [
        { content: "三更灯火五更鸡，正是男儿读书时。", name: "颜真卿" },
        {
          content:
            "这个世界属于有天赋的人，也属于认真的人，更属于那些在有天赋的领域认真钻研的人。",
          name: "八月长安"
        },
        { content: "闲门向山路，深柳读书堂。", name: "刘昚虚" },
        { content: "旧书不厌百回读，熟读深思子自知。", name: "苏轼" },
        { content: "读书破万卷，下笔如有神。", name: "杜甫" },
        { content: "书山有路勤为径,学海无涯苦作舟。", name: "韩愈" },
        {
          content: "可能我只是你生命里的一个过客，但你不会遇见第二个我。",
          name: "安东尼"
        },
        { content: "外物之味，久则可厌，读书之味，愈久愈深。", name: "程颢" },
        {
          content:
            "既然我已经踏上这条道路，那么，任何东西都不应妨碍我沿着这条路走下去。",
          name: "唐德"
        }
      ], //登录随机题词
      textTips: "旧书不厌百回读，熟读深思子自知",
      textName: "苏轼"
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    console.log("============版本号：V2.0.10=============>");
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
    let _this = this;
    document.onkeydown = function(e) {
      e = e || window.event;
      if (e.keyCode == 13) {
        _this.handleLogin("loginForm");
      }
    };
    var index = Math.floor(Math.random() * this.textArray.length);
    this.textTips = this.textArray[index].content;
    this.textName = this.textArray[index].name;
  },
  methods: {
    countDown() {
      if (!this.canClick) return; // 改动的是这两行代码
      this.content = this.totalTime + "s后重新发送";
      this.clock = window.setInterval(() => {
        this.totalTime--;
        this.content = this.totalTime + "s后重新发送";
        if (this.totalTime < 0) {
          window.clearInterval(this.clock);
          this.content = "重新发送验证码";
          this.totalTime = 60;
          this.canClick = false; // 这里重新开启
        }
      }, 1000);
    },
    getCode() {
      let phone = this.forgetForm.phone;
      var reg = new RegExp(/^1(3|4|5|7|8|9)\d{9}$/);
      if (!phone) {
        return this.$message.info("请输入手机号");
      }
      if (!reg.test(phone)) {
        return this.$message.info("手机号码格式错误！");
      }
      this.canClick = true;
      const _params = {
        phone: phone
      };
      getPhoneCode(_params).then(res => {
        if (+res.code === 1) {
          this.$message.success("验证码发送成功");
          this.countDown();
          this.flag = true; //成功以后显示密码
        } else if (+res.code === -1) {
          this.canClick = false;
        }
      });
    },
    // 找回密码提交
    findSubmit(forgetForm) {
      this.$refs.forgetForm.validate(valid => {
        if (valid) {
          let params = {
            phone: this.forgetForm.phone,
            code: this.forgetForm.code,
            newPwd: loginMD5(this.forgetForm.newPwd)
          };
          findPwd(params).then(res => {
            if (+res.code === 1) {
              this.$message.success("密码找回成功，请重新登录");
              this.claerForgetForm(); //清楚表单
              this.visible = false;
              this.flag = false; //隐藏密码
              window.clearInterval(this.clock); //关闭定时器
            }
          });
        }
      });
    },
    claerForgetForm() {
      this.forgetForm.phone = "";
      this.forgetForm.code = "";
      this.forgetForm.newPwd = "";
      this.forgetForm.newPassworld = "";
      this.content = "重新发送验证码";
      this.totalTime = 60;
      this.canClick = false;
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= "a" && key <= "z") ||
          (!shiftKey && key >= "A" && key <= "Z")
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin(loginForm) {
      this.$refs[loginForm].validate(valid => {
        if (valid) {
          let params = {
            username: this.loginForm.username,
            password: loginMD5(this.loginForm.password)
          };
          this.$store
            .dispatch("user/login", params)
            .then(res => {
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loginForm.password = "";
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
$bg: #fff;
$cursor: #000;
$dark_gray: #889aa4;
$light_gray: #000;

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  .login-form {
    position: absolute;
    width: 800px;
    height: 494px;
    /*background-image: url("@/assets/logim/login_cover.png");*/
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .login-text-warpper {
      margin: 180px 40px 0 40px;
      color: #fff;
      /*.login-text-eng {
        font-size: 28px;
        font-weight: bold;
        position: relative;
        margin-top: 0;
        padding-bottom: 15px;
        margin-bottom: 40px;
      }*/
      .login-text-eng::before {
        content: "";
        position: absolute;
        border-bottom: 2px solid #ddd;
        width: 32px;
        bottom: 0;
        left: 0;
      }
      .login-text-des {
        font-size: 20px;
        margin-top: 0;
        margin-bottom: 40px;
        line-height: 30px;
        text-align: justify;
        font-weight: bold;
        letter-spacing: 1px;
      }
      .login-text-author {
        text-align: right;
        font-size: 20px;
      }
    }
    .login-form-warpper {
      margin: 70px 60px;
      .login-form-title {
        font-size: 14px;
        color: #333333;
        position: relative;
        padding-left: 12px;
        margin: 0 0 50px;
      }
      .login-form-title::before {
        content: "";
        position: absolute;
        left: 0;
        background: #337ff0;
        width: 3px;
        height: 14px;
        top: 1px;
        border-radius: 2px;
      }
      .login-form-forgetP {
        color: #337ff0;
        float: right;
        cursor: pointer;
        margin-top: -10px;
        font-size: 12px;
      }
      .login-bottom-text {
        margin-bottom: 0;
        margin-top: 90px;
        font-size: 14px;
        text-align: center;
        color: #b8b8b8;
      }
      .ele-form-item {
        border-bottom: 1px solid #dbdbdb;
        background: transparent;
        input {
          background: transparent;
          border: 0px !important;
          -webkit-appearance: none;
          border-radius: 0px;
          color: $light_gray;
          height: 47px;
          caret-color: $cursor;
          &:-webkit-autofill {
            box-shadow: 0 0 0px 1000px $bg inset !important;
            -webkit-text-fill-color: $cursor !important;
          }
        }
        .el-input__inner {
          padding: 12px 5px 12px 40px;
        }
        .show-pwd {
          position: absolute;
          right: 10px;
          font-size: 16px;
          color: $dark_gray;
          cursor: pointer;
          user-select: none;
          top: 50%;
          transform: translate(0, -50%);
        }
        .svg-container {
          position: absolute;
          left: 0px;
          z-index: 99;
          width: 40px;
          text-align: center;
          color: #c7c7c7;
          top: 50%;
          transform: translate(-10%, -50%);
        }
      }
    }
  }
}
</style>
