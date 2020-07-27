
import store from './store'
// import router from './router'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从cookie中获取令牌
import getPageTitle from '@/utils/get-page-title'
import router from '@/router'
// import Layout from '@/layout'
NProgress.configure({ showSpinner: false }) // NProgress配置

const whiteList = ['/login', '/loginForward'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  console.log('----------------=============')

  // 确定用户是否已登录
  const hasToken = getToken()
  console.log('看有没有token')
  console.log(getToken())
  debugger
  if (hasToken) {
    debugger
    if (to.path === '/login') {
      debugger
      // 如果已登录，请重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      debugger
      // 确定用户是否通过getinfo获取了权限角色
      const hasGetUserInfo = store.getters.name
      console.log(hasGetUserInfo)
      debugger
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          console.log('从那个页面来')
          console.log(to, from)
          // 获取用户信息
          var data = await store.dispatch('user/getInfo')
          console.log(data)
          debugger
          // console.log('11111111111' + getInfo())
          // resetRouter()
          const accessRoutes = await store.dispatch('permission/generateRoutes', data)
          console.log(accessRoutes)
          console.log('-------11111111111111112222222222222222222-------')
          router.addRoutes(accessRoutes)
          // selfaddRoutes(accessRoutes)
          // debugger
          // next({ ...to, replace: true })
          next({ path: '/cxLrs/admin/homePage' })
          console.log(to, from)
          // next({ ...to, replace: true })
        } catch (error) {
          // 移除令牌并转到登录页以重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 没有 token*/
    console.log('------------3333333334----=============')
    console.log(to.path)
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免费登录白名单中，直接进入
      console.log('------------5555555666666666----=============')
      next()
    } else {
      // 没有访问权限的其他页将重定向到登录页.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})
