<template>
  <div class="dashboard-container">

    <div class="chart_box shaowAll">
      <div class="heardNum">
        <h3 class="Ptitle">号码库上传</h3>
        <p class="tips">请按模板填写相关信息,未指定用户将上传至公共号码库,上传后失败记录文件有效时间为一天</p>
      <!-- <a class="downLin2" href="https://htk-call.oss-cn-beijing.aliyuncs.com/excle/template/%E5%AE%A2%E6%88%B7%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%85%A5.xlsx">模板下载</a> -->
      </div>
      <div id="myChart" style="width:100%; ">
        <el-form ref="form" label-position="left" :model="queryUp" label-width="110px">
          <el-form-item label="模板下载">
            <a class="downLin2" href="https://htk-call.oss-cn-beijing.aliyuncs.com/excle/template/%E5%AE%A2%E6%88%B7%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%85%A5.xlsx">下载</a>
          </el-form-item>
          <el-form-item label="号码掩盖">
            <el-switch v-model="queryUp.delivery" @change="changeStatus" />
          </el-form-item>
          <el-form-item label="选择部门">
            <el-cascader
              v-model="queryUp.bumen"
              :options="bumenData"
              :props="{ checkStrictly: true }"
              style="width:180px"
              placeholder="请选择部门"
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item label="选择成员">
            <el-select v-model="queryUp.user" placeholder="请选择用户" @change="getUser1">
              <el-option
                v-for="item in userData"
                :key="item.uid"
                :label="item.name"
                :value="item.uid"
              />
            </el-select>
            <el-button type="danger" size="medium" style="margin-left:5px" @click="pushNull">清空选项</el-button>
          </el-form-item>
          <el-form-item label="号码上传">
            <el-upload
              class="upload-demo"
              style="width:30%"
              drag
              action
              accept=".xls, .xlsx"
              :http-request="uploadFile"
              :limit="1"
              :on-change="handlePreview"
              :on-remove="handleRemove"
              :auto-upload="true"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <!-- <div slot="tip" class="el-upload__tip">只能上传execl文件</div> -->
            </el-upload>
          </el-form-item>
        </el-form>

        <!-- <p class="fonNue">号码掩盖开关：<el-switch v-model="delivery" @change="changeStatus" /></p> -->
        <!-- <div class="checkPer">
          <el-cascader
            v-model="queryUp.bumen"
            :options="bumenData"
            :props="{ checkStrictly: true }"
            style="width:180px"
            placeholder="请选择部门"
            @change="handleChange"
          />
          <el-select v-model="queryUp.user" placeholder="请选择用户" style="width:180px;margin-left:10px" @change="getUser1">
            <el-option

              v-for="item in userData"
              :key="item.uid"
              :label="item.name"
              :value="item.uid"
            />
          </el-select>
          <el-button type="danger" size="mini" style="margin-left:5px" @click="pushNull">清空</el-button>
        </div> -->
        <!-- <el-upload
          class="upload-demo"
          style="margin-left:25px;margin-top:30px;width:30%"
          drag
          action
          accept=".xls, .xlsx"
          :http-request="uploadFile"
          :limit="1"
          :on-change="handlePreview"
          :on-remove="handleRemove"
          :auto-upload="true"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传execl文件</div>
        </el-upload> -->

      </div>
      <div class="heardNum">
        <h3 class="Ptitle">导入历史</h3>
        <p class="tips">每条记录均可下载预览</p>
      <!-- <a class="downLin2" href="https://htk-call.oss-cn-beijing.aliyuncs.com/excle/template/%E5%AE%A2%E6%88%B7%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%85%A5.xlsx">模板下载</a> -->
      </div>
      <div class="table_box">
        <el-table
          ref="zx-list-data-&quot;"
          v-loading="loading"
          :data="dataList"
          tooltip-effect="dark"
          style="width:95%;margin:10px auto 0px auto;"
          highlight-current-row
        >
          <el-table-column prop="fileName" label="上传文件名" />
          <el-table-column prop="importCount" label="导入数量" />
          <el-table-column prop="scount" label="成功数量" />
          <el-table-column prop="fcount" label="失败数量" />
          <el-table-column prop="createTime" label="上传时间">
            <template slot-scope="scope">
              {{ formatDate(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column width="150px" prop="createTime" label="失败信息">
            <template slot-scope="scope">
              <a v-if="scope.row.resUrl" class="downLin" :href="scope.row.resUrl">下载</a>
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
    </div>

  </div>
</template>

<script>
import { importTelLibrary, selectPageUploadLog, getAllDepartment, getUsersByDepartment, getCustomerSwitch, updateCustomerMaskStatus } from '@/api/framework'
// import FileSaver from 'file-saver'
import { getcustomerId, setMaskStatus } from '@/utils/auth'
export default {
  data() {
    return {
      queryUp: {
        delivery: false,
        bumen: '',
        user: ''
      },
      delivery: false,
      userUid: '',
      userData: [], // 选择用户
      bumenData: [], // 选择部门
      uploadData: {},
      yxhdlist: [], // 十条有效话单
      days: [], // 日期
      loading: false,
      lyUrl: '',
      dialogVisible: false,
      dataList: [],
      Current: 1, // 页码
      total: 0, // 总数
      Size: 10, // 一页多少条
      day: '',
      hstTime: '',
      thisTime: '',
      dialogVisible_ly: false
      // szData: '', // 前7天日期
      // day: ''
    }
  },
  mounted() {
    this.getlist()
    this.getmoreBumen()
    this.getCustomerSwitch()
  },
  methods: {
    pushNull() {
      this.queryUp.bumen = ''
      this.queryUp.user = ''
      this.userUid = ''
      this.userData = []
    },
    changeStatus(callback) {
      console.log(callback)
      var data = {
        param: {
          maskStatus: callback ? 1 : 0
        }
      }
      updateCustomerMaskStatus(data).then(res => {
        if (res.statusCode === '00000') {
          // this.isActive = res.data
          setMaskStatus(callback ? 1 : 0)
          // if (+res.data.maskStatus === 0) {
          //   this.delivery = false
          // } else if (+res.data.maskStatus === 1) {
          //   this.delivery = true
          // }
        }
      })
    },
    // 当前企业下客户开关状态查询
    async getCustomerSwitch() {
      var data = {
        param: {
        }
      }
      await getCustomerSwitch(data).then(res => {
        if (res.statusCode === '00000') {
          // this.isActive = res.data
          console.log(res)
          if (+res.data.maskStatus === 0) {
            this.queryUp.delivery = false
          } else if (+res.data.maskStatus === 1) {
            this.queryUp.delivery = true
          }
        }
      })
    },
    getUser1(e) {
      console.log(e)
      var obj = {}
      obj = this.userData.find((item) => item.uid === e)
      console.log(obj)
      this.userUid = obj.uid
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
          _this.bumenData = data
          console.log('11111111111111')
          console.log(_this.bumenData)
        }
      })
    },
    async handleChange(value) {
      console.log(value)
      this.queryUp.user = ''
      var data = {
        param: {
          departmentId: value[value.length - 1]
        }
      }
      await getUsersByDepartment(data).then(res => {
        console.log(res)
        if (res.statusCode === '00000') {
          this.userData = res.data
        }
      })
    },
    getlist() {
      const _this = this
      _this.loading = true
      var data = {
        param: {
          pageNum: this.Current,
          pageSize: this.Size
        }
      }
      selectPageUploadLog(data).then(res => {
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
        _this.$message.error('暂无数据~')
        _this.loading = false
        console.log(err)
      })
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
    // 删除时获取文件信息
    handleRemove(file) {
      console.log(file)
    },

    // 获取上传文件信息
    handlePreview(file) {
      const _this = this
      var formData = new FormData()
      console.log(file)
      console.log('-0----------->')
      formData.append('file', file.raw)
      formData.append('uid', this.userUid)

      _this.uploadData = formData

      console.log(_this.uploadData)
    },
    async uploadFile(e) {
      if (this.queryUp.bumen && !this.userUid) {
        this.$message({
          message: '请选择成员',
          type: 'warning'
        })
        this.$refs.upload.clearFiles()
        return
      }
      await importTelLibrary(this.uploadData).then(res => {
        if (res.statusCode === '00000') {
          console.log(res)
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.$refs.upload.clearFiles()
          this.getlist()
        } else {
          this.$message.error(res.status)
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

    // 下载
    xiazai(e) {
      console.log(e)
      // window.location.href = e
      // FileSaver.saveAs(e, '录音')
    },
    toNum(value) {
      if (!value) return 0
      return Math.ceil(value)
    }
  }
}
</script>

<style scoped>
.heardNum{
      margin-bottom: 24px;
    padding: 10px 0;
    font-size: 0;
    border-bottom: 1px solid #f5f5f5;

}
.tips{
  display: inline-block;
    font-size: 12px;
    color: #999;
        margin-left: 10px;
}
.shaowAll{
  /* box-shadow: 2px 4px 8px 8px rgba(0, 0, 0, 0.05); */
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
 padding: 20px;
}
.fenye{
    display: block;
    text-align: right;
    margin-top:20px;
}
.Ptitle{
      font-size: 18px;
    line-height: 18px;
    color: #222;
    font-weight: 700;
    /* padding: 12px; */
    display: inline-block;
}
#myChart{
  float:left;
  background: #fff;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
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
  background: #ffffff;
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
.fonNue{
  font-size: 16px;
    color: #707070;
    padding-left:30px;
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
    background: #00c48f;
    margin: 8px 0 30px 0;
  }
  .downLin{
    display: inline-block;
    padding: 3px 10px;
    background-color: #00c48f;
    color: #fff;
    border-radius: 3px;
  }
  .downLin2{
    /* display: inline-block; */
    padding: 8px 10px;
    background-color: #00c48f;
    color: #fff;
    font-size: 15px;
    border-radius: 3px;
    margin-bottom: 10px;
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
.checkPer{
  display: flex;
  padding-top: 15px;
  padding-left: 25px;
  width: 350px;
  justify-content: space-between;
}
</style>
