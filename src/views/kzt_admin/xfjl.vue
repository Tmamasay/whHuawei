<template>
  <div class="xfjl_box shaowAll">
    <div class="toolS">
      <p class="Ptitle">消费记录</p>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="type" placeholder="请选择消费类型">
            <el-option label="请选择" value="" />
            <el-option label="充值" value="recharge" />
            <el-option label="消费" value="consume" />
            <el-option label="转移" value="transfer" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sousuo">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      :data="datalist"
      tooltip-effect="dark"
      style="width:95%;margin:10px auto 20px auto;"
      highlight-current-row
    >
      <el-table-column prop="gid" label="流水ID" />
      <el-table-column prop="productCode" label="产品类型">
        <template slot-scope="scope">
          {{ scope.row.productCode.msg }}
        </template>
      </el-table-column>
      <el-table-column prop="busAmount" label="消费金额(元)">
        <template slot-scope="scope">
          {{ toNum(scope.row.busAmount/100) }}
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="账户余额(元)">
        <template slot-scope="scope">
          {{ toNum(scope.row.balance/100) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="交易备注" />
      <el-table-column prop="status" label="交易状态" />
      <el-table-column prop="type" label="交易类型">
        <template slot-scope="scope">
          <!-- {{ scope.row.type==='recharge'?'充值':scope.row.type==='consume'?'消费': '转移' }} -->
          {{ scope.row.type }}
        </template>
      </el-table-column>
    </el-table>
    <div class="block fenye">
      <el-pagination
        :current-page="Current"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="Size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getPage, getUsable } from '@/api/framework'
import { getcustomerId } from '@/utils/auth'
export default {
  data() {
    return {
      datalist: [],
      yueNum: 0,
      Size: 10, // 一页多少条
      Current: 1, // 页码
      total: 0, // 总数
      time: null,
      type: null,
      loading: false // loading加载
    }
  },
  mounted() {
    this.getlist()
    this.getNum()
  },
  methods: {
    async getNum() {
      await getUsable({
        param: {
          customerId: getcustomerId()
        }
      }).then(res => {
        console.log(res)
        if (res.statusCode === '00000') {
          this.yueNum = this.toNum(res.data / 100)
        }
      })
    },
    getlist() {
      const _this = this
      _this.loading = true
      var data = {
        param: {
          customerId: getcustomerId(),
          current: _this.Current,
          size: _this.Size,
          startTime: _this.time ? Date.parse(_this.formatDate(_this.time[0])) : '',
          endTime: _this.time ? Date.parse(_this.formatDate(_this.time[0])) : '',
          type: _this.type
        }
      }
      getPage(data).then(res => {
        console.log(res)
        if (res.statusCode === '00000') {
          setTimeout(res => {
            _this.loading = false
          }, 300)
          _this.datalist = res.data.records
        }
      })
    },
    // 搜索
    sousuo() {
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
    toNum(value) {
      if (!value) return 0
      return value.toFixed(2)
    },
    // 分页
    handleSizeChange(val) {
      this.hwSize = val
      this.getlist()
    },
    handleCurrentChange(val) {
      this.hwCurrent = val
      this.getlist()
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
.xfjl_box{
  margin:20px;
}
.el-button{
    padding: 8px 12px !important;
}
.fenye{
    display: block;
    text-align: right;
    margin-top:20px;
}
.yue{
  width:100%;
  height:50px;
  font-size: 18px;
    color: #606266;
    line-height: 50px;
    padding-left: 10px;
    font-weight: 600;
  background: #fff;
  float:left;
  margin-bottom: 20px;
  /* margin-left:122px; */
  box-shadow: 0px 0px 5px #d2d2d2;
  border-radius: 5px;
  /* margin-top:20px; */
}
</style>
