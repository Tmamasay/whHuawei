// import { asyncRoutes, constantRoutes } from '@/router'
import { constantRoutes } from '@/router'
// import { getqxbutton } from '@/utils/auth'
import Layout from '@/layout'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}
// 定义子路由跳转页面
export const componentsMap = {
  homePage: () => import('@/views/dashboard/busIndex'), // 控制台-首页
  managerHomePage: () => import('@/views/dashboard/index'), // 控制台-首页
  Recharge: () => import('@/views/kzt_admin/cz'), // 控制台-充值
  recordsHistory: () => import('@/views/kzt_admin/xfjl'), // 控制台-消费记录
  orderHistory: () => import('@/views/kzt_admin/ddjl'), // 控制台-订单记录
  seatManagement: () => import('@/views/seats_admin/index'), // 坐席管理
  seatHistoryLogs: () => import('@/views/billManagement/history'), // 历史
  roleManagement: () => import('@/views/power/index'), // 角色管理
  organizationalStructure: () => import('@/views/organizational_structure/index'), // 组织架构
  departmentManagement: () => import('@/views/organizational_structure/index'),
  personnelManagement: () => import('@/views/organizational_structure/index'),
  callRecords: () => import('@/views/billManagement/index'),
  personalRecords: () => import('@/views/billManagement/grhd'),
  uploadCustomer: () => import('@/views/number/index'),
  customerResource: () => import('@/views/number/allNumber'),
  privateResource: () => import('@/views/number/perNumber'),
  templateManager: () => import('@/views/number/sign'),
  smsLog: () => import('@/views/number/personalMes')
}
/**
 *对component的处理
 * @param item
 * @param isParent //是否是子路由
 */
const qxbuttonlist = []
function generateRouter(item, isParent) {
//   const reg = /(http|https):\/\/([\w.]+\/?)\S*/
  // const qxbuttonlist = []
  if (item.buttons.length) {
    // const key = `${item.id}`
    const obj = {
      mid: item.id,
      buttons: item.buttons
    }
    qxbuttonlist.push(obj)
  }

  console.log(item.buttons)
  console.log('0------------0000000---------')
  // item.children.forEach(res => {
  //   console.log(res)
  //   // qxbuttonlist.push(child.id[child.buttons])
  //   // console.log(child.id, child.buttons)
  // })
  // setqxbutton(qxbuttonlist)
  var router = {}
  debugger
  const fmeta = { title: item.menuName, affix: false }
  // const cmeta = { title: `${item.menuName}` }
  const ccomponent = isParent ? '1' : item.menuCode
  const otherU = item.menuCode
  // console.log('===========------------->')
  // console.log(otherU)
  router = {
    path: otherU ? `/cxLrs/admin/${otherU}` : `#${item.id}`,
    name: item.menuName,
    meta: {
      title: fmeta.title,
      icon: item.icon,
      id: item.id
    },
    // component: isParent ? Layout : () => import(item.component)
    component: isParent ? Layout : componentsMap[ccomponent]
  }
  return router
}
/**
 *将后台的路由表进行格式化
 * @param {*} asyncRouterMap
 */
function convertRouter(asyncRouterMap) {
  const accessedRouters = []
  if (asyncRouterMap) {
    var kzt_icon = ['kzt', 'kzt_cz', 'kzt_index', 'kzt_xfjl', 'kz_qy']// 控制台
    var zzjg_icon = ['zzjg', 'zzjg1']// 组织架构
    var zxgl_icon = ['zxgl', 'zxgl1', 'zxglhis']// 坐席管理
    var hdgl_icon = ['hdgl', 'hdgl_zl', 'hdgl_gr']// 话单管理
    var xtgl_icon = ['xtgl', 'xtgl_js']// 系统管理
    var mes_icon = ['message']// 系统管理
    var phone_icon = ['phone']// 系统管理
    asyncRouterMap.forEach(item => {
      // this.set(item, 0, arricon[0])
      switch (item.menuName) {
        case '控制台':
          item.icon = kzt_icon[0]
          break
        case '组织架构':
          item.icon = zzjg_icon[0]
          break
        case '坐席管理':
          item.icon = zxgl_icon[0]
          break
        case '话单管理':
          item.icon = hdgl_icon[0]
          break
        case '系统管理':
          item.icon = xtgl_icon[0]
          break
        case '挂机短信':
          item.icon = mes_icon[0]
          break
        case '号码库':
          item.icon = phone_icon[0]
          break
        default:
          break
      }
      var parent = generateRouter(item, true)
      var children = []
      if (item.children.length) {
        item.children.forEach(child => {
          console.log(child)
          // switch (child.menuName) {
          //   case '首页':
          //     child.icon = kzt_icon[2]
          //     break
          //   case '企业管理':
          //     child.icon = kzt_icon[4]
          //     break
          //   case '充值':
          //     child.icon = kzt_icon[1]
          //     break
          //   case '组织架构':
          //     child.icon = zzjg_icon[1]
          //     break
          //   case '坐席管理':
          //     child.icon = zxgl_icon[1]
          //     break
          //   case '坐席历史通话记录':
          //     child.icon = zxgl_icon[2]
          //     break
          //   case '话单总览':
          //     child.icon = hdgl_icon[1]
          //     break
          //   case '个人话单':
          //     child.icon = hdgl_icon[2]
          //     break
          //   case '角色管理':
          //     child.icon = xtgl_icon[1]
          //     break
          //   case '消费记录':
          //     child.icon = kzt_icon[3]
          //     break
          //   default:
          //     break
          // }
          children.push(generateRouter(child, false))
        })
      }
      parent.children = children
      accessedRouters.push(parent)
      return qxbuttonlist
    })
  }
  console.log('7777777777777777777777777777')
  localStorage.setItem('buttons', JSON.stringify(qxbuttonlist))
  // console.log(JSON.stringify(qxbuttonlist))
  // setqxbutton(JSON.stringify(qxbuttonlist))
  accessedRouters.forEach(child => {
    // console.log(child)
    // if (+child.children.length === 1) {
    //   child.children.push(child.children[0])
    // }
  })
  console.log(accessedRouters)
  accessedRouters.push({ path: '/cxLrs/admin/homePage', redirect: '/cxLrs/admin/homePage', hidden: true })
  return accessedRouters
}

const state = {
  routes: [],
  addRoutes: [],
  sign: false
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_SIGN: (state, sign) => {
    console.log('重新获取路由')
    state.sign = sign
  }
}

const actions = {
  generateRoutes({ commit }, data) {
    return new Promise(resolve => {
      // debugger
      console.log('================>')
      console.log(data)
      debugger
      const asyncRouterMap = data.data
      debugger
      const accessedRouters = convertRouter(asyncRouterMap)
      console.log(accessedRouters)
      console.log('程旭')
      commit('SET_ROUTES', accessedRouters)
      commit('SET_SIGN', true)
      // debugger
      resolve(accessedRouters)
    })
  },
  fangfa({ commit }, data) {
    commit('SET_ROUTES', null)
  },
  // 重新获取路由
  resetRoutes({ commit }, data) {
    commit('SET_SIGN', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
