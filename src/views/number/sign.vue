<template>
  <div class="dashboard-container">

    <div class="chart_box shaowAll">
      <div class="heardNum">
        <h3 class="Ptitle">签名管理</h3>
        <el-button v-if="!SignList.length" size="small" class="tips" @click="addSign">新增签名</el-button>
      </div>
      <!-- <a v-if="!SignList.length" class="downLin2" @click="addSign">新增签名</a> -->
      <div id="myChart" style="width:100%;padding:15px">
        <el-table
          ref="zx-list-data-&quot;"
          v-loading="loading"
          :data="SignList"
          tooltip-effect="dark"
          style="width:95%;margin:10px auto 20px auto;"
          highlight-current-row
        >
          <el-table-column prop="siginId" label="签名id" />
          <el-table-column prop="smsSign" label="短信签名" />
          <el-table-column prop="signTrial" label="审核状态">
            <template slot-scope="scope">
              {{ +scope.row.signTrial===0?'未审查':+scope.row.signTrial===1?'审查通过':+scope.row.signTrial===2?'审查未通过':'未知' }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间">
            <template slot-scope="scope">
              {{ formatDate(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column width="150px" prop="createTime" label="操作">
            <template slot-scope="scope">
              <p class="downLin" @click="delSign(scope.row)">删除</p>
            </template>
          </el-table-column>

          <!-- <el-table-column width="150px" prop="createTime" label="操作">
            <template slot-scope="scope">
              <p class="downLin" @click="edit(scope.row)">编辑</p>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <div class="heardNum">
        <h3 class="Ptitle">模板管理</h3>
        <el-button v-if="dataList.length<6" size="small" class="tips" @click="addSmsTemple">新增模板</el-button>
        <el-button v-if="dataList.length>0" size="small" class="tips" @click="checkSmsTemple">启用模板</el-button>
      </div>
      <div id="myChart" style="width:100%; height:350px;padding:15px">
        <el-table
          ref="zx-list-data-&quot;"
          v-loading="loading"
          :data="dataList"
          tooltip-effect="dark"
          style="width:95%;margin:10px auto 20px auto;"
          highlight-current-row
        >
          <!-- <el-table-column prop="templateId" label="模板id" /> -->
          <el-table-column prop="templateName" label="模板名称" />
          <el-table-column prop="smsStatus" label="是否启用">
            <template slot-scope="scope">
              <p v-if="scope.row.templateId===isActive.templateId">{{ isActive.smsStatus==1?'半开(只对拨打成功的话单发送短信!)':isActive.smsStatus==2?'半开(对未接通的话单发送短信!)':isActive.smsStatus==3?'全开(对所有的话单发送短信!)':'未知' }}</p>
              <p v-else>未启用</p>
            </template>
          </el-table-column>
          <el-table-column prop="smsTemplate" label="模板内容" />
          <el-table-column prop="smsTrial" label="审核状态">
            <template slot-scope="scope">
              {{ +scope.row.smsTrial===0?'未审查':+scope.row.smsTrial===1?'审查通过':+scope.row.smsTrial===2?'审查未通过':'未知' }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间">
            <template slot-scope="scope">
              {{ formatDate(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column width="150px" prop="createTime" label="操作">
            <template slot-scope="scope">
              <p class="downLin" @click="delLine(scope.row)">删除</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="table_box">
      <el-dialog
        title="短信签名"
        :visible.sync="SignDialogFormVisible"
        class="changeIn"
        :close-on-click-modal="false"
        style="width:840px;margin:0 auto;"
      >
        <el-form ref="forgetForm" class="wkmm" :model="formSign" :rules="formSignRule">
          <el-form-item label prop="smsSign" style="width:100%;border: 1px solid rgba(255, 255, 255, 0.5)">
            <el-input v-model="formSign.smsSign" autocomplete="off" placeholder="请输入短信签名" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="SignDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click.native="findSubmit">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="短信模板"
        :visible.sync=" SmsTempleDialogFormVisible"
        class="changeIn"
        :close-on-click-modal="false"
        style="width:840px;margin:0 auto;"
      >
        <el-form ref="smsTemplate" class="wkmm" :model="formSmsTemple" :rules="formSmsTempleRule">
          <el-form-item label prop="templateName" style="width:100%;border: 1px solid rgba(255, 255, 255, 0.5)">
            <el-input v-model="formSmsTemple.templateName" autocomplete="off" placeholder="请输入短信模板名称" />
          </el-form-item>
          <el-form-item label prop="smsTemplate" style="width:100%;border: 1px solid rgba(255, 255, 255, 0.5)">
            <el-input v-model="formSmsTemple.smsTemplate" type="textarea" placeholder="请输入短信模板" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="SmsTempleDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click.native="smsTemplateSubmit">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="启用模板"
        :visible.sync="checkSmsTempleDialogFormVisible"
        class="changeIn"
        :close-on-click-modal="false"
        style="width:840px;margin:0 auto;"
      >
        <el-form ref="smsTemplate" class="wkmm" :model="customerSmsTemple" :rules="customerSmsTempleRule">
          <el-form-item v-if="dataList.length" label="模板列表" prop="smsId" style="width:100%;border: 1px solid rgba(255, 255, 255, 0.5)">
            <!-- <el-input v-model="formSmsTemple.templateName" autocomplete="off" placeholder="请输入短信模板名称" /> -->
            <el-select v-model="customerSmsTemple.smsId" placeholder="请选择模板名称">
              <el-option v-for="item in dataList" :key="item.id" :label="item.templateName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态选择" prop="smsStatus" style="width:100%;border: 1px solid rgba(255, 255, 255, 0.5)">
            <el-select v-model="customerSmsTemple.smsStatus" placeholder="请选择模板名称">
              <el-option label="短信开关关闭状态" value="0" />
              <el-option label="半开(只对拨打成功的话单发送短信!) " value="1" />
              <el-option label="半开(对未接通的话单发送短信!)" value="2" />
              <el-option label="全开(对所有的话单发送短信!)" value="3" />
            </el-select>
            <!-- <el-input v-model="formSmsTemple.smsTemplate" type="textarea" placeholder="请输入短信模板" /> -->
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="checkSmsTempleDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click.native="changeRule">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { addSmsSign, delSmsSign, updateCustomerSmsStatus, addSmsTemple, deleteSmsTemple, selectSmsTempleList, selectSignList, getCustomerSwitch } from '@/api/framework'
// import FileSaver from 'file-saver'
export default {
  data() {
    return {
      isActive: 0, // 是否启用短信模板
      SignDialogFormVisible: false, // 签名模态
      SmsTempleDialogFormVisible: false, // 短信模板SmsTemple
      checkSmsTempleDialogFormVisible: false, // 短信模板SmsTemple
      signId: '', // 签名id
      SignList: [],
      formSign: {
        smsSign: ''
      },
      formSmsTemple: {
        smsTemplate: '',
        templateName: ''
      },
      customerSmsTemple: {
        smsId: '',
        smsStatus: '0'
      },
      uploadData: {},
      yxhdlist: [], // 十条有效话单
      days: [], // 日期
      loading: false,
      lyUrl: '',
      dialogVisible: false,
      dataList: [],
      day: '',
      hstTime: '',
      thisTime: '',
      dialogVisible_ly: false,
      // szData: '', // 前7天日期
      // day: ''
      formSignRule: {
        smsSign: [{ required: true, message: '请输入短信签名', trigger: 'blur' }]
      },
      formSmsTempleRule: {
        templateName: [{ required: true, message: '请输入短信模板名称', trigger: 'blur' }],
        smsTemplate: [{ required: true, message: '请输入短信模板', trigger: 'blur' }]
      },
      customerSmsTempleRule: {
        smsId: [{ required: true, message: '请选择短信模板', trigger: 'change' }],
        smsStatus: [{ required: true, message: '请选择开关类型', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getSignList()
    this.getlist()
    this.getCustomerSwitch()
  },
  methods: {
    // 当前企业下客户开关状态查询
    async getCustomerSwitch() {
      var data = {
        param: {
        }
      }
      await getCustomerSwitch(data).then(res => {
        if (res.statusCode === '00000') {
          this.isActive = res.data
          console.log(res)
        }
      })
    },
    delSign(row) {
      const _this = this
      var data = {
        data: row.id
      }
      delSmsSign(data).then(res => {
        if (res.statusCode === '00000') {
          _this.$message({
            message: '操作成功',
            type: 'success',
            duration: 3 * 1000
          })
          _this.getSignList()
        }
      }).catch(err => {
        _this.$message.error('暂无数据~')
        _this.loading = false
        console.log(err)
      })
    },
    delLine(row) {
      const _this = this
      var data = {
        data: row.id
      }
      deleteSmsTemple(data).then(res => {
        if (res.statusCode === '00000') {
          _this.$message({
            message: '操作成功',
            type: 'success',
            duration: 3 * 1000
          })
          _this.getlist()
        }
      }).catch(err => {
        _this.$message.error('暂无数据~')
        _this.loading = false
        console.log(err)
      })
    },
    // 新增签名
    findSubmit() {
      this.$refs.forgetForm.validate(valid => {
        if (valid) {
          const data = {
            param: {
              smsSign: this.formSign.smsSign

            }
          }
          addSmsSign(data).then(res => {
            if (res.statusCode === '00000') {
            //   this.$message({
            //     message: '密码重置成功',
            //     type: 'success',
            //     duration: 3 * 1000
            //   })
              this.formSign = {
                smsSign: ''
              }
              this.SignDialogFormVisible = false
              this.getSignList()
            }
          })
        }
      })
    },
    // 新增签名
    smsTemplateSubmit() {
      this.$refs.smsTemplate.validate(valid => {
        if (valid) {
          const data = {
            param: {
              smsTemplate: this.formSmsTemple.smsTemplate,
              templateName: this.formSmsTemple.templateName
            }
          }
          addSmsTemple(data).then(res => {
            if (res.statusCode === '00000') {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.formSmsTemple = {
                smsTemplate: '',
                templateName: ''
              }
              this.SmsTempleDialogFormVisible = false
              this.getlist()
            }
          })
        }
      })
    },
    // 当前企业下客户挂机短信开关 更改
    changeRule() {
      const data = {
        param: {
          signId: this.signId,
          smsId: this.customerSmsTemple.smsId,
          smsStatus: +this.customerSmsTemple.smsStatus
        }
      }
      updateCustomerSmsStatus(data).then(res => {
        if (res.statusCode === '00000') {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 3 * 1000
          })
          this.formSmsTemple = {
            smsId: '',
            smsStatus: ''
          }
          this.checkSmsTempleDialogFormVisible = false
          this.getlist()
        //   this.getlist()
        }
      })
    },
    addSign() {
      this.SignDialogFormVisible = true
    },
    addSmsTemple() {
      this.SmsTempleDialogFormVisible = true
    },
    checkSmsTemple() {
      this.checkSmsTempleDialogFormVisible = true
    },
    getSignList() {
      const _this = this
      _this.loading = true
      var data = {
        param: {
        }
      }
      selectSignList(data).then(res => {
        if (res.statusCode === '00000') {
          setTimeout(res => {
            _this.loading = false
          }, 300)
          _this.SignList = res.data
          _this.signId = res.data[0].id
        } else {
          _this.loading = false
        }
      }).catch(err => {
        _this.$message.error('暂无数据~')
        _this.loading = false
        console.log(err)
      })
    },
    getlist() {
      const _this = this
      _this.loading = true
      var data = {
        param: {
        }
      }
      selectSmsTempleList(data).then(res => {
        if (res.statusCode === '00000') {
          setTimeout(res => {
            _this.loading = false
          }, 300)
          _this.dataList = res.data
        } else {
          _this.loading = false
        }
      }).catch(err => {
        _this.$message.error('暂无数据~')
        _this.loading = false
        console.log(err)
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
.Ptitle{
      font-size: 18px;
    line-height: 18px;
    color: #222;
    font-weight: 700;
    /* padding: 12px; */
    display: inline-block;
}
.fenye{
    display: block;
    text-align: right;
    margin-top:20px;
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
    cursor: pointer;
  }
  .downLin2{
    display: inline-block;
    padding: 6px 10px;
    background-color: #00c48f;
    color: #fff;
    font-size: 15px;
    border-radius: 3px;
    margin-bottom: 10px;
    cursor: pointer;
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
</style>
