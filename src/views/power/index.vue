<template>
  <div class="power_box">
    <el-button v-if="addjsishow" type="primary  el-icon-plus" size="small" style="margin-bottom:20px" @click="addjs"> 添加角色</el-button>
    <el-table
      ref="zxListData"
      v-loading="Loading"
      :data="roleList"
      tooltip-effect="dark"
      style="width:95%;margin:10px auto 20px auto;"
      highlight-current-row
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="roleName"
        label="角色名称"
      />
      <el-table-column
        prop="customerId"
        label="用户id"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
      >
        <template slot-scope="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
      >
        <template slot-scope="scope">
          {{ formatDate(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column
        label="编辑"
      >
        <template slot-scope="scope">
          <el-button v-if="upjsishow" type="primary" size="small" @click="xiugaiZx(scope.row)">修改</el-button>
          <el-button v-if="removejsishow" type="danger" size="small" @click="removeZX(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total" class="block fenye">
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
      v-if="dialogVisible"
      title="添加角色"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form v-if="powerList.length" ref="jsData" :model="jsData" label-width="80px" :rules="rules">
        <el-form-item label="角色组名" prop="name">
          <el-input v-model="jsData.name" placeholder="请输入角色组名！" />
        </el-form-item>
      </el-form>
      <div class="tree">
        <el-tree
          ref="tree"
          :data="powerList"
          node-key="id"
          default-expand-all
          :check-strictly="systemNodeFlag"
          :default-checked-keys="checkAllBtn"
          show-checkbox
          @check-change="handleCheckChange"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole('jsData')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSysMenus, selectRolePage, addRole, updateRole, delRole } from '@/api/chengxu'
// import { getqxbutton } from '@/utils/auth'
export default {
  data() {
    return {
      systemNodeFlag: false,
      dialogVisible: false,
      jsData: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色组名！', trigger: 'blur' }
        ]
      },
      hwSize: 10, // 一页多少条
      hwCurrent: 1, // 页码
      Loading: false,
      total: 0, // 总数
      count: 1,
      powerList: [],
      roleList: [],
      checkMenu: [], // 选中菜单
      checkBtn: [], // 选中按钮
      checkAllBtn: [], // 回显选中
      checkAllMenu: [], // 回显菜单
      buttons1: [],
      addjsishow: false,
      upjsishow: false,
      removejsishow: false
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const arr = JSON.parse(localStorage.getItem('buttons'))
      vm.buttons1 = arr.filter(e => e.mid === to.meta.id)
      console.log('222222222222222222222222222222222222222')
      console.log(vm.buttons1)
      vm.buttons1.forEach(child => {
        child.buttons.forEach(res => {
          console.log(res)
          debugger
          switch (res.powerCode) {
            case '/rolePowerManager/addRole':
              vm.addjsishow = true
              break
            case '/rolePowerManager/updateRole':
              vm.upjsishow = true
              break
            case '/rolePowerManager/delRole':
              vm.removejsishow = true
              break

            default:
              break
          }
        })
      })
    })
  },
  created() {
    this.getSysMenus()
    this.selectRolePage()
  },
  mounted() {

  },
  methods: {
    async removeZX(row) {
      console.log(row)
      var data = {
        param: {
          roleId: row.id,
          sysName: 'call_boss'
        }
      }
      await this.$confirm(`是否删除 ${row.roleName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRole(data).then(res => {
          if (res.statusCode === '00000') {
            this.$message({ message: '删除成功', type: 'success' })
            setTimeout(() => {
              this.selectRolePage()
            }, 500)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 修改权限数据
    xiugaiZx(row) {
      this.dialogVisible = true
      this.jsData.name = row.roleName
      this.jsData.roleId = row.id
      this.systemNodeFlag = true
      this.$nextTick(() => {
        console.log('jk-----------lobvr')
        console.log(this.generateRoutes2(row.children))
        this.$refs.tree.setCheckedNodes(this.generateRoutes2(row.children))
        this.systemNodeFlag = false
      })

      // this.checkAllBtn = []
      // this.checkAllMenu = []

      // row.children.forEach(btn => {
      //   this.checkAllMenu.push(btn.id)
      //   this.checkAllBtn.push(btn.id)
      // })
      // row.buttons.forEach(btn => {
      //   this.checkAllBtn.push(btn.id)
      // })
      // this.checkAll = this.generateRoutes(row)
    },
    handleClose() {
      this.dialogVisible = false
    },
    // 时间戳转换
    formatDate(value) {
      if (!value) return
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
    // 格式化树
    generateRoutes(routes) {
      const res = []
      routes.forEach(route => {
        const data = {
          id: route.id,
          label: route.menuName || route.powerName,
          isbtn: route.menuName ? 1 : 2
        }
        if (route.children && route.children.length) {
          data.children = this.generateRoutes(route.children)
        }
        if (route.buttons && route.buttons.length) {
          console.log(route.buttons)
          console.log('-00000000000-')
          data.children = this.generateRoutes(route.buttons)
        }

        res.push(data)
      })
      return res
    },
    // 格式化树
    generateRoutes2(routes) {
      const res = []
      routes.forEach(route => {
        const data = {
          id: route.id,
          label: route.menuName || route.powerName,
          isbtn: route.type
        }
        if (route.children && route.children.length) {
          const zz = this.generateRoutes(route.children)
          zz.forEach(element => {
            if (element.children && element.children.length) {
              element.children.forEach(el => {
                res.push(el)
              })
            }
            res.push(element)
          })
        }
        res.push(data)
      })
      return res
    },
    // 获取角色组
    async getSysMenus() {
      var data = {
        param: {
          sysName: 'call_boss'
        }
      }
      await getSysMenus(data).then(res => {
        if (res.statusCode === '00000') {
          debugger
          this.powerList = this.generateRoutes(res.data)
          this.dialogVisible = false
        }
      })
    },
    // 获取角色列表
    async selectRolePage() {
      this.Loading = true
      var data = {
        param: {
          current: this.hwCurrent,
          size: this.hwSize,
          sysName: 'call_boss'

        }
      }
      await selectRolePage(data).then(res => {
        if (res.statusCode === '00000') {
          debugger
          this.roleList = res.data.records
          this.total = res.data.total
          this.Loading = false

          console.log(this.roleList)
        }
      })
    },
    // 分页
    handleSizeChange(val) {
      this.hwSize = val
      this.selectRolePage()
    },
    handleCurrentChange(val) {
      this.hwCurrent = val
      this.selectRolePage()
    },
    // 数组去重
    setArr(arr) {
      debugger
      return [...new Set(arr)]
    },
    // 添加角色
    addRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.checkMenu = []
          this.checkBtn = []
          this.generateRoles(this.$refs.tree.getCheckedNodes())
          console.log(this.$refs.tree.getCheckedNodes())
          console.log('0-=-09')
          const halfArr = this.$refs.tree.getHalfCheckedKeys()
          this.checkMenu = [...this.checkMenu, ...halfArr]
          let data
          if (!this.jsData.roleId) {
            data = {
              param: {
                menuList: this.setArr(this.checkMenu),
                powerList: this.setArr(this.checkBtn),
                roleName: this.jsData.name,
                sysName: 'call_boss'
              }
            }
            addRole(data).then(res => {
              if (res.statusCode === '00000') {
                this.$message({ message: '操作成功', type: 'success' })
                this.dialogVisible = false
                setTimeout(() => {
                  this.selectRolePage()
                }, 500)
              }
            })
          } else {
            data = {
              param: {
                menuList: this.setArr(this.checkMenu),
                powerList: this.setArr(this.checkBtn),
                roleName: this.jsData.name,
                roleId: this.jsData.roleId,
                sysName: 'call_boss'
              }
            }
            updateRole(data).then(res => {
              if (res.statusCode === '00000') {
                this.dialogVisible = false
                this.$message({ message: '操作成功', type: 'success' })
                setTimeout(() => {
                  this.selectRolePage()
                }, 500)
              }
            })
          }
        }
      })
    },
    // 添加角色弹出框
    addjs() {
      this.jsData = {
        name: ''
      }
      this.dialogVisible = true
      this.checkAllBtn = []
      this.checkAllMenu = []
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([])
      }
    },
    isArrItem(item, Arr) {
      const foundIndex = Arr.indexOf(item)
      return foundIndex !== -1
    },
    handleCheckChange(data, checked, indeterminate) {
      // console.log(this.$refs.tree.getCheckedNodes())
      console.log('09---------yy---------')
      console.log(this.$refs.tree.getCheckedNodes())
      // this.checkMenu = []
      // this.checkBtn = []
      // this.generateRoles(this.$refs.tree.getCheckedNodes(), checked)
      // this.generateRoles(this.$refs.tree.getHalfCheckedKeys(), checked)
      // console.log(this.$refs.tree.getHalfCheckedKeys())
      // console.log(this.checkMenu)
      // console.log(this.checkBtn)
      console.log('09---------xx---------')
    },
    removeArr(val, arr) {
      var index = arr.indexOf(val)
      if (index > -1) {
        arr.splice(index, 1)
      }
    },
    // 格式化菜单
    generateRoles(routes, checked) {
      routes.forEach(route => {
        if (+route.isbtn === 1) {
          this.checkMenu.push(route.id)
        } else if (+route.isbtn === 2) {
          this.checkBtn.push(route.id)
        }
        // if (route.children) {
        //   this.generateRoles(route.children)
        // }
        // :default-expanded-keys="checkAllMenu"
      })
    }
  }
}
</script>

<style scoped>
.power_box{
    margin:20px;
}
.fenye{
    display: block;
    text-align: right;
    margin-top:20px;
}
.tree{
  max-height: 500px;
  overflow: auto;
}
.tree::-webkit-scrollbar{/*滚动条整体样式*/
width:4px;/*高宽分别对应横竖滚动条的尺寸*/
height:4px;
}

.tree::-webkit-scrollbar-thumb{/*滚动条里面小方块*/
border-radius:5px;
-webkit-box-shadow:inset005pxrgba(0,0,0,0.2);
background:rgba(0,0,0,0.2);
}

.tree::-webkit-scrollbar-track{/*滚动条里面轨道*/
-webkit-box-shadow:inset005pxrgba(0,0,0,0.2);
border-radius:0;
background:rgba(0,0,0,0.1);
}
</style>
