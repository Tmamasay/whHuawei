import request from '@/utils/request'

// 根据系统代码查询该系统所有菜单
export function getSysMenus(data) {
  return request({
    url: '/kl-auth-biz/rolePowerManager/getSysMenus',
    method: 'post',
    data
  })
}
// 企业角色管理分页
export function selectRolePage(data) {
  return request({
    url: '/kl-auth-biz/rolePowerManager/selectRolePage',
    method: 'post',
    data
  })
}
// 新增角色
export function addRole(data) {
  return request({
    url: '/kl-auth-biz/rolePowerManager/addRole',
    method: 'post',
    data
  })
}
// 更新角色
export function updateRole(data) {
  return request({
    url: '/kl-auth-biz/rolePowerManager/updateRole',
    method: 'post',
    data
  })
}
// 删除角色
export function delRole(data) {
  return request({
    url: '/kl-auth-biz/rolePowerManager/delRole',
    method: 'post',
    data
  })
}
// 话单总览
export function selectAllCallLogPage(data) {
  return request({
    url: '/kl-call-boss-biz/call-out/selectAllCallLogPage',
    method: 'post',
    data
  })
}
// 忘记密码-验证账号，发送验证码
export function forgetToSend(data) {
  return request({
    url: '/kl-customer-biz/password/forgetToSend',
    method: 'post',
    data
  })
}
// 忘记密码-校验验证码，随机重置
export function forgetToUpdate(data) {
  return request({
    url: '/kl-customer-biz/password/forgetToUpdate',
    method: 'post',
    data
  })
}
export function selectLogAnalysis(data) {
  return request({
    url: '/kl-call-boss-biz/homePage/selectLogAnalysis',
    method: 'post',
    data
  })
}
