<template>
  <div class="bumen_box shaowAll">
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple" :style="{height:body_height+'px'}">
          <el-tree
            :data="treeList"
            :props="defaultProps"
            default-expand-all
            :highlight-current="true"
            @node-click="handleNodeClick"
          >
            <div slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <el-dropdown class="more_right">
                <span class="el-dropdown-link">
                  <i class="el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="removeBmishow" @click.native="treeRemove(data.pid,node.label,data.value)">删除</el-dropdown-item>
                  <el-dropdown-item v-if="upBmishow" @click.native="treeUpdata(data.pid,node.label,data.value)">修改</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-tree>
          <p v-if="addBmishow" class="addBm_text" @click="add_pop"><span class="el-icon-plus" />新建部门</p>
          <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            width="40%"
            @closed="handleClose"
          >
            <el-form ref="ruleForm" :model="addBmData" :rules="rules" label-width="100px">
              <el-form-item label="部门：">
                <el-cascader
                  ref="refHandle"
                  v-model="addBmData.bumenlist"
                  :options="treeList"
                  :props="{ checkStrictly: true }"
                  style="width:100%"
                  placeholder="请选择上级部门"
                  :visible-change="false"
                  @change="handleChange"
                />
              </el-form-item>
              <el-form-item label="部门名称：" prop="name">
                <el-input v-model="addBmData.name" placeholder="请输入部门名称" />
              </el-form-item>
              <el-form-item style="text-align:right">
                <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                <el-button @click="quxiao('ruleForm')">取消</el-button>
              </el-form-item>
            </el-form>

          </el-dialog>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content bg-purple-light" :style="{height:body_height+'px'}">
          <p class="title">{{ cyData.label }}</p>
          <el-button v-if="addCyishow" type="primary" @click="addCy"><span class="el-icon-plus" /> 添加成员</el-button>
          <el-table
            ref="zxListData"
            v-loading="loading"
            :data="cyDataList"
            tooltip-effect="dark"
            style="width:95%;margin:15px auto 20px auto;"
            highlight-current-row
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="name"
              label="姓名"
            />
            <el-table-column
              prop="address"
              label="地址"
            />
            <el-table-column
              prop="gender"
              label="性别"
            />
            <el-table-column
              prop="email"
              label="邮箱"
            />
            <el-table-column
              prop="mobile"
              label="电话"
            />
            <el-table-column
              prop="position"
              label="职务信息"
            />
            <el-table-column
              prop="status"
              label="激活状态"
            >
              <template slot-scope="scope">
                {{ scope.row.status==='normal'?"正常":scope.row.status==='disable'?"禁用":"未激活" }}
              </template>
            </el-table-column>
            <el-table-column
              label="编辑"
              width="250"
            >
              <template slot-scope="scope">
                <el-button v-if="resetCyishow" type="primary" @click="resetUserPassword(scope.row)">重置密码</el-button>
                <el-button v-if="upCyishow" type="primary" @click="xiugaicy(scope.row)">修改</el-button>
                <el-button v-if="removeCyishow" type="danger" @click="removecy(scope.row)">删除</el-button>
              </template>
            </el-table-column></el-table>
          <el-dialog
            :title="title"
            :visible.sync="dialogVisible1"
            :close-on-click-modal="false"
            width="40%"
            @closed="handleClose1"
          >
            <el-form ref="ruleForm" :model="cyData" :rules="cyrules" label-width="100px">
              <el-form-item label="姓名：" prop="name">
                <el-input v-model="cyData.name" placeholder="请输入姓名" />
              </el-form-item>
              <el-form-item label="性别：" prop="gender">
                <el-select v-model="cyData.gender" placeholder="请选择性别" style="width:100%">
                  <el-option label="男" value="男" />
                  <el-option label="女" value="女" />
                </el-select>
              </el-form-item>
              <el-form-item label="地址：">
                <el-input v-model="cyData.address" placeholder="请输入地址" />
              </el-form-item>
              <el-form-item v-if="title=='修改成员'" label="部门：">
                <el-cascader
                  ref="refHandle"
                  v-model="cyData.bmid"
                  :options="treeList"
                  :props="{ checkStrictly: true }"
                  style="width:100%"
                  placeholder="请选择部门"
                  :visible-change="false"
                  @change="handleChange2"
                />
              </el-form-item>
              <el-form-item label="邮箱：" prop="mail">
                <el-input v-model="cyData.mail" placeholder="请输入邮箱" />
              </el-form-item>
              <el-form-item label="电话：" prop="tell">
                <el-input v-model="cyData.tell" placeholder="请输入电话" />
              </el-form-item>
              <el-form-item v-if="title!=='修改成员'" label="密码：" prop="password">
                <el-input v-model="cyData.password" type="password" placeholder="请输入密码" />
              </el-form-item>
              <el-form-item label="职务：">
                <el-input v-model="cyData.job" placeholder="请输入职务" />
              </el-form-item>
              <el-form-item label="角色：" prop="jiaoseid">
                <el-select v-model="cyData.jiaoseid" multiple placeholder="请选择角色" style="width:100%" @change="jiaosechange">
                  <el-option v-for="(item,index) in cyData.jiaoselist" :key="index" :label="item.roleName" :value="item.id" />
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="激活状态：">
                <el-radio-group v-model="cyData.isShow">
                  <el-radio label="normal" value="正常">正常</el-radio>
                  <el-radio label="disable">禁用</el-radio>
                  <el-radio label="not_active">未激活</el-radio>
                </el-radio-group>
              </el-form-item> -->
              <el-form-item style="text-align:right">
                <el-button type="primary" @click="cysubmit('ruleForm')">确定</el-button>
                <el-button @click="quxiao1('ruleForm')">取消</el-button>
              </el-form-item>
            </el-form>

          </el-dialog>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { resetUserPassword, create, validata, getAllDepartment, del, udpate, cycreate, getUsersByDepartment, cydel, cyudpate, selectRoleList, getUsersById } from '@/api/framework'
