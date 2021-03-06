import request from '@/utils/request'
// 创建部门
export function create(data) {
  return request({
    url: '/kl-customer-biz/department/create',
    method: 'post',
    data
  })
}
// 快速验证本层下是否有相同名称的部门
export function validata(data) {
  return request({
    url: '/kl-customer-biz/department/validata',
    method: 'post',
    data
  })
}
// 获取企业所有部门
export function getAllDepartment(data) {
  return request({
    url: '/kl-customer-biz/department/getAllDepartment',
    method: 'post',
    data
  })
}
// 删除部门
export function del(data) {
  return request({
    url: '/kl-customer-biz/department/del',
    method: 'post',
    data
  })
}
// 更新部门
export function udpate(data) {
  return request({
    url: '/kl-customer-biz/department/udpate',
    method: 'post',
    data
  })
}
// 创建部门成员
export function cycreate(data) {
  return request({
    url: '/kl-customer-biz/user/create',
    method: 'post',
    data
  })
}
// 获取部门下对应的成员
export function getUsersByDepartment(data) {
  return request({
    url: '/kl-customer-biz/user/getUsersByDepartment',
    method: 'post',
    data
  })
}
// 删除部门成员
export function cydel(data) {
  return request({
    url: '/kl-customer-biz/user/del',
    method: 'post',
    data
  })
}
// 更新成员
export function cyudpate(data) {
  return request({
    url: '/kl-customer-biz/user/udpate',
    method: 'post',
    data
  })
}
// 快速验证系统中是否存在注册电话对应的成员
export function cyvalidata(data) {
  return request({
    url: '/kl-customer-biz/user/validata',
    method: 'post',
    data
  })
}
/* ============坐席管理==============*/
// 快速验证系统中是否存在注册电话对应的成员
export function addSeat(data) {
  return request({
    url: '/kl-call-boss-biz/customerSeatManage/addSeat',
    method: 'post',
    data
  })
}
// 删除坐席
export function delSeat(data) {
  return request({
    url: '/kl-call-boss-biz/customerSeatManage/delSeat',
    method: 'post',
    data
  })
}
// 查询坐席列表分页
export function findPage(data) {
  return request({
    url: '/kl-call-boss-biz/customerSeatManage/findPage',
    method: 'post',
    data
  })
}
// 修改坐席
export function hwupdateSeat(data) {
  return request({
    url: '/kl-call-boss-biz/customerSeatManage/updateSeat',
    method: 'post',
    data
  })
}
// 验证坐席
export function validate(data) {
  return request({
    url: '/kl-call-boss-biz/customerSeatManage/validate',
    method: 'post',
    data
  })
}
// ===========云呼叫===========
// 验证坐席
export function callInside(data) {
  return request({
    url: '/kl-call-boss-biz/call-out/callInside',
    method: 'post',
    data
  })
}
// ===========云呼叫===========
// 查询自己话单分页记录
export function findUserCallLogPage(data) {
  return request({
    url: '/kl-call-boss-biz/call-out/findUserCallLogPage',
    method: 'post',
    data
  })
}
// ===========话单管理===========
// 通过用户id查询话单记录
export function findCallLogPage(data) {
  return request({
    url: '/kl-call-boss-biz/customerSeatManage/findCallLogPage',
    method: 'post',
    data
  })
}

