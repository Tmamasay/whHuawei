<template>
  <div class="dashboard-container">
    <!-- <div class="title_box">
      <p>近七天公司数据</p>
      <span class="line" />
    </div> -->
    <div class="chart_box shaowAll" style="width: 85%">
      <p class="Ptitle">常用功能</p>
      <div id="myChart" style="width: 100%;height:140px">
        <div class="itemDi">
          <p class="D1">拨打数量</p>
          <p class="D2">{{ today.callTotalNum||0 }}</p>
        </div>
        <div class="itemDi">
          <p class="D1">接通数量</p>
          <p class="D2">{{ today.succNum===null||!today.succNum?"0": today.succNum }}</p>
        </div>
        <div class="itemDi">
          <p class="D1">通话时长</p>
          <p class="D2">{{ today.totalTime===null||!today.totalTime?'0':today.totalTime }}</p>
        </div>
        <div class="itemDi">
          <p class="D1">接通率</p>
          <p class="D2">{{ today.onRate===null||!today.onRate?"0": toNum(today.onRate*100) }}%</p>
        </div>
      </div>

    </div>
    <div class="chart_box shaowAll" style="width: 85%;margin-top:30px">
      <p class="Ptitle">今日数据概览</p>
      <div id="myChart" style="width: 100%;height:140px">
        <div class="itemDi">
          <div class="DM1">
            <img src="@/assets/home/phone.png" alt="" srcset="">
          </div>
          <p class="D2">外呼</p>
        </div>
        <div class="itemDi">
          <p class="D1">接通数量</p>
          <p class="D2">{{ today.succNum===null||!today.succNum?"0": today.succNum }}</p>
        </div>
        <div class="itemDi">
          <p class="D1">通话时长</p>
          <p class="D2">{{ today.totalTime===null||!today.totalTime?'0':today.totalTime }}</p>
        </div>
        <div class="itemDi">
          <p class="D1">接通率</p>
          <p class="D2">{{ today.onRate===null||!today.onRate?"0": toNum(today.onRate*100) }}%</p>
        </div>
      </div>

    </div>

    <div class="table_box">
      <div class="title_box">
        <p>当日坐席通话情况</p>
        <span class="line" />
      </div>
      <el-table
        ref="zx-list-data-&quot;"
        v-loading="loading"
        :data="yxhdlist"
        tooltip-effect="dark"
        style="width: 100%;"
        border
        empty-text="最近30天暂无数据"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="uname" label="成员" />
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
        <!-- <el-table-column prop="callExpense" label="通话费用(元)">
          <template slot-scope="scope">
            {{ scope.row.callExpense/100 }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column> -->
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
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal="false"
        :before-close="handleClose"
      >
        <div style="text-align: center">
          <audio id="audio" :src="lyUrl" controls />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { selectLatelyCompanyData, manageFindCallCensusNum, selectYesterdayTop10 } from '@/api/framework'
// import FileSaver from 'file-saver'
export default {
  data() {
    return {
      bd_num: [], // 拨打数
      jt_num: [], // 接通数
      thsc_num: [], // 通话时长
      today: [], // 当日情况
      yxhdlist: [], // 十条有效话单
      days: [], // 日期
      loading: false,
      lyUrl: '',
      dialogVisible: false,
      Size: 10, // 一页多少条
      Current: 1, // 页码
      total: 0 // 总数
      // szData: '', // 前7天日期
      // day: ''
    }
  },
  mounted() {
    // 7天的走势
    this.getqiday()
    // 当日通话情况
    this.gettoday()
    // 近十条有效话单
    this.gethd()
    // 秒转换时分秒
    // this.getCountDays()
    this.SecondToDate()
    setTimeout(res => {
      // this.drawLine()
      // this.drawLine2()
    }, 300)
  },
  methods: {
    toNum(value) {
      if (!value) return 0
      return Math.ceil(value)
    },
    // 分页
    handleSizeChange(val) {
      this.Size = val
      this.gethd()
    },
    handleCurrentChange(val) {
      this.Current = val
      this.gethd()
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          // text: '总概览'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // cross
            type: 'none',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['拨打数', '接通数']
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.days

          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '拨打数',
            type: 'line',
            data: this.bd_num,
            color: '#09b2c7'
          },

          {
            name: '接通数',
            type: 'line',
            data: this.jt_num,
            color: '#4da851'
          }

        ]
      })
    },

    drawLine2() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('myChart2'))
      // 绘制图表
      myChart.setOption({
        title: {
          // text: '总概览'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none',
            label: {
              backgroundColor: '#6a7985'
            }
          }

        },
        legend: {
          data: ['通话时长']
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.days
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '通话时长',
            type: 'line',
            data: this.thsc_num,
            color: '#09b2c7'
          }

        ]
      })
    },
    // 弹窗关闭，音频暂停
    handleClose() {
      var audio = document.getElementById('audio')
      audio.pause()
      this.dialogVisible = false
    },
    // 转换时分秒
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
    // 获取一个月有多少天
    // getCountDays() {
    //   var curDate = new Date()
    //   /* 获取当前月份 */
    //   var curMonth = curDate.getMonth()
    //   /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
    //   curDate.setMonth(curMonth + 1)
    //   /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
    //   curDate.setDate(0)
    //   /* 返回当月的天数 */
    //   this.day = curDate.getDate()
    //   console.log(this.day)
    // },
    // 获取上周时间
    // getsztime() {
    //   const _this = this
    //   var szData = new Date()
    //   var year = szData.getFullYear()
    //   var month = szData.getMonth() + 1
    //   var today = szData.getDate() - 8
    //   // var bcmonth = szData.getMonth()// 用来判断是否是当前月份
    //   if (_this.day > today) {
    //     if (today <= 0) {
    //       console.log('负数')
    //       month -= 1
    //       today = today + _this.day
    //     }
    //     if (+month === 0) {
    //       month = 12
    //       year -= 1
    //       console.log('等于0')
    //     }
    //     if (today > 0 && +month !== 0) {
    //       // today = _this.day -7
    //       console.log('不是负数，不等于0')
    //     }
    //   }
    //   _this.szData = year + '-' + month + '-' + today
    // },
    // 7天的走势
    getqiday() {
      const _this = this
      selectLatelyCompanyData({}).then(res => {
        console.log(res)
        // this.getsztime()
        // var nodaylist = { days: _this.szData, totalDuration: '0', totalNum: '0', succNum: '0' }

        if (res.statusCode === '00000') {
          // var arr = []
          // if (res.data.length === 6) {
          //   for (let i = 0; i < 7; i++) {
          //     var num = parseInt(nodaylist.days.split('-')[2]) + i
          //     var time = nodaylist.days.split('-')[0] + '-' + nodaylist.days.split('-')[1] + '-' + num
          //     console.log(time)
          //     // nodaylist[i].days = time
          //     arr.push(nodaylist)
          //     arr[i].days = time
          //   }
          //   console.log('111111111111')
          //   console.log(arr)
          // }

          res.data.forEach(item => {
            console.log(item.callCount)
            if (item.callCount === null) {
              item.callCount = 0
            }
            if (item.callConnectedCount === null) {
              item.callConnectedCount = 0
            }
            if (item.duration === null) {
              item.duration = 0
            }
            _this.bd_num.push(item.callCount)// 拨打数
            _this.jt_num.push(item.callConnectedCount)// 接通数
            _this.thsc_num.push(item.duration)// 通话时长
            _this.days.push(_this.formatDate1(item.statisticalStartTime))// 日期
          })
        }
      })
    },
    // 当日通话情况
    gettoday() {
      manageFindCallCensusNum({}).then(res => {
        console.log('1111111222222222222222222222222222222211111')
        console.log(res)
        if (res.statusCode === '00000') {
          this.today = res.data

          console.log(this.today)
        }
      })
    },
    // 近十条有效话单
    gethd() {
      selectYesterdayTop10({
        param: {
          pageNum: this.Current,
          pageSize: this.Size
          // orderList: [{
          //   call_count: true
          // }]
        }
      }).then(res => {
        console.log(res)
        //
        if (res.statusCode === '00000') {
          this.yxhdlist = res.data.records
          this.total = res.data.total
        }
      })
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
    // 时间戳转换
    formatDate1(value) {
      const date = new Date(value)
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      // let h = date.getHours()
      // h = h < 10 ? ('0' + h) : h
      // let m = date.getMinutes()
      // m = m < 10 ? ('0' + m) : m
      // let s = date.getSeconds()
      // s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d
    },
    // 录音
    luyin(e) {
      console.log(e)
      this.lyUrl = e
      this.dialogVisible = true
    },
    // 下载
    xiazai(e) {
      console.log(e)
      // window.location.href = e
      // FileSaver.saveAs(e, '录音')
    }
  }
}
</script>

