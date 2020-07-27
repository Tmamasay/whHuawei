<template>
  <div class="cz_box">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="充值金额">
        <el-input v-model="formInline.price" placeholder="请输入充值金额" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定充值</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formInline: {
        price: ''
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    }
  }
}
</script>

<style scoped>
.cz_box{
  margin:20px;
}
</style>
