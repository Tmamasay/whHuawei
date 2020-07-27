<template>
  <div class="hw_admin_box shaowAll">
    <!-- <el-button type="primary" size="medium" style="margin-bottom:20px" @click="boda_pop">呼叫</el-button> -->
    <div class="toolS">
      <p class="Ptitle">通话记录</p>
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <!-- <el-form-item label="主号叫号码:">
        <el-input v-model="query.byPhone" placeholder="请输入主号叫号码" />
      </el-form-item>
      <el-form-item label="被叫号码:">
        <el-input v-model="query.callPhone" placeholder="请输入被叫码" />
      </el-form-item> -->
        <el-form-item label="">
          <el-date-picker
            v-model="query.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <!-- <el-button type="warning" @click="clearSer">清空</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="zx-list-data-&quot;"
      v-loading="loading"
      :data="dataList"
      tooltip-effect="dark"
      style="width: 100%;"
      border
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="uName" label="成员" />
      <el-table-column prop="departmentName" label="部门" />
      <!-- <el-table-column prop="duration" label="通话时长(分钟)" /> -->
      <el-table-column prop="callCount" label="总拨打数" />
      <el-table-column prop="callConnectedCount" label="总接通数" />
      <el-table-column prop="large30Count" label="超过30S" />
      <el-table-column prop="connectivityPercentage" label="接通率">
        <template slot-scope="scope">
          <span>{{ scope.row.connectivityPercentage/100 }}%</span>
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
      title="录音详情"
      :visible.sync="dialogVisible_ly"
      width="30%"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div style="text-align: center">
        <audio id="audio" :src="lyUrl" controls />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { selectLogAnalysis } from '@/api/chengxu'
