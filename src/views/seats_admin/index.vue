<template>
  <div class="hw_admin_box shaowAll">
    <div class="toolS">
      <el-button v-if="addZxishow" type="primary" style="margin-bottom:20px" @click="addZx">创建坐席</el-button>
      <el-form ref="filters" :inline="true" class="fixFrom">
        <el-form-item label="">
          <el-input v-model="query.name" placeholder="请输入坐席名称" style="height:34px" />
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="query.bindingPhone" placeholder="请输入坐席手机号" style="height:34px" />
        </el-form-item>
        <el-button type="primary" style="position:relative;top:4px" @click="search">搜索</el-button>
      </el-form>
    </div>
    <el-table
      ref="zxListData"
      v-loading="loading"
      :data="dataList"
      tooltip-effect="dark"
      style="width:95%;margin:10px auto 20px auto;"
      highlight-current-row
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="name"
        label="坐席名称"
      />
      <el-table-column
        prop="bindingPhone"
        label="坐席手机号"
      />
      <el-table-column
        prop="status"
        label="状态"
      >
        <template slot-scope="scope">
          {{ scope.row.status==="use"?"使用中":scope.row.status==="noChecking"?"未验证": '禁用' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
      >
        <template slot-scope="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        label="编辑"
      >
        <template slot-scope="scope">
          <el-button v-if="upZxishow" type="primary" @click="xiugaiZx(scope.row)">修改</el-button>
          <!-- <el-button type="primary" @click="boda_pop(scope.row)">外呼</el-button> -->
          <el-button v-if="removeZxishow" type="danger" @click="removeZX(scope.row)">删除</el-button>
          <el-button v-if="yzZxishow" type="primary" :disabled="scope.row.status==='use'?yzisclick=true:yzisclick=false" @click="newyzm(scope.row)">重新验证</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block fenye">
      <el-pagination
        :current-page="hwCurrent"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="hwSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-form v-if="dialogVisible" ref="addZxData" :label-position="labelPosition" label-width="100px" :model="addZxData" :rules="rulesZx">
        <el-form-item label="选择部门" prop="bumen">
          <el-cascader
            v-model="addZxData.bumen"
            :options="bumenData"
            :props="{ checkStrictly: true }"
            style="width:100%"
            placeholder="请选择部门"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="选择用户" prop="user">
          <el-select v-model="addZxData.user" placeholder="请选择用户" style="width:100%" @change="getUser1">
            <el-option
              v-for="item in userData"
              :key="item.uid"
              :label="item.name"
              :value="item.uid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="坐席名称" prop="name">
          <el-input v-model.number="addZxData.name" placeholder="请输入坐席名称" />
        </el-form-item>
        <el-form-item label="绑定电话" prop="tell" :required="true">
          <el-input v-model.number="addZxData.tell" placeholder="请输入绑定电话" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="zx_submit('addZxData')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 外呼 -->
    <el-dialog
      title="拨打的电话号码"
      :visible.sync="dialogVisible_wh"
      :close-on-click-modal="false"
      width="30%"
      @closed="handleClose_wh"
    >
      <el-form ref="whData" :label-position="labelPosition" label-width="140px" :model="whData" :rules="ruleswh">
        <!-- <el-form-item label="企业微信绑定电话" prop="qyTell">
          <el-input v-model.number="whData.qyTell" placeholder="请输入企业微信绑定电话" />
        </el-form-item> -->
        <el-form-item label="拨打的电话号码" prop="tell">
          <el-input v-model.number="whData.tell" placeholder="拨打的电话号码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quxiao_wh('whData')">取 消</el-button>
        <el-button type="primary" @click="boda('whData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartmentIdsByUid, resendVerifyCode, findPage, addSeat, delSeat, hwupdateSeat, callInside, getAllDepartment, getUsersByDepartment, cyvalidata } from '@/api/framework'
// import { getqxbutton } from '@/utils/auth'
import { getcustomerId } from '@/utils/auth'
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
      if (!value) {
        return callback(new Error('请输入电话!'))
      } else if (!reg.test(value)) {
        return callback(new Error('电话格式不正确!'))
      }
      var data = {
        param: {
          mobile: this.addZxData.tell
        }
      }
      console.log(data)
      cyvalidata(data).then(res => {
        console.log(res)
        if (res.statusCode === '00000') {
          callback()
        } else {
          return callback(new Error('电话重复，请重新输入!'))
        }
      })
    }
    return {
      query: {
        name: '',
        bindingPhone: ''
      },
      loading: false, // loading加载
      dataList: [], // 数据列表
      hwSize: 10, // 一页多少条
      hwCurrent: 1, // 页码
      total: 0, // 总数
      title: '', // 新增修改名称
      dialogVisible: false, // 弹出框
      labelPosition: 'center', // 对齐方式
      addZxData: {
        name: '',
        id: '',
        bumen: [],
        user: '',
        tell: '',
        noxgTell: '',
        uid: ''
      },
      rulesZx: {
        name: [
          { required: true, message: '请输入坐席名称', trigger: 'blur' }
        ],
        bumen: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        user: [
          { required: true, message: '请选择用户', trigger: 'change' }
        ],
        tell: [
          { validator: checkAge, trigger: 'blur' }
        ]
      },
      userData: [], // 选择用户
      bumenData: [], // 选择部门
      dialogVisible_wh: false, // 外呼拨打电话
      /* 外呼*/
      whData: {
        id: '',
        tell: ''
      },
      ruleswh: {
        tell: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { type: 'number', message: '电话号码必须为数字' },
          {
            pattern: /^1[0-9]\d{9}$/,
            message: '手机号格式不对',
            trigger: 'blur'
          }
        ]
      },
      buttons: [],
      addZxishow: false, // 新建坐席-权限
      upZxishow: false, // 修改坐席-权限
      removeZxishow: false, // 删除坐席-权限
      yzZxishow: false, // 重新验证
      yzisclick: false// 重新验证是否点击
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const arr = JSON.parse(localStorage.getItem('buttons'))
      vm.buttons = arr.filter(e => e.mid === to.meta.id)
      console.log(vm.buttons)
      vm.buttons.forEach(child => {
        child.buttons.forEach(res => {
          console.log(res)
          switch (res.powerCode) {
            case '/customerSeatManage/addSeat':
              vm.addZxishow = true
              break
            case '/customerSeatManage/updateSeat':
              vm.upZxishow = true
              break
            case '/customerSeatManage/delSeat':
              vm.removeZxishow = true
              break
            case '/customerSeatManage/resendVerifyCode':
              vm.yzZxishow = true
              break

            default:
              break
          }
        })
      })
    })
  },
  created() {

    // this.choiceBm()
  },
  mounted() {
    this.getlist()
    this.getmoreBumen()
    console.log(this.addZxishow)
    console.log(this.upZxishow)
    console.log(this.removeZxishow)
  },
  methods: {
    // 获取所有部门
    async getmoreBumen() {
      const _this = this
      var data = {
        param: {
          customerId: getcustomerId()
        }
      }
      await getAllDepartment(data).then(res => {
        if (res.statusCode === '00000') {
          var data = _this.forMartBm(res.data)
          _this.bumenData = data
          console.log('11111111111111')
          console.log(_this.bumenData)
        }
      })
    },
    async handleChange(value) {
      console.log(value)
      this.addZxData.user = ''
      var data = {
        param: {
          departmentId: value[value.length - 1]
        }
      }
      await getUsersByDepartment(data).then(res => {
        console.log(res)
        if (res.statusCode === '00000') {
          this.userData = res.data
        }
      })
    },

    // 数据格式化
    generateBm(item, isParent) {
      const itemCont = {
        value: item.id,
        label: item.name,
        pid: item.pid
      }
      return itemCont
    },
    forMartBm(data) {
      if (!data) return []
      const forMatList = []
      data.forEach(item => {
        const parent = this.generateBm(item, true)
        let children = null
        if (item.child.length) {
          children = this.forMartBm(item.child)
          // item.child.forEach(child => {
          //   children.push(this.generateBm(child, false))
          // })
        }
        parent.children = children
        forMatList.push(parent)
      })
      return forMatList
    },

    // 列表
    async getlist() {
      const _this = this
      _this.loading = true
      var data = {
        param: {
          bindingPhone: _this.query.bindingPhone,
          name: _this.query.name,
          current: _this.hwCurrent,
          size: _this.hwSize
        }
      }
      await findPage(data).then(res => {
        console.log(res)
        if (res.statusCode === '00000') {
          setTimeout(res => {
            _this.loading = false
          }, 300)
          _this.dataList = res.data.records
          _this.total = +res.data.total
        }
      })
    },
    // 创建坐席弹出框
    addZx() {
      const _this = this
      _this.addZxData = {
        name: '',
        id: '',
        bumen: '',
        user: '',
        tell: ''
      }
      _this.dialogVisible = true
      _this.title = '新增坐席'
    //   _this.choiceBm()
    },
    // 修改坐席弹出框
    xiugaiZx(row) {
      console.log(row)
      const _this = this

      _this.addZxData = {
        name: row.name,
        id: row.id,
        bumen: [],
        user: row.userId,
        tell: row.bindingPhone,
        noxgTell: row.bindingPhone,
        uid: row.userId
      }
      _this.title = '修改坐席'
      var data = {
        param: {
          userId: row.userId
        }
      }
      getDepartmentIdsByUid(data).then(res => {
        console.log(res)
        if (res.statusCode === '00000') {
          var arr = res.data
          _this.addZxData.bumen = arr
          _this.dialogVisible = true
          var data = {
            param: {
              departmentId: _this.addZxData.bumen[_this.addZxData.bumen.length - 1]
            }
          }
          getUsersByDepartment(data).then(res => {
            console.log(res)
            if (res.statusCode === '00000') {
              this.userData = res.data
            }
          })
        }
      })
    //   _this.choiceBm()
    },
    // 新增坐席、修改坐席提交
    async zx_submit(formName) {
      console.log(this.addZxData.user)
      console.log(this.addZxData)
      console.log('-0000000000000000000000000000000000')
      const _this = this
      await _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.title === '修改坐席') {
            if (_this.addZxData.noxgTell !== _this.addZxData.tell) { // 证明修改过手机号
              const data1 = {
                param: {
                  bindingPhone: _this.addZxData.tell,
                  id: _this.addZxData.id,
                  userId: _this.addZxData.uid,
                  name: _this.addZxData.name
                }
              }
              hwupdateSeat(data1).then(res => {
                if (res.statusCode === '00000') {
                  _this.$message({ message: '操作成功', type: 'success' })
                  _this.dialogVisible = false
                  _this.getlist()
                }
              })
            } else {
              const data1 = {
                param: {
                  bindingPhone: '',
                  id: _this.addZxData.id,
                  userId: _this.addZxData.uid,
                  name: _this.addZxData.name
                }
              }
              hwupdateSeat(data1).then(res => {
                if (res.statusCode === '00000') {
                  _this.$message({ message: '操作成功', type: 'success' })
                  _this.dialogVisible = false
                  _this.getlist()
                }
              })
            }
          } else {
            var data = {
              param: {
                bindingPhone: _this.addZxData.tell,
                name: _this.addZxData.name,
                userId: _this.addZxData.user// 用户id
              }
            }
            addSeat(data).then(res => {
              if (res.statusCode === '00000') {
                _this.$message({ message: '新增成功', type: 'success' })
                _this.dialogVisible = false
                _this.getlist()
              }
            }).catch(err => {
              _this.$message.error(err.message)
              console.log(err)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重新获取验证码
    async newyzm(e) {
      console.log(e)
      //  resendVerifyCode
      const _this = this
      var data = {
        param: {
          bindingPhone: e.bindingPhone,
          name: e.name,
          userId: e.userId// 用户id
        }
      }
      console.log(data)
      await resendVerifyCode(data).then(res => {
        if (res.statusCode === '00000') {
          _this.$message({ message: '重新发送成功', type: 'success' })
        }
      })
    },
    // 获取用户id和name
    getUser1(e) {
      console.log(e)
      var obj = {}
      obj = this.userData.find((item) => item.uid === e)
      console.log(obj)
      //   this.addZxData.name = obj.name
      // this.addZxData.id = obj.id
      this.addZxData.uid = obj.uid
    },
    // 删除坐席
    async removeZX(e) {
      const _this = this
      console.log(e)
      var data = {
        param: {
          id: e.id
        }
      }
      await _this.$confirm('坐席删除后，本月月租将不进行返还。如需变更坐席绑定人员，请直接进行坐席修改。是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSeat(data).then(res => {
          console.log(res)
          if (res.statusCode === '00000') {
            _this.$message({ message: '删除成功', type: 'success' })
            _this.getlist()
          }
        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 搜索
    search() {
      const _this = this
      _this.hwCurrent = 1
      _this.getlist()
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
              callPhone: _this.whData.tell,
              userId: _this.whData.id
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
    // 修改表格头部颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:rgba(232,243,253,1);color:rgba(54,52,69,1);border-right:1px solid #fff'
      }
    },
    // 分页
    handleSizeChange(val) {
      this.hwSize = val
      this.getlist()
    },
    handleCurrentChange(val) {
      this.hwCurrent = val
      this.getlist()
    },
    // 时间戳转换
    formatDate(value) {
      const date = new Date(value)
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    },
    // 关闭弹窗清楚验证-外呼
    handleClose_wh() {
      this.$refs.whData.resetFields()
    },
    // 清除表单验证-外呼
    quxiao_wh(formName) {
      this.dialogVisible_wh = false
      this.$refs[formName].clearValidate()
    }
  }
}
</script>

<style scoped>
.toolS{
  display: flex;
  justify-content: space-between;
   padding-bottom: 10px;
    align-items:center;
}
.shaowAll{
  /* box-shadow: 2px 4px 8px 8px rgba(0, 0, 0, 0.05); */
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  padding: 20px;

}
.Ptitle{
      font-size: 18px;
    line-height: 18px;
    color: #222;
    font-weight: 700;

}
.hw_admin_box{
    margin:20px;
}
.fenye{
    display: block;
    text-align: right;
    margin-top:20px;
}
.el-button{
    padding: 8px 12px !important;
    position: relative;
}
.el-message-box {
    width: 1500px !important;
  }
</style>
