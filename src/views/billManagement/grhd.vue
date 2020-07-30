<template>
  <div class="grhd_box shaowAll">
    <p class="Ptitle">个人话单</p>
    <el-table
      ref="zx-list-data-&quot;"
      v-loading="loading"
      :data="dataList"
      tooltip-effect="dark"
      style="width:95%;margin:10px auto 20px auto;"
      highlight-current-row
    >
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column prop="gid" label="流水号" />
      <el-table-column prop="activeNum" label="主叫号码" />
      <el-table-column prop="passiveNum" label="被叫号码">
        <template slot-scope="scope">
          {{ formatPhone(scope.row.passiveNum) }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="answerStatus" label="接通状态" /> -->
      <el-table-column prop="answerStatus" label="接通状态">
        <template slot-scope="scope">
          <span v-if="scope.row.answerStatus ==='已接通'" class="ls">{{ scope.row.answerStatus }}</span>
          <span v-else class="hs">{{ scope.row.answerStatus||'未知' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="billsec" label="通话时长">
        <template slot-scope="scope">
          {{ SecondToDate(scope.row.billsec) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="呼叫时间">
        <template slot-scope="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="callEndTime" label="结束时间">
          <template slot-scope="scope">
            {{ formatDate(scope.row.callEndTime) }}
          </template>
        </el-table-column> -->
      <el-table-column label="录音" width="50">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="small" :disabled="!scope.row.billsec||!scope.row.recordFileUrl" @click="xiugaiZx(scope.row)">录音详情</el-button> -->
          <div class="icon_box" title="录音详情">
            <svg-icon v-if="scope.row.recordFileUrl" class="icon" style="width:30px;height:30px;" icon-class="luyin" @click="luyin(scope.row.recordFileUrl)" />
            <svg-icon v-else class="icon" style="width:30px;height:30px;color:#dbdbdb" icon-class="luyin" />
            <!-- <a :href="scope.row.recordFileUrl" :download="scope.row.recordFileUrl"> -->
            <!-- <svg-icon class="icon" style="width:30px;height:30px" icon-class="xiazai" @click="xiazai(scope.row.recordFileUrl)" /> -->
            <!-- </a> -->
          </div>
          <!-- <a class="button" :href="lyUrl" target="_blank" @click="xiugaiZx(scope.row)">录音详情</a> -->
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
import { findUserCallLogPage } from '@/api/framework'
import { getMaskStatus } from '@/utils/auth'
export default {
  data() {
    return {
      loading: false,
      lyUrl: '',
      dataList: [],
      Current: 1, // 页码
      total: 0, // 总数
      Size: 10, // 一页多少条
      day: '',
      hstTime: '',
      thisTime: '',
      dialogVisible_ly: false
    }
  },
  mounted() {
    this.getCountDays()
    this.getxztime()
    this.getime()
    this.getlist()
  },
  methods: {
    formatPhone(phone) {
      debugger
      if (+getMaskStatus()) {
        return `${phone.substr(0, phone.length - 4)}****`
      } else {
        return phone
      }
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
        _this.lyUrl = e.recordFileDownloadUrl
        window.open(_this.lyUrl, '_blank')
      } else {
        _this.lyUrl = e.ossUrl
        window.open(_this.lyUrl, '_blank')
      }
    },
    getlist() {
      const _this = this
      _this.loading = true
      var data = {
        param: {
          current: this.Current,
          size: this.Size,
          startTime: _this.hstTime,
          endTime: _this.thisTime
        }
      }
      findUserCallLogPage(data).then(res => {
        if (res.statusCode === '00000') {
          setTimeout(res => {
            _this.loading = false
          }, 300)
          _this.dataList = res.data.records
          _this.total = +res.data.total
        } else {
          _this.loading = false
        }
      }).catch(err => {
        _this.$message.error('该账号未绑定坐席')
        _this.loading = false
        console.log(err)
      })
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
    // 录音
    luyin(e) {
      console.log(e)
      this.lyUrl = e
      this.dialogVisible_ly = true
    },
    // 分页
    handleSizeChange(val) {
      this.Size = val
      this.getlist()
    },
    handleCurrentChange(val) {
      this.Current = val
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
      var today = xzData.getDate() - 7
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
      console.log(this.hstTime)
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
.Ptitle{
      font-size: 18px;
    line-height: 18px;
    color: #222;
    font-weight: 700;

}
.grhd_box{
  margin:20px;
}
.fenye{
    display: block;
    text-align: right;
    margin-top:20px;
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
