<template>
  <div class="login-container" :style="{backgroundImage:'url('+bgImg+')'}">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left" :style="{backgroundImage:'url('+loginImg+')'}">
      <!-- <div class="title-container">
        <h3 class="title">呼叫平台</h3>
      </div> -->
      <!-- <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item> 
      <p class="forgetP" @click="forgetPwd">忘记密码？</p>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
      <div style="margin-top:-20px">
        <a style="color:#fff;font-size:8px;" href="https://www.google.cn/intl/zh-CN/chrome/" target="_blank">google浏览器下载</a>
        <span style="color:#fff;font-size:8px;margin-left:290px;cursor:pointer;" @click="open">联系客服</span>
      </div>-->
      <el-row>
        <el-col :span="12">
          <div class="login-text-warpper">
            <!-- <p class="login-text-des">{{textTips}}</p>
            <p class="login-text-author">—— {{textName}}</p> -->
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
    <el-dialog
      title="找回密码"
      :visible.sync="forgetDialogFormVisible"
      class="changeIn"
      :close-on-click-modal="false"
      style="width:840px;margin:0 auto;"
    >
      <el-form ref="forgetForm" class="wkmm" :model="forgetForm" :rules="loginRules3">
        <el-form-item label prop="phone" :label-width="formLabelWidth" style="width:100%;border: 1px solid rgba(255, 255, 255, 0.5)">
          <el-input v-model="forgetForm.phone" autocomplete="off" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label prop="newPw" :label-width="formLabelWidth" style="border: 1px solid rgba(255, 255, 255, 0.5)">
          <el-input v-model="forgetForm.newPw" type="password" autocomplete="off" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label prop="newPw1" :label-width="formLabelWidth" style="border: 1px solid rgba(255, 255, 255, 0.5)">
          <el-input v-model="forgetForm.newPw1" type="password" autocomplete="off" placeholder="请确认新密码" />
        </el-form-item>
        <el-form-item label prop="code" :label-width="formLabelWidth">
          <el-input
            v-model="forgetForm.code"
            autocomplete="off"
            placeholder="请填写验证码"
            class="yzm"
          />
          <el-button
            :disabled="canClick"
            style="float:right;display:inline;height: 47px;"
            @click="getCode"
          >{{ content }}</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="forgetDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="!canClick" @click.native="findSubmit">确 定</el-button>
      </div>

    </el-dialog>
    <div class="beian">版权所有© 重庆标网科技有限公司   ICP备案号：<a href="http://www.beian.miit.gov.cn/" target="_blank">渝ICP备20008292号-1</a></div>

  </div>

</template>

