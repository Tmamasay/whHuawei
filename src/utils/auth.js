import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const InfoKey = 'info'
const refreshToken = 'refresh_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 刷新token
export function getRefreshToken() {
  return Cookies.get(refreshToken)
}

export function setRefreshToken(token) {
  return Cookies.set(refreshToken, token)
}

export function removeRefreshToken() {
  return Cookies.remove(refreshToken)
}

//
export function getInfoo() {
  return Cookies.get(InfoKey)
}

export function setInfo(token) {
  return Cookies.set(InfoKey, token)
}

export function removeInfo() {
  return Cookies.remove(InfoKey)
}

// 获取权限按钮
export function getqxbutton() {
  return Cookies.get('qxbutton')
}

export function setqxbutton(token) {
  return Cookies.set('qxbutton', token)
}
// 用户id
export function getcustomerId() {
  return Cookies.get('customerId')
}

export function setcustomerId(token) {
  return Cookies.set('customerId', token)
}
export function removecustomerId(token) {
  return Cookies.remove('customerId')
}
// 弹窗消息
export function getisOpen() {
  return Cookies.get('isOpen')
}

export function setisOpen(isOpen) {
  return Cookies.set('isOpen', isOpen)
}
export function removeisOpen() {
  return Cookies.remove('isOpen')
}
