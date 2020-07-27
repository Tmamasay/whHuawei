<template>
  <div class="hw_admin_box">
    <el-button type="primary" size="medium" style="margin-bottom:20px" @click="boda_pop">呼叫</el-button>
    <!-- <el-form :inline="true" :model="query" class="demo-form-inline">
      <el-form-item label="主叫号码">
        <el-input v-model="query.callerNum" placeholder="请输入主叫号码！" />
      </el-form-item>
      <el-form-item label="被叫号码">
        <el-input v-model="query.calleeNum" placeholder="请输入被叫号码！" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form> -->
    <el-table
      ref="zxListData"
      v-loading="loading"
      :data="dataList"
      tooltip-effect="dark"
      style="width: 100%"
      border
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="id"
        label="记录id"
      />
      <el-table-column
        prop="callerNum"
        label="主叫号码"
      />
      <el-table-column
        prop="calleeNum"
        label="被叫号码"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
      >
        <template slot-scope="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="编辑"
      >
        <template slot-scope="scope">
          <el-button type="primary" @click="xiugaiZx(scope.row)">修改</el-button>
          <el-button type="primary" @click="boda_pop(scope.row)">外呼</el-button>
          <el-button type="danger" @click="removeZX(scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
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
    <!-- 外呼 -->
    <el-dialog
      title="拨打的电话号码"
      :visible.sync="dialogVisible_wh"
      :close-on-click-modal="false"
      width="30%"
      @closed="handleClose_wh"
    >
      <el-form ref="whData" :label-position="labelPosition" label-width="140px" :model="whData" :rules="ruleswh">
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
import { findUserCallLogPage, callInside } from '@/api/framework'
export default {
  data() {
    return {
      query: {
        callerNum: '',
        calleeNum: ''
      },
      loading: false, // loading加载
      dataList: [], // 数据列表
      hwSize: 10, // 一页多少条
      hwCurrent: 1, // 页码
      total: 0, // 总数
      title: '', // 新增修改名称
      dialogVisible: false, // 弹出框
      labelPosition: 'center', // 对齐方式
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
      }
    }
  },
  created() {
    this.getlist()
    // this.choiceBm()
  },
  mounted() {
    this.getmoreBumen()
  },
  methods: {
    // 列表
    async getlist() {
      const _this = this
      _this.loading = true
      var data = {
        param: {
          callerNum: _this.query.callerNum,
          calleeNum: _this.query.calleeNum,
          current: _this.hwCurrent,
          size: _this.hwSize
        }
      }
      await findUserCallLogPage(data).then(res => {
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
</style>