<script>
// import { validUsername } from '@/utils/validate'
import login_bg from "@/assets/login/login_bg.jpg";
import login_img from "@/assets/login/login_cover.png";
import { forgetToSend, forgetToUpdate } from '@/api/chengxu'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入用户名！'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入密码！'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      const reg = /^1[3|4|5|6|7|8|9]\d{9}$/
      const ss = reg.test(value)
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else if (!ss) {
        callback(new Error('手机号码格式错误'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入密码！'))
      } else {
        callback()
      }
    }
    var validatePass1 = (rule, value, callback) => {
      console.log(value)
      if (value.length < 1) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.forgetForm.newPw) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      bgImg: login_bg,
      loginImg: login_img,
      forgetDialogFormVisible: false,
      formLabelWidth: '2px',
      canClick: false, // 添加canClick,
      content: '发送验证码', // 按钮里显示的内容
      totalTime: 120, // 记录具体倒计时时间
      clock: null,
      resetCont: {},
      forgetForm: {
        phone: '',
        newPw: '',
        newPw1: '',
        code: ''
      },
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loginRules3: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        // code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        newPw: [{ required: true, trigger: 'blur', validator: validatePass }],
        newPw1: [{ required: true, trigger: 'blur', validator: validatePass1 }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
        console.log(route.query.redirect)
      },
      immediate: true
    }
  },
  methods: {
    open() {
      this.$alert('7*24小时客服电话：13647685297', '联系方式', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true,
        center: false,
        callback: action => {
        }
      })
    },
    countDown() {
      if (!this.canClick) return // 改动的是这两行代码
      // this.canClick = false
      this.content = this.totalTime + 's后重新发送'
      this.clock = window.setInterval(() => {
        this.totalTime--
        this.content = this.totalTime + 's后重新发送'
        if (this.totalTime < 0) {
          window.clearInterval(this.clock)
          this.content = '重新发送验证码'
          this.totalTime = 120
          this.canClick = false // 这里重新开启
        }
      }, 1000)
    },
    // 找回密码提交
    findSubmit() {
      this.$refs.forgetForm.validate(valid => {
        if (valid) {
          if (this.forgetForm.newPw !== this.forgetForm.newPw1) {
            this.$message({
              message: '两次输入的密码不一致',
              type: 'error',
              duration: 3 * 1000
            })
            return false
          }
          if (this.forgetForm.code.length !== 6) {
            this.$message({
              message: '请输入6位数验证码',
              type: 'error',
              duration: 3 * 1000
            })
            return false
          }

          if (!this.resetCont.flag) {
            this.$message({
              message: '用户不存在',
              type: 'error',
              duration: 3 * 1000
            })
            return false
          }
          const data = {
            param: {
              code: this.forgetForm.code,
              phone: this.forgetForm.phone,
              password: this.forgetForm.newPw,
              smsId: this.resetCont.smsId,
              username: this.loginForm.username

            }
          }
          forgetToUpdate(data).then(res => {
            if (res.statusCode === '00000') {
              this.$message({
                message: '密码重置成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.loginForm.password = ''
              this.forgetDialogFormVisible = false
            }
          })
        }
      })
    },
    getCode() {
      if (!this.loginForm.username) {
        this.$message({
          message: '请输入账号',
          type: 'warning',
          duration: 2 * 1000
        })
      }
      this.$refs.forgetForm.validate(valid => {
        if (valid) {
          this.canClick = true
          // debugger
          const _params = {
            param: {
              phone: this.forgetForm.phone,
              username: this.loginForm.username
            }
          }
          forgetToSend(_params).then(res => {
            debugger
            if (res.statusCode === '00000') {
              debugger
              this.resetCont = res.data
              this.$message({
                message: '验证码发送成功',
                type: 'success',
                duration: 2 * 1000
              })
              this.countDown()
            } else {
              this.canClick = false
            }
          })
        }
      })
    },
    forgetPwd() {
      if (!this.loginForm.username) {
        this.$message({
          message: '请输入用户名',
          type: 'warning',
          duration: 3 * 1000
        })
        return false
      }
      this.forgetDialogFormVisible = true
      this.forgetForm = {
        phone: '',
        newPw: '',
        newPw1: '',
        code: ''
      }
      this.canClick = false
      this.content = '发送验证码'
      this.totalTime = 120
      window.clearInterval(this.clock)
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          debugger
          console.log(valid)
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then((res) => {
            console.log(res)
            if (res.data.code === '403') {
              this.loading = false
              this.$message.error('登录失败，用户名或密码错误！')
            } else {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            }
          }).catch(err => {
            this.loading = false
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.wkmm input{
  display: block;
  width:100%;
  color:#aaa;
  -webkit-text-fill-color: #aaa !important;
  transition: background-color 5000s ease-in-out 0s;
}
/* reset element-ui css */
.login-container {
  .forgetP {
    color: #fff;
    float: right;
    cursor: pointer;
    margin-top: -10px;
  }

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
       height: 47px;
      // height: 10px !important;
      caret-color: $cursor;
      &:-webkit-autofill {
        -webkit-text-fill-color: #fff;
        transition: background-color 5000s ease-in-out 0s;
        //  box-shadow: 0 0 0px 1000px $bg inset !important;
        // -webkit-text-fill-color: $cursor !important;
      }
    }
    // input::-webkit-input-placeholder{/*Webkit browsers*/
    //   color:#fff;
    // }
    // input:-moz-placeholder{/*Mozilla Firefox 4 to 8*/
    //   color:#fff;
    // }
    // input::moz-placeholder{/*Mozilla Firefox 19+*/
    //   color:#fff;
    // }
    // input:-ms-input-placeholder{/*Internet Explorer 10+*/
    //   color:#fff;
    // }
  }

.changeIn {
    input {
      color: #000 !important;
      caret-color: #c4c8cf !important;
    }
    .el-input {
    border: 1px solid #DCDFE6 !important;
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.5) !important;
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
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
.wkmm .el-input{
  width:100%;
}
.yzm{
  width:60% !important;
}
.beian{
  color:#fff;
  text-align: center;
  font-size:14px;
  position:absolute;
  bottom:20px;
  left:38%;

}

</style>