<style scoped>
.shaowAll{
  /* box-shadow: 2px 4px 8px 8px rgba(0, 0, 0, 0.05); */
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);

}
.Ptitle{
      font-size: 18px;
    line-height: 18px;
    color: #222;
    font-weight: 700;
    padding: 12px;
}
.itemDi{
  width: 150px;
  text-align: center;
}
.D1{
      font-size: 14px;
    color: #999;
    line-height: 15px;
    margin-bottom: 14px;
}
.DM1{
  width: 70px;
  height: 70px;
}
.DM1 img{
  width: 100%;
  height: 100%;

}
.D2{
font-size: 34px;
    color: #333;
    line-height: 36px;
    margin-bottom: 20px;
}
#myChart{
  display: flex;
  justify-content: space-around;
  align-items: center;
}
#myChart2{
  float:left;
  background: #fff;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.chart_box{
  overflow: hidden;
}
.dashboard-container{
  background: #fff;
  padding:20px;
  overflow: auto;
}
.dashboard-container::-webkit-scrollbar{

   display:none;

}
.drqk_box{
  margin-top:50px;
  clear: both;
  /* box-shadow: 0px 0px 5px #d2d2d2; */
  overflow: hidden;
  padding-bottom:10px;
}
.title_box p{
    font-size: 24px;
    color: #363636;
    margin:0;
  }
  .title_box .line{
    display: block;
    width: 34px;
    height: 4px;
    background: #1c6feb;
    margin: 8px 0 30px 0;
  }
  .title{
    font-weight: 600;
    font-size: 18px;
    margin-top:50px;
  }
