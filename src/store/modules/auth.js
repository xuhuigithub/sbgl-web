import request from '@/util/request2'
import colors from 'vuetify/es5/util/colors'

const randomColor = () => {
  const temp = Object.keys(colors)
  const key = temp[Math.floor(Math.random() * temp.length)]
  const color = colors[key].base
  return color
}

const state = {
  access_token: null,
  expires_in: 3600,
  token_type: 'bearer',
  username: '',
  password: '',
  avatar: null,
  userColor: '#2196f3',
  status: 'online',
  me: {}
}
const getters = {
  getAccessToken: (state) => {
    return state.access_token
  },
  getAvatar: (state) => state.avatar,

  getUsername: (state) => state.username,
  getPassword: (state) => state.password,
  getUserStatus: (state) => state.status,
  getUserProfile: (state) => state.me,
  hasPermission: (state) => (permission) => {

    return state.me.permissions.includes(permission) || state.me.permissions.includes('service_admin')
  }
}
const actions = {
  // just for demo
  //replace you own login logic
  demoLogin({ commit }, { username, password }) {
    return new Promise((resolve, reject) => {
      if (username === 'admin' && password === 'admin') {
        commit('SET_LOGIN', { access_token: 'demo', expires_in: 0 })
        return resolve({ message: 'success' })
      } else {
        return reject({ message: 'Auth Failed' })
      }
    })
  },
  login({ commit, dispatch }, { user_name, password }) {
    return request({
      url: '/login',
      method: 'post',
      data: {
        user_name,
        password,
      },
    }).then((resp) => {
      commit('SET_LOGIN', resp)
      commit('SET_LOGIN_PROFILE', {password: password, ...resp.data})
      commit('SET_ACCESS_TOKEN', window.btoa(`${user_name}:${password}`))
      // dispatch('fetchProfile')
    })
  },
  register({ commit, dispatch }, data) {
    return request({
      url: '/auth/register',
      method: 'post',
      data: data,
    }).then((resp) => {
      commit('SET_LOGIN', resp)
      dispatch('fetchProfile')
      return resp
    })
  },
  logout({ commit, dispatch }) {
    // dispatch('closeSocket')
      commit('SET_LOGIN', {})
      commit('SET_LOGIN_PROFILE', {})
      commit('SET_ACCESS_TOKEN', "")
  },
  // get current login user info

  fetchProfile({ commit, dispatch, rootState }) {
    return request({
      url: '/me',
      method: 'get',
    }).then((resp) => {
      commit('SET_LOGIN_PROFILE', resp.data)
      return resp
    })
  },
}
const mutations = {
  SET_LOGIN(state, { access_token, expires_in }) {
    state.access_token = access_token
    state.expires_in = expires_in
  },
  SET_ACCESS_TOKEN(state, token) {
    state.access_token = token
  },
  SET_LOGIN_PROFILE(state, payload) {
    state.username = payload.name
    state.avatar = payload.avatar
    state.color = randomColor()
    state.password = payload.password
    state.me = payload
    state.me.exists = true
  },
  UPDATE_SELF_STATUS(state, status) {
    state.status = status
  },
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
