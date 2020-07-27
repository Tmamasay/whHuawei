const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  router: state => state.permission.routes,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  loginState: state => state.user.loginState,
  sign: state => state.permission.sign
}
export default getters