// import { getqxbutton } from '@/utils/auth'
export default {
  data() {
    return {
      query: {
        byPhone: null,
        callPhone: null,
        time: null
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
      dialogVisible_Hd: false, // 话单
      hDid: '',
      whList: [],
      lyUrl: '', // 录音地址
      dialogVisible_ly: false,
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
      xqhdishow: false,
      day: '',
      hstTime: '',
      thisTime: ''
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     const arr = JSON.parse(getqxbutton())
  //     vm.buttons = arr.filter(e => e.mid === to.meta.id)
  //     console.log(vm.buttons)
  //     vm.buttons.forEach(child => {
  //       child.buttons.forEach(res => {
  //         console.log(res)
  //         switch (res.powerCode) {
  //           case 'huadan':
  //             vm.xqhdishow = true
  //             break

  //           default:
  //             break
  //         }
  //       })
  //     })
  //   })
  // },
  created() {

    // this.choiceBm()
  },
  mounted() {
    this.getCountDays()
    this.getxztime()
    this.getime()
    this.SecondToDate()
    this.getlist()
  },
  methods: {
    clearSer() {
      this.query.time = ''
    },
    // 弹窗关闭，音频暂停
    handleClose() {
      var audio = document.getElementById('audio')
      audio.pause()
      this.dialogVisible_ly = false
    },
    // 录音详情
    xiugaiZx(e) {
      console.log(e)
      const _this = this
      _this.dialogVisible_ly = true
      if (e.ossUrl === '') {
        _this.lyUrl = e.recordFileUrl
        window.open(_this.lyUrl, '_blank')
      } else {
        _this.lyUrl = e.ossUrl
        window.open(_this.lyUrl, '_blank')
      }
    },
    // 列表
    async getlist() {
      const _this = this
      _this.loading = true
      if (_this.query.time) {
        console.log('有')
        const data = {
          param: {
            // byPhone: _this.query.byPhone,
            // callPhone: _this.query.callPhone,
            current: _this.hwCurrent,
            size: _this.hwSize,
            startTime: _this.query.time ? Date.parse(_this.formatDate(_this.query.time[0])) : '',
            endTime: _this.query.time ? Date.parse(_this.formatDate(_this.query.time[1])) : ''
          }
        }
        await selectLogAnalysis(data).then(res => {
          console.log(res)
          if (res.statusCode === '00000') {
            setTimeout(res => {
              _this.loading = false
            }, 300)
            _this.dataList = res.data.records
            _this.total = +res.data.total
          } else {
            _this.loading = false
          }
        })
      } else {
        console.log('没有')
        const data = {
          param: {
            // byPhone: _this.query.byPhone,
            // callPhone: _this.query.callPhone,
            current: _this.hwCurrent,
            size: _this.hwSize,
            startTime: new Date().getTime() - 604800000,
            endTime: new Date().getTime()
          }
        }
        await selectLogAnalysis(data).then(res => {
          console.log(res)
          if (res.statusCode === '00000') {
            setTimeout(res => {
              _this.loading = false
            }, 300)
            _this.dataList = res.data.records
            _this.total = +res.data.total
          } else {
            _this.loading = false
          }
        })
      }
    },
    // 录音
    luyin(e) {
      console.log(e)
      this.lyUrl = e
      this.dialogVisible_ly = true
    },
    // 搜索
    search() {
      const _this = this
      _this.hwCurrent = 1
      // _this.hstTime = ''
      // _this.thisTime = ''
      _this.getlist()
      _this.hstTime = Date.parse(_this.formatDate(_this.query.time[0]))
      _this.thisTime = Date.parse(_this.formatDate(_this.query.time[1]))
      // console.log(Date.parse(_this.formatDate(_this.query.time[0])))
      // console.log(Date.parse(_this.formatDate(_this.query.time[1])))
    },
    // 获取一个月有多少天
    getCountDays() {
      var curDate = new Date()
      /* 获取当前月份 */
      var curMonth = curDate.getMonth()
      /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
      curDate.setMonth(curMonth + 1)
      /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
      curDate.setDate(0)
      /* 返回当月的天数 */
      this.day = curDate.getDate()
    },
    // 获取后3天时间
    getxztime() {
      const _this = this
      var xzData = new Date()
      var year = xzData.getFullYear()
      var month = xzData.getMonth() + 1
      var today = xzData.getDate() - 3
      var hours = xzData.getHours()
      var minutes = xzData.getMinutes()
      var seconds = xzData.getSeconds()
      console.log(this.day)
      if (_this.day > today) {
        if (today <= 0) {
          console.log('负数')
          month -= 1
          today = today + _this.day
        }
        if (+month === 0) {
          month = 12
          year -= 1
          console.log('等于0')
        }
        if (today > 0 && +month !== 0) {
          // today = _this.day -7
          console.log('不是负数，不等于0')
        }
      }
      var sztime = year + '-' + month + '-' + today + ' ' + hours + ':' + minutes + ':' + seconds
      this.hstTime = Date.parse(sztime)
      console.log(sztime)
    },
    SecondToDate(msd) {
      var time = msd

      if (time != null && time !== '') {
        if (time > 60 && time < 60 * 60) {
          time = parseInt(time / 60.0) + '分钟' + parseInt((parseFloat(time / 60.0) -

parseInt(time / 60.0)) * 60) + '秒'
        } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
          time = parseInt(time / 3600.0) + '小时' + parseInt((parseFloat(time / 3600.0) -

parseInt(time / 3600.0)) * 60) + '分钟' +

parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -

parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + '秒'
        } else if (time >= 60 * 60 * 24) {
          time = parseInt(time / 3600.0 / 24) + '天' + parseInt((parseFloat(time / 3600.0 / 24) -

parseInt(time / 3600.0 / 24)) * 24) + '小时' + parseInt((parseFloat(time / 3600.0) -

parseInt(time / 3600.0)) * 60) + '分钟' +

parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -

parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + '秒'
        } else {
          time = parseInt(time) + '秒'
        }
      }

      return time
    },
    // 获取当前日期
    getime() {
      // const _this = this
      var xzData = new Date()
      var year = xzData.getFullYear()
      var month = xzData.getMonth() + 1
      var today = xzData.getDate()
      var hours = xzData.getHours()
      var minutes = xzData.getMinutes()
      var seconds = xzData.getSeconds()
      var xztime = year + '-' + month + '-' + today + ' ' + hours + ':' + minutes + ':' + seconds
      this.thisTime = Date.parse(xztime)
      console.log(xztime)
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
.button{
  display: inline-block;
  padding: 4px 10px;
  background: #409eff;
  color:#fff;
  border-radius: 4px;
}
audio{
  outline: none;
}
.ls{
  color:#2acc69
}
.hs{
  color:#fb5e5e
}
</style>
