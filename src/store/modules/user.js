// import { logout } from '@/api/user'
import { userLogin, getMyMenus, loginOut } from '@/api/framework'
import { removeToken, removeisOpen, removeRefreshToken, removeInfo, removecustomerId, getToken, setToken, setRefreshToken, getInfoo, setcustomerId } from '@/utils/auth'
import { resetRouter, constantRoutes } from '@/router'
// import { constantRoutes } from '@/router'
import Layout from '@/layout'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    loginState: 1,
    router: [],
    sign: false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROUTE: (state, router) => {
    state.router = router
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_SIGN: (state, sign) => {
    console.log('重新获取路由')
    state.sign = sign
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      var data = {
        param: {
          username: username.trim(),
          password: password,
          sysName: 'call_boss',
          loginType: 'call_boss',
          clientPassword: 'nfjkMaHiO4Wz42Fb1jNVWlilUzBXxwqD'
        }
      }
      userLogin(data).then(response => {
        console.log(response)
        if (response.data.code !== '403') {
          commit('SET_TOKEN', response.data.access_token)
          setToken(`Bearer ${response.data.access_token}`)
          setRefreshToken(response.data.refresh_token)
          console.log(response.data.access_token)
          setcustomerId(response.data.customerId)
          debugger
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      var data = {
        param: {
          sysName: 'call_boss'
        }
      }
      getMyMenus(data).then(response => {
        // const data = {
        //   avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        //   name: 'Super Admin'
        // }
        console.log(response)
        debugger
        // setInfo(data.name)
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        // const { name, avatar } = data
        // setInfo(name)
        commit('SET_NAME', response.statusCode)
        // commit('SET_AVATAR', avatar)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    var token = getToken().split(' ')
    console.log(token)
    var data = {
      param: {
        token: token[1],
        clientCode: 'call_boss',
        sysName: 'call_boss'
      }
    }
    return new Promise((resolve, reject) => {
      loginOut(data).then((res) => {
        console.log(res)
        resolve(res)
        resetRouter()
        commit('RESET_STATE')
        commit('SET_NAME', '')
        removeisOpen()
        // commit('SET_NAME', response.statusCode)
      }).catch(error => {
        reject(error)
      })
    })
  },
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      const accessedRouters = [// 组织架构
        {
          path: '/zzjg',
          component: Layout,
          children: [
            {
              path: 'bumen',
              component: () => import('@/views/organizational_structure/index'),
              name: 'bumen',
              meta: { title: '部门管理', icon: 'example' }

            }
          ]
        },
        {
          path: '/zxadmin',
          component: Layout,
          children: [
            {
              path: 'zuoxi',
              component: () => import('@/views/seats_admin/index'),
              name: 'zuoxi',
              meta: { title: '坐席管理', icon: 'table' }

            }
          ]
        },
        {
          path: '/cloudCall',
          component: Layout,
          children: [
            {
              path: 'call',
              component: () => import('@/views/cloudCall/index'),
              name: 'zuoxi',
              meta: { title: '云呼叫', icon: 'link' }

            }
          ]
        },
        {
          path: '/billManagement',
          component: Layout,
          children: [
            {
              path: 'bill',
              component: () => import('@/views/billManagement/index'),
              name: 'bill',
              meta: { title: '话单管理', icon: 'form' }

            }
          ]
        },
        {
          path: '/quanxian',
          component: Layout,
          meta: { title: '权限管理', icon: 'example' },
          children: [
            {
              path: 'jsadmin',
              component: () => import('@/views/power/index'),
              name: 'jsadmin',
              children: [
                {
                  path: 'js',
                  component: () => import('@/views/power/index'),
                  name: 'js',
                  meta: { title: '角色组', icon: 'example' }
                }
              ]
            }
          ]
        }
      ]
      const accessedRouters2 = [
        // {
        //   path: '/aaa',
        //   component: Layout,
        //   children: [
        //     {
        //       path: 'aaa',
        //       component: () => import('@/views/aaa/index'), // Parent router-view
        //       name: 'aaa',
        //       meta: { title: '普通用户', icon: 'aaa' }
        //     }
        //   ]
        // }
      ]
      commit('SET_ROUTE', constantRoutes.concat(getInfoo() === 'Super Admin' ? accessedRouters : accessedRouters2))
      resolve(constantRoutes.concat(getInfoo() === 'Super Admin' ? accessedRouters : accessedRouters2))
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      // removeToken() // must remove  token  first
      // removeRefreshToken()
      // commit('RESET_STATE')
      resetRouter()
      commit('RESET_STATE')
      commit('SET_NAME', '')
      removeToken()
      removeRefreshToken()
      removeInfo()
      removecustomerId()
      localStorage.removeItem('buttons')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