.drqk_box .content_box{
  /* width:320px; */
  width:16.5%;
  height:100px;
  background: #fff;
  float:left;
  margin-left:122px;
  box-shadow: 0px 0px 5px #d2d2d2;
  border-radius: 5px;
  margin-top:20px;
}
.drqk_box .content_box .img{
  width:90px;
  height:90px;
  background: #fc9208;
  border-radius: 5px;
  position: relative;
  top: -40px;
  left: 20px;
  box-shadow: 0px 10px 15px #eee;
  display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    float:left;
}
.drqk_box .content_box:nth-of-type(3) .img{
  background: #09b2c7;
}
.drqk_box .content_box:nth-of-type(4) .img{
  background: #e8413d;
}
.drqk_box .content_box:nth-of-type(5) .img{
  background: #4da851;
}
.drqk_box .content_box div{
  float:right;
  margin-right:20px;
  text-align: right;
}
.drqk_box .content_box div p{
  color:#9f9f9f;
  font-size:14px;
}
.table_box .title_box{
  margin-top:50px;
}
.icon{
  cursor: pointer;
}
.icon_box .svg-icon:hover{
  color:#1c6feb;
}
audio{
  outline: none;
}
.drqk_box .content_box .img .svg-icon{
  width:30px;
  height:30px;
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
.fenye{
    display: block;
    text-align: right;
    margin-top:20px;
    margin-bottom: 30px;
}
</style>
