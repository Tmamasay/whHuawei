<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <!-- <el-button class="waihu" type="primary" @click="boda_pop"> <svg-icon style="" icon-class="waihu" />&nbsp;呼叫</el-button> -->
      <!-- <el-button class="waihu" type="primary"> <svg-icon style="" icon-class="waihu" />&nbsp;呼叫</el-button> -->

      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="'@/assets/avatar/PITAO-'+Math.floor(Math.random()*15+1)+'.png'" class="user-avatar"> -->
          <img :src="getImgUrl()" class="user-avatar" style="margin-top:6px">
          <!-- <svg-icon style="width:45px;height:45px" icon-class="touxiang" /> -->
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/cxLrs/admin/homePage">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="xgmm_pop">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 外呼 -->
    <el-dialog
      title="拨打的电话号码"
      :visible.sync="dialogVisible_wh"
      :close-on-click-modal="false"
      width="30%"
      @closed="handleClose_wh"
    >
      <el-form ref="whData" :label-position="labelPosition" label-width="140px" :model="whData" :rules="ruleswh" @submit.native.prevent>
        <!-- <el-form-item label="企业微信绑定电话" prop="qyTell">
          <el-input v-model.number="whData.qyTell" placeholder="请输入企业微信绑定电话" />
        </el-form-item> -->
        <el-form-item label="拨打的电话号码" prop="tell">
          <el-input v-model="whData.tell" placeholder="拨打的电话号码" @keyup.enter.native="boda('whData')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quxiao_wh('whData')">取 消</el-button>
        <el-button type="primary" @click="boda('whData')">确 定</el-button>
        <!-- <el-button type="primary">确 定</el-button> -->
      </div>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible_xgmm"
      :close-on-click-modal="false"
      width="30%"
      @closed="handleClose_wh"
    >
      <el-form ref="xgmmData" :label-position="labelPosition" label-width="80px" :model="xgmmData" :rules="rulesmm">
        <!-- <el-form-item label="企业微信绑定电话" prop="qyTell">
          <el-input v-model.number="whData.qyTell" placeholder="请输入企业微信绑定电话" />
        </el-form-item> -->
        <el-form-item label="原密码" prop="oldmm">
          <el-input v-model.number="xgmmData.oldmm" type="password" placeholder="请输入原密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newmm">
          <el-input v-model.number="xgmmData.newmm" type="password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="newmm1">
          <el-input v-model.number="xgmmData.newmm1" type="password" placeholder="再次确认新密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quxiao_mm('xgmmData')">取 消</el-button>
        <el-button type="primary" @click="xgmm_submit('xgmmData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { removeToken, removeRefreshToken, getisOpen, setisOpen, removeInfo, getcustomerId, removecustomerId } from '@/utils/auth'
import { callInside, updatePassword } from '@/api/framework'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      dialogVisible_wh: false,
      dialogVisible_xgmm: false,
      /* 外呼*/
      whData: {
        id: '',
        tell: ''
      },
      xgmmData: {
        oldmm: '',
        newmm: '',
        newmm1: ''
      },
      ruleswh: {
        tell: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          // { type: 'number', message: '电话号码必须为数字' },
          {
            pattern: /^(1[0-9]\d{9}|^(0[0-9]{2,3})([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/,
            message: '手机号格式不对',
            trigger: 'blur'
          }
        ]
      },
      rulesmm: {
        oldmm: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newmm: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        newmm1: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' }
        ]
      },
      labelPosition: 'center' // 对齐方式
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  mounted() {
    if (!getisOpen()) {
      // this.open()
    }
  },
  methods: {

    getImgUrl(icon) {
      return require(`@/assets/avatar/PITAO-${Math.floor(Math.random() * 15 + 1)}.png`)
    },
    open() {
      this.$alert('尊敬的客户，您好:<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为保障回头客呼叫平台为广大客户提供更加优质的服务，系统对通话线路进行了升级。升级后由原先的0971号段统一切换为028号段，呼叫后请注意接听，避免对坐席造成影响。如有问题请及时联系客服，回头客祝您生活愉快。', '温馨提示', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true,
        center: false,
        callback: action => {
          setisOpen(true)
          // this.$message({
          //   type: 'info',
          //   message: `action: ${action}`
          // })
        }
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      var _this = this
      await _this.$store.dispatch('user/logout').then(res => {
        if (res.data) {
          removeToken()
          removeRefreshToken()
          removeInfo()
          if (_this.$route !== '/cxLrs/admin/homePage') {
            console.log('cheng的憨憨=========================》')
            _this.$router.push('/cxLrs/admin/homePage')
            // this.activeMenu()
          }
          removecustomerId()
          localStorage.removeItem('buttons')
          _this.$store.dispatch('permission/fangfa')
          console.log(_this.$store.getters.router)
          _this.$router.push(`/login?redirect=${_this.$route.fullPath}`)
          console.log('我执行到这里来了')
        }
      })
    },
    // 外呼弹出框
    boda_pop(e) {
      console.log(e)
      const _this = this
      _this.dialogVisible_wh = true
      _this.whData.id = e.id
    },
    // 外呼拨打电话
    async boda(formName) {
      const _this = this
      await _this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = {
            param: {
              callPhone: _this.whData.tell
              // userId: _this.whData.id
            }
          }
          callInside(data).then(res => {
            console.log(res)
            if (res.statusCode === '00000') {
              _this.$message({ message: '拨打成功', type: 'success' })
              _this.dialogVisible_wh = false
            }
            debugger
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改密码弹出框
    xgmm_pop() {
      this.xgmmData = {
        oldmm: '',
        newmm: '',
        newmm1: ''
      }
      this.dialogVisible_xgmm = true
    },
    // 确定修改密码
    xgmm_submit(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.xgmmData.newmm1 !== _this.xgmmData.newmm) {
            _this.$message({ message: '两次输入的新密码不一致', type: 'warning' })
            return
          }
          var data = {
            param: {
              customerId: getcustomerId(),
              oldPassword: _this.xgmmData.oldmm,
              newPassword: _this.xgmmData.newmm
            }
          }
          updatePassword(data).then(res => {
            if (res.statusCode === '00000') {
              console.log(res)
              _this.$message({ message: '修改成功，请重新登录', type: 'success' })
              setTimeout(res => {
                _this.logout()
              }, 2000)
              // _this.$message({ message: '拨打成功', type: 'success' })
              // _this.dialogVisible_wh = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 关闭弹窗清楚验证-外呼
    handleClose_wh() {
      this.$refs.whData.resetFields()
    },
    // 清除表单验证-外呼
    quxiao_wh(formName) {
      this.dialogVisible_wh = false
      this.$refs[formName].clearValidate()
    },
    quxiao_mm(formName) {
      this.dialogVisible_xgmm = false
      this.$refs[formName].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
.waihu{
  padding: 8px 12px !important;
  position: relative;
  top:-15px;
  margin-right:50px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 2px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;

        }
      }
    }
  }
}
</style>
