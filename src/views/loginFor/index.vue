<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <!-- <h3 class="title">呼叫平台</h3> -->
        <h3 class="title">登陆</h3>
      </div>
      <el-form-item prop="username">
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
      <div style="margin-top:-20px"><a style="color:#fff;font-size:8px;" href="https://www.google.cn/intl/zh-CN/chrome/" target="_blank">google浏览器下载</a></div>
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
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
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
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
   background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    // background: #304360;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.wkmm .el-input{
  width:100%;
}
.yzm{
  width:60% !important;
}
</style>
