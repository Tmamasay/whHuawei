<template>
  <div class="xfjl_box">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="订单号">
        <el-input v-model="formInline.num" placeholder="请输入订单号" />
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="formInline.time"
          type="datetime"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="订单号"
      />
      <el-table-column
        prop="date"
        label="时间"
      />
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formInline: {
        num: '',
        time: ''
      },
      tableData: [{
        date: '2016-05-02',
        name: '10000000'

      }, {
        date: '2016-05-04',
        name: '10000000'

      }, {
        date: '2016-05-01',
        name: '10000000'

      }, {
        date: '2016-05-03',
        name: '10000000'

      }]
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.xfjl_box{
  margin:20px;
}
.el-button{
    padding: 8px 12px !important;
}
</style>
