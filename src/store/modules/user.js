import request from '@/util/request2'

const state = {
  users: [],
  roles: []
}

// getters
const getters = {
  getUsers: (state) => {
      return state.users
    },
  getRoles: (state) => {
    return state.roles
  }
}

// actions
const actions = {
  fetchUser(context, query) {
    return request({
      url: `/user/`,
      method: 'get',
      params: query,
    }).then((resp) => {
      let k = resp.data.map((item) => {
        item.exists = true
        return item
      })
      context.commit('SET_USERS', k)
      return resp
    })
  },
  fetchRole(context, query) {
    return request({
      url: `/role/`,
      method: 'get',
      params: query,
    }).then((resp) => {
      context.commit('SET_ROLES', resp.data)
      return resp
    })
  },
  createUser(context, data) {
    return request({
      url: `/user/`,
      method: 'post',
      data: data,
    }).then((resp) => {
      return resp
    })
  },
  updateUser(context, { name, data }) {
    return request({
      url: `/user/${name}`,
      method: 'put',
      data: data,
    }).then((resp) => {
      return resp
    })
  },
  updateMe(context, { name, data }) {
    return request({
      url: `/updateME`,
      method: 'put',
      data: data,
    }).then((resp) => {
      return resp
    })
  },
  deleteUser(context, { name }) {
    return request({
      url: `/user/${name}`,
      method: 'delete'
    }).then((resp) => {
      return resp
    })
  },
  getUserById(context, id) {
    return request({
      url: `/acl/user/${id}`,
      method: 'get',
    }).then((resp) => {
      return resp
    })
  },
}

// mutations
const mutations = {
  SET_USERS(state, data) {
    state.users = data
  },
  SET_ROLES(state, data) {
    state.roles = data
  }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