import { getcustomerId } from '@/utils/auth'
// import router from '@/router'
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入部门名称!'))
      }
      if (this.treeList.length === 0) {
        const data = {
          param: {
            customerId: getcustomerId(),
            name: this.addBmData.name,
            pid: '0'
          }
        }
        validata(data).then(res => {
          console.log(res)
          if (res.data === false) {
            return callback(new Error('部门名字重复，请重新输入!'))
          } else {
            callback()
          }
        })
      } else {
        const data = {
          param: {
            customerId: getcustomerId(),
            name: this.addBmData.name,
            pid: this.addBmData.pid
          }
        }
        validata(data).then(res => {
          console.log(res)
          if (res.data === false) {
            return callback(new Error('部门名字重复，请重新输入!'))
          } else {
            callback()
          }
        })
      }
    }
    // 手机号验证
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|6|7|8|9][0-9]{9}$/
      if (!value) {
        return callback(new Error('电话号码不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不正确'))
          }
        }
      }, 100)
    }
    return {
      body_height: '', // 页面高度
      dialogVisible: false, // 新建部门弹出框
      addBmData: {// 新建部门数据
        name: '',
        bumenlist: [],
        bmid: '',
        pid: ''
      },
      selectedOptions: [],
      rules: {// 新建部门验证表单
        name: [
          { validator: checkAge, trigger: 'blur' }
        ]
      },
      treeList: [], // 树形结构数据
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      title: '',
      dialogVisible1: false, // 添加成员弹出层
      cyData: {
        name: '',
        gender: '',
        address: '',
        mail: '',
        tell: '',
        password: '',
        job: '',
        isShow: 'normal',
        pid: '',
        bmId: '',
        label: '',
        id: '',
        jiaoselist: [],
        jiaose: '',
        jiaoseid: [],
        xgjiaoseid: [],
        uid: ''
      },
      bumenIdList: '',
      loading: false,
      cyrules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        mail: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        tell: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],
        jiaoseid: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      cyDataList: [],
      buttons: [],
      buttonsChild: [],
      addBmishow: false, // 根据权限添加部门隐藏显示
      upBmishow: false, // 根据权限修改部门隐藏显示
      removeBmishow: false, // 根据权限删除部门隐藏显示
      addCyishow: false, // 根据权限添加成员隐藏显示
      upCyishow: false, // 根据权限修改成员隐藏显示
      resetCyishow: false, // 根据权限重置密码隐藏显示
      removeCyishow: false// 根据权限删除成员隐藏显示
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
          vm.buttonsChild = res
          // 部门权限
          switch (res.powerCode) {
            case '/department/create':
              vm.addBmishow = true
              break
            case '/department/udpate':
              vm.upBmishow = true
              break
            case '/department/del':
              vm.removeBmishow = true
              console.log('进来了！！！！！！！！')
              break
            case '/user/create':
              vm.addCyishow = true
              break
            case '/user/udpate':
              vm.upCyishow = true
              break
            case '/login/resetUserPassword':
              vm.resetCyishow = true
              break
            case '/user/del':
              vm.removeCyishow = true
              break
            default:
              break
          }
        })
      })
    })
  },
  created() {
    this.getmoreBumen()
    // 角色下拉列表
    this.getjiaose()
  },
  mounted() {
    this.body_height = document.body.clientHeight - 90
    console.log(getcustomerId())
    console.log('111111111111111')
    console.log(this.removeBmishow)
  },
  methods: {
    resetUserPassword(row) {
      this.$confirm('此操作会将用户密码重置为123456, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetUserPassword({
          param: {
            userId: row.uid
          }
        }).then(res => {
          if (res.statusCode === '00000') {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 获取角色列表
    async getjiaose() {
      var data = {
        param: {
          sysName: 'call_boss'
        }
      }
      await selectRoleList(data).then(res => {
        if (res.statusCode === '00000') {
          this.cyData.jiaoselist = res.data
        }
      })
    },
    //
    jiaosechange(e) {
      this.cyData.jiaoseid = e
      console.log(this.cyData.jiaoseid)
    },
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
          _this.treeList = data
        }
      })
    },
    // 新建部门-弹出层
    add_pop() {
      this.dialogVisible = true
      this.title = '新建部门'
    },
    // 新建部门-修改弹窗
    treeUpdata(pid, value, id) {
      console.log(id)
      this.dialogVisible = true
      this.title = '修改部门'
      this.addBmData.name = value
      this.addBmData.pid = pid
      this.addBmData.bmid = id
      this.addBmData.bumenlist = id
    },
    // 新建部门-确定
    async submitForm(formName) {
      const _this = this
      await _this.$refs[formName].validate((valid) => {
        console.log(_this.treeList.length)
        if (valid) {
          if (_this.title === '新建部门') {
            if (_this.treeList.length === 0) {
              const data = {
                param: {
                  customerId: getcustomerId(),
                  name: _this.addBmData.name,
                  pid: '0'
                }
              }
              create(data).then(res => {
                console.log(res)
                if (res.statusCode === '00000') {
                  _this.$message({ message: '新建成功', type: 'success' })
                  _this.dialogVisible = false
                  _this.getmoreBumen()
                }
              })
            } else {
              const data = {
                param: {
                  customerId: getcustomerId(),
                  name: _this.addBmData.name,
                  pid: _this.addBmData.bmid
                }
              }
              create(data).then(res => {
                console.log(res)
                if (res.statusCode === '00000') {
                  _this.$message({ message: '新建成功', type: 'success' })
                  _this.dialogVisible = false
                  _this.getmoreBumen()
                }
              })
            }
          } else {
            const data = {
              param: {
                customerId: getcustomerId(),
                name: _this.addBmData.name,
                pid: _this.addBmData.pid,
                id: _this.addBmData.bmid
              }
            }
            udpate(data).then(res => {
              console.log(res)
              if (res.statusCode === '00000') {
                _this.$message({ message: '修改成功', type: 'success' })
                _this.dialogVisible = false
                _this.getmoreBumen()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 部门删除
    async treeRemove(pid, value, id) {
      console.log(pid, value, id)
      const _this = this
      var data = {
        param: {
          customerId: getcustomerId(),
          id: id,
          name: value,
          pid: pid
        }
      }
      await _this.$confirm('此操作将永久删除该部门及其成员，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(data).then(res => {
          console.log(res)
          if (res.statusCode === '00000') {
            _this.$message({
              type: 'success',
              message: '删除成功!'
            })
            _this.getmoreBumen()
          }
        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 左边树形结构
    handleNodeClick(data) {
      console.log(data)
      /* 成员*/
      this.cyData.label = data.label
      this.cyData.pid = data.pid
      // this.cyData.bmid = data.value
      this.bumenIdList = data.value
      this.getCylist()
    },
    // 获取当前部门下的成员
    getCylist() {
      this.loading = true
      var shuju = {
        param: {
          departmentId: this.bumenIdList
        }
      }
      getUsersByDepartment(shuju).then(res => {
        console.log(res)
        if (res.statusCode === '00000') {
          setTimeout(res => {
            this.loading = false
          }, 300)
          this.cyDataList = res.data
        }
      })
    },
    // 级联选择
    handleChange(value) {
      console.log(value)
      if (value) {
        this.$refs.refHandle.dropDownVisible = false
      }
      this.addBmData.bmid = value[value.length - 1]
      this.addBmData.pid = value[value.length - 1]
      if (value.length > 1) {
        this.addBmData.pid = value[value.length - 2]
        console.log(this.addBmData.pid)
      }
    },
    // 级联选择
    handleChange2(value) {
      console.log(value)
      if (value) {
        this.$refs.refHandle.dropDownVisible = false
      }
      this.cyData.bmid = value[value.length - 1]
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
    // 清除表单验证-应用
    quxiao(formName) {
      this.dialogVisible = false
      this.$refs[formName].clearValidate()
    },
    quxiao1(formName) {
      this.dialogVisible1 = false
      this.$refs[formName].clearValidate()
    },
    // 关闭弹窗清楚验证-外呼
    handleClose() {
      console.log('aaa')
      this.addBmData.name = ''
      // this.addBmData.bumenlist = []
      this.$refs.ruleForm.resetFields()
    },
    handleClose1() {
      this.$refs.ruleForm.resetFields()
      this.cyData.name = ''
      this.cyData.gender = ''
      this.cyData.password = ''
      this.cyData.mail = ''
      this.cyData.tell = ''
      this.cyData.job = ''
      this.cyData.isShow = 'normal'
      this.cyData.address = ''
    },
    /* ============成员=============*/
    addCy() {
      if (this.cyData.label === '') {
        this.$message({
          message: '请先选择部门！',
          type: 'warning'
        })
      } else {
        this.dialogVisible1 = true
        this.title = '添加成员'
        // this.$refs.ruleForm.resetFields()
      }
    },
    xiugaicy(e) {
      console.log(e)
      this.dialogVisible1 = true
      this.title = '修改成员'
      this.cyData.name = e.name
      this.cyData.gender = e.gender
      this.cyData.address = e.address
      this.cyData.mail = e.email
      this.cyData.bmid = e.mainDepartment
      // this.cyData.password = e.password
      this.cyData.tell = e.mobile
      this.cyData.job = e.position
      this.cyData.id = e.id
      this.cyData.isShow = e.status
      this.cyData.uid = e.uid
      // this.cyData.isShow === 'normal' ? '正常' : this.cyData.isShow === 'disable' ? '禁用' : '未激活'
      // this.cyData.jiaoseid.push('430138190411972608H')
      var data = {
        param: {
          userId: e.id
        }
      }
      getUsersById(data).then(res => {
        if (res.statusCode === '00000') {
          console.log(res)
          this.cyData.jiaoseid = res.data.roleIds
          this.cyData.xgjiaoseid = res.data.roleIds
        }
      })
    },
    // 新建成员提交
    async cysubmit(formName) {
      const _this = this
      await _this.$refs[formName].validate((valid) => {
        if (valid) {
          if (_this.title === '添加成员') {
            const data = {
              param: {
                address: _this.cyData.address,
                customerId: getcustomerId(),
                email: _this.cyData.mail,
                gender: _this.cyData.gender,
                password: _this.cyData.password,
                // mainDepartment: _this.cyData.bmid,
                mainDepartment: _this.bumenIdList,
                mobile: _this.cyData.tell,
                name: _this.cyData.name,
                position: _this.cyData.job,
                roleIds: _this.cyData.jiaoseid
              }
            }
            cycreate(data).then(res => {
              console.log(res)
              if (res.statusCode === '00000') {
                if (res.data === false) {
                  _this.$message({ type: 'warning', message: '手机号重复，请更换手机号!' })
                } else {
                  _this.$message({ type: 'success', message: '添加成功!' })
                  _this.dialogVisible1 = false
                  setTimeout(res => {
                    _this.getCylist()
                  }, 300)
                }
              }
            })
          } else {
            console.log(this.cyData.xgjiaoseid)
            console.log(this.cyData.jiaoseid)
            var xd = false// false 等于角色没修改 true等于角色修改
            if (this.cyData.xgjiaoseid.length !== this.cyData.jiaoseid.length) {
              xd = true
            }
            for (let i = 0; i < this.cyData.xgjiaoseid.length; i++) {
              if (this.cyData.jiaoseid.indexOf(this.cyData.xgjiaoseid[i]) === -1) {
                console.log('不等3')
                xd = true
              }
            }
            if (xd === true) {
              const data = {
                param: {
                  address: _this.cyData.address,
                  // customerId: getcustomerId(),
                  email: _this.cyData.mail,
                  gender: _this.cyData.gender,
                  // password: _this.cyData.password,
                  mainDepartment: _this.bumenIdList,
                  mobile: _this.cyData.tell,
                  name: _this.cyData.name,
                  position: _this.cyData.job,
                  status: _this.cyData.isShow,
                  id: _this.cyData.id,
                  roleIds: _this.cyData.jiaoseid,
                  uid: _this.cyData.uid
                }
              }
              cyudpate(data).then(res => {
                console.log(res)
                if (res.statusCode === '00000') {
                  _this.$message({ type: 'success', message: '修改成功!' })
                  _this.dialogVisible1 = false
                  setTimeout(res => {
                    _this.getCylist()
                  }, 500)
                } else {
                  // console.log('李仁松')
                  // _this.$message({ type: 'error', message: res.message })
                }
              })
            } else {
              const data = {
                param: {
                  address: _this.cyData.address,
                  // customerId: getcustomerId(),
                  email: _this.cyData.mail,
                  gender: _this.cyData.gender,
                  // password: _this.cyData.password,
                  mainDepartment: _this.cyData.bmid,
                  mobile: _this.cyData.tell,
                  name: _this.cyData.name,
                  position: _this.cyData.job,
                  status: _this.cyData.isShow,
                  id: _this.cyData.id,
                  roleIds: [],
                  uid: _this.cyData.uid
                }
              }
              cyudpate(data).then(res => {
                console.log(res)
                if (res.statusCode === '00000') {
                  _this.dialogVisible1 = false
                  setTimeout(res => {
                    _this.getCylist()
                  }, 500)
                }
              })
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除成员
    async removecy(e) {
      const _this = this
      console.log(e)
      var data = {
        param: {
          id: e.id
        }
      }
      await _this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cydel(data).then(res => {
          if (res.statusCode === '00000') {
            _this.$message({ type: 'success', message: '删除成功!' })
            setTimeout(res => {
              _this.getCylist()
            }, 300)
          }
        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }
}
</script>

<style scoped>
.shaowAll{
  /* box-shadow: 2px 4px 8px 8px rgba(0, 0, 0, 0.05); */
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  padding: 20px;

}
.bumen_box{
  background: #fbfbfd;
  padding:15px;
}
.bg-purple {
  background: #fff;
  box-shadow: -8px 0px 8px 0px #f4f4f7;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
  border-right:1px solid #e9eaf2;
  padding:20px;
}
.bg-purple-light {
  background: #fff;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  box-shadow: 0 0 8px 0 #f4f4f7;
  padding:20px;
}
.bg-purple-light .title{
  margin:0 0 20px 0;
}
.addBm_text{
  color:#00c48f;
  text-align: center;
  cursor: pointer;
  margin:0;
  padding-top:20px;
  font-size:14px;
}
.addBm_text span{
  margin-right:6px;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
.el-icon-more{
  transform:rotate(90deg);
  color:#606266;
}
.el-tree-node{
line-height:40px !important;
}
.el-button{
  padding: 8px 12px !important;
}
</style>
