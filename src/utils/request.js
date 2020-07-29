import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import { removeToken, removeInfo, getRefreshToken, removeRefreshToken, removecustomerId } from '@/utils/auth'
import { getRefreshToken } from '@/utils/auth'
let needLoadingRequestCount = 0
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url=基本url+请求url
  // withCredentials:true，//跨域请求时发送cookies
  timeout: 5000, // 请求超时
  headers: {
    'Content-Type': 'application/json'
    // appToken: '77A6736D-5A05-4F8C-8B07-5E9F81D845C3' // 固定的渠道商token
  }
})

// 请求拦截器
service.interceptors.request.use(

  config => {
    // 在发出请求前做点什么
    if (store.getters.token) {
      // 让每个请求携带令牌
      // ['X-Token']是自定义头密钥
      // 请根据实际情况修改
      // config.headers['access_token'] = getToken()
      config.headers['Authorization'] = getToken()
      config.headers['refresh_token'] = getRefreshToken()
    }
    needLoadingRequestCount++
    return config
  },
  error => {
    // 处理请求错误
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果您想要获取诸如头或状态之类的http信息
   * 请返回response=>response
  */

  /**
   * 通过自定义代码确定请求状态
   * 这里只是一个例子
   * 您还可以通过HTTP状态代码判断状态
   */
  response => {
    const res = response.data
    console.log('88888888888888888888')
    console.log(res)
    // 如果自定义代码不是00000，则判断为错误。
    if (res.statusCode && res.statusCode !== '00000') {
      // if (response.statusCode === 401) {

      // }
      // 50008:非法令牌；50012:其他客户端登录；50014:令牌过期；
      if (res.statusCode === 401) {
        // removeToken()
        // removeRefreshToken()
        // // _thisMain.$router.push({ path: '/login' })
        // removeInfo()
        // removecustomerId()
        // localStorage.removeItem('buttons')
        // Message({
        //   message: '登录时间失效，请重新登录',
        //   type: 'error',
        //   duration: 5 * 1000
        // })
        // return
        console.log(needLoadingRequestCount)
        if (needLoadingRequestCount > 1) {
          needLoadingRequestCount = 0
          MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          })
        }

        // return Promise.resolve(res || 'error')
      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      // return Promise.reject(new Error(res.message || 'Error'))
      return Promise.resolve(res || 'error')
    } else {
      needLoadingRequestCount--
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    console.log(error.response.status)
    // debugger
    if (+error.response.status === 400) {
      Message({
        message: '请检查参数是否正确',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    } else {
      Message({
        message: '网络开小差了，请重试一下~',
        type: 'error',
        duration: 5 * 1000
      })
    }
    // if(){

    // }
  }
)

export default service
