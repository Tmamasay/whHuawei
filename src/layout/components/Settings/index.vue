<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">呼叫中心</h3>
    </div>
    <div>
      <el-form ref="whData" label-width="0px" class="hjzx" :model="whData" :rules="ruleswh" @submit.native.prevent>
        <p class="ptit">当前拨打进度：</p>
        <el-form-item label="">
          <el-progress color="#00c48f" :text-inside="true" :stroke-width="15" :percentage="percentage" status="success" />
        </el-form-item>
        <p class="ptit">拨打的电话号码：</p>
        <el-form-item label="" prop="tell">
          <el-input v-model="whData.tell" placeholder="拨打的电话号码" @keyup.enter.native="boda('whData')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quxiao_wh('whData')">清 空</el-button>
        <el-button type="primary" @click="boda('whData')">拨 打</el-button>
      </div>

    </div>
  </div>
</template>

<script>
import { callInside } from '@/api/framework'
export default {
  components: { },
  data() {
    return {
      percentage: 0,
      whData: {
        id: '',
        tell: ''
      },
      ruleswh: {
        tell: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          {
            pattern: /^(1[0-9]\d{9}|^(0[0-9]{2,3})([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/,
            message: '手机号格式不对',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {

  },
  watch: {
    'whData.tell': function(val, oldVal) {
      if (!val) {
        this.percentage = 0
      }
    }
  },
  methods: {
    // 清除表单验证-外呼
    quxiao_wh(formName) {
      this.whData.tell = ''
      // this.dialogVisible_wh = false
      this.$refs[formName].clearValidate()
    },
    // 外呼拨打电话
    async boda(formName) {
      const _this = this
      await _this.$refs[formName].validate((valid) => {
        if (valid) {
          this.percentage = Math.floor(Math.random() * 70)
          var data = {
            param: {
              callPhone: _this.whData.tell
              // userId: _this.whData.id
            }
          }
          callInside(data).then(res => {
            console.log(res)
            if (res.statusCode === '00000') {
              this.percentage = 100
              _this.$message({ message: '拨打成功', type: 'success' })
            }
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

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  .hjzx{
    margin-top: 40%;
  }
  .ptit{
     margin-bottom: 12px;
    line-height: 22px;
    font-size: 15px;
    color: rgb(104, 104, 104);
    // font-weight: 700;
  }

  .drawer-title {
    margin-bottom: 12px;
    line-height: 22px;
    font-size: 18px;
    color: #222;
    font-weight: 700;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
}
</style>