// 用户登录
export function userLogin(data) {
  return request({
    url: '/kl-auth-biz/login/userLogin',
    method: 'post',
    data
  })
}
// 查询当前登录用户的菜单
export function getMyMenus(data) {
  return request({
    url: '/kl-auth-biz/user-menu/getMyMenus',
    method: 'post',
    data
  })
}
// 企业全部角色下拉列表
export function selectRoleList(data) {
  return request({
    url: '/kl-auth-biz/rolePowerManager/selectRoleList',
    method: 'post',
    data
  })
}
// 账号修改密码
export function updatePassword(data) {
  return request({
    url: '/kl-auth-biz/login/updatePassword',
    method: 'post',
    data
  })
}
// 获取对应的成员
export function getUsersById(data) {
  return request({
    url: '/kl-customer-biz/user/getUsersById',
    method: 'post',
    data
  })
}
// 重新发送验证短信
export function resendVerifyCode(data) {
  return request({
    url: '/kl-call-boss-biz/customerSeatManage/resendVerifyCode',
    method: 'post',
    data
  })
}
// 客户账单分页查询
export function getPage(data) {
  return request({
    url: '/kl-customer-biz/businessInfo/getPage',
    method: 'post',
    data
  })
}
// 用户注销接口
export function loginOut(data) {
  return request({
    url: '/kl-auth-biz/login/loginOut',
    method: 'post',
    data
  })
}
/* 首页*/
// 近七天通话详情走势
export function selectLatelyTrend(data) {
  return request({
    url: '/kl-call-boss-biz/homePage/selectLatelyTrend',
    method: 'post',
    data
  })
}
// 当日通话情况
export function findCallCensusNum(data) {
  return request({
    url: '/kl-call-boss-biz/homePage/findCallCensusNum',
    method: 'post',
    data
  })
}
// 近十条有效话单
export function selectEffectiveCallLog(data) {
  return request({
    url: '/kl-call-boss-biz/homePage/selectEffectiveCallLog',
    method: 'post',
    data
  })
}
/* 管理者首页*/
// 近七天通话详情走势
export function selectLatelyCompanyData(data) {
  return request({
    url: '/kl-call-boss-biz/homePage/manage/selectLatelyCompanyData',
    method: 'post',
    data
  })
}
// 当日通话情况
export function manageFindCallCensusNum(data) {
  return request({
    url: '/kl-call-boss-biz/homePage/manage/findCallCensusNum',
    method: 'post',
    data
  })
}
// 近十条有效话单
export function selectYesterdayTop10(data) {
  return request({
    url: '/kl-call-boss-biz/homePage/manage/selectTodayAnalysis',
    method: 'post',
    data
  })
}
// 消费余额
export function getUsable(data) {
  return request({
    url: '/kl-customer-biz/account/getUsable',
    method: 'post',
    data
  })
}
// 重置密码
export function resetUserPassword(data) {
  return request({
    url: '/kl-auth-biz/login/resetUserPassword',
    method: 'post',
    data
  })
}
// 上传电话
export function importTelLibrary(data) {
  return request({
    url: '/kl-customer-biz/excel/importTelLibrary',
    method: 'post',
    data
  })
}
// 分页查询导入记录
export function selectPageUploadLog(data) {
  return request({
    url: '/kl-customer-biz/excel/selectPageUploadLog',
    method: 'post',
    data
  })
}
// 当前企业下客户资源分页查询
export function getPageCustomerResources(data) {
  return request({
    url: '/kl-customer-biz/customerLibrary/getPageCustomerResources',
    method: 'post',
    data
  })
}
// 当前用户下客户资源分页查询(私海)
export function getPageResourcesByUser(data) {
  return request({
    url: '/kl-customer-biz/customerLibrary/getPageResourcesByUser',
    method: 'post',
    data
  })
}
// 当前企业新增短信签名
export function addSmsSign(data) {
  return request({
    url: '/kl-call-boss-biz/customerSwitch/addSmsSign',
    method: 'post',
    data
  })
}
// 当前企业下所有短信签名
export function selectSignList(data) {
  return request({
    url: '/kl-call-boss-biz/customerSwitch/selectSignList',
    method: 'post',
    data
  })
}
// 当前企业新增短信模板
export function addSmsTemple(data) {
  return request({
    url: '/kl-call-boss-biz/customerSwitch/addSmsTemple',
    method: 'post',
    data
  })
}
// 当前企业下所有短信模板
export function selectSmsTempleList(data) {
  return request({
    url: '/kl-call-boss-biz/customerSwitch/selectSmsTempleList',
    method: 'post',
    data
  })
}
// 删除当前企业短信模板
export function deleteSmsTemple(data) {
  return request({
    url: '/kl-call-boss-biz/customerSwitch/deleteSmsTemple',
    method: 'post',
    data
  })
}
// 当前企业下客户挂机短信开关 更改
export function updateCustomerSmsStatus(data) {
  return request({
    url: '/kl-call-boss-biz/customerSwitch/updateCustomerSmsStatus',
    method: 'post',
    data
  })
}
// 个人话单短信发送记录
export function selectSmsLogPage(data) {
  return request({
    url: '/kl-call-boss-biz/sendSmsManager/selectSmsLogPage',
    method: 'post',
    data
  })
}
// 当前企业下客户开关状态查询
export function getCustomerSwitch(data) {
  return request({
    url: '/kl-call-boss-biz/customerSwitch/getCustomerSwitch',
    method: 'post',
    data
  })
}
// 当前企业下客户掩盖电话开关 更改
export function updateCustomerMaskStatus(data) {
  return request({
    url: '/kl-call-boss-biz/customerSwitch/updateCustomerMaskStatus',
    method: 'post',
    data
  })
}
// 获取客户预警数据
export function getByCustomer(data) {
  return request({
    url: '/kl-customer-biz/balanceWarning/getByCustomer',
    method: 'post',
    data
  })
}
// 预警开关
export function onOffWarning(data) {
  return request({
    url: '/kl-customer-biz/balanceWarning/onOffWarning',
    method: 'post',
    data
  })
}
// 预警余额设置
export function setBalance(data) {
  return request({
    url: '/kl-customer-biz/balanceWarning/setBalance',
    method: 'post',
    data
  })
}
// 删除签名
export function delSmsSign(data) {
  return request({
    url: '/kl-call-boss-biz/customerSwitch/delSmsSign',
    method: 'post',
    data
  })
}
export function getDepartmentIdsByUid(data) {
  return request({
    url: '/kl-customer-biz/department/getDepartmentIdsByUid',
    method: 'post',
    data
  })
}

