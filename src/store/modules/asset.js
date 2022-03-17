import request from '@/util/request2'

const state = {
  dcs: [],
  cabinets: [],
  searchAbleFieldData: [],
  assetFamily: [
    {text: '服务器', value: '服务器'}
  ],
  taskStatus: [
    {
      text: 'Todo',
      value: 0,
    },
    {
      text: 'Progress',
      value: 1,
    },
    {
      text: 'Done',
      value: 2,
    },
  ],
}

// getters
const getters = {
  getsearchAbleFieldData: (state) => {
    return state.searchAbleFieldData.map((item) => {
      return {
        sn: item.real_sn,
        ip: item.ip,
      }
    })
  },
  getAssetFamily: (state) => {
    return state.assetFamily
  },
  getDC: (state) => {
    return state.dcs
  },
  getCabinets: (state) => {
    return state.cabinets.map((item) => {
      return {
        text: item.name + item.dc_name,
        value: item.id,
      }
    })
  },
  getTaskStatus: (state) => state.taskStatus,
  getTaskStatusByValue: (state) => (value) => {
    const find = state.taskStatus.find(item.value === value)
    return find.text
  },
}

// actions
const actions = {
  fetchProject(context, query) {
    return request({
      url: `pms/project`,
      method: 'get',
      params: query,
    }).then((resp) => {
      context.commit('SET_PROJECT', resp.data)
      return resp
    })
  },
  fetchsearchAbleFieldData(context, query){
    request({
      url: `/asset/`,
      method: 'get',
      params: query,
      headers: {
      'X-Fields': '{results{real_sn,ip}}'
      }
    }).then((resp) => {
      let data = resp.data.results
      context.commit('SET_SEARCHFIELDDATA', data)
      return data
    })
  },
  fetchAsset(context, query) {
    return request({
      url: `/asset/`,
      method: 'get',
      params: query,
    }).then((resp) => {
      // context.commit('SET_ASSET', resp.data.results)
      return resp
    })
  },
  fetchCabinet(context, query) {
    return request({
      url: `/cabinet/`,
      method: 'get',
      params: query,
    }).then((resp) => {
      context.commit('SET_CABINETS', resp.data)
      return resp
    })
  },
  fetchDC(context, query) {
    return request({
      url: `/dc/`,
      method: 'get',
      params: query,
    }).then((resp) => {
      context.commit('SET_DC', resp.data)
      return resp
    })
  },
  createAsset(context, data) {
    context.commit('SHOW_SNACKBAR', { text: "正在收集主机信息" + "这大约需要" + 1 + "分钟" , color: 'info' })
    return request({
      url: `/asset/?auto_populate=${data.auto_populate}`,
      method: 'post',
      data: data,
    }).then((resp) => {
      return resp
    })
  },
  createCabinet(context, data) {
    return request({
      url: `/cabinet/`,
      method: 'post',
      data: data,
    }).then((resp) => {
      return resp
    })
  },
  updateAsset(context, { sn, data,auto_populate }) {
    return request({
      url: `/asset/${sn}?auto_populate=${auto_populate}`,
      method: 'put',
      data: data,
    }).then((resp) => {
      return resp
    })
  },
  updateCabinet(context, { id, data }) {
    return request({
      url: `/cabinet/${id}`,
      method: 'put',
      data: data,
    }).then((resp) => {
      return resp
    })
  },
  deleteCabinet(context, { id }) {
    return request({
      url: `cabinet/${id}`,
      method: 'delete',
    })
  },
  updateTaskStatus(context, { id, status }) {
    return request({
      url: `pms/task/${id}`,
      method: 'put',
      data: {
        status: status,
      },
    }).then((resp) => {
      return resp
    })
  },
  deleteAsset(context, sn) {
    return request({
      url: `asset/${sn}`,
      method: 'delete',
    })
  },
  getAssetBySN(context, sn) {
    return request({
      url: `asset/${sn}`,
      method: 'get',
    }).then((resp) => {
      return resp
    })
  },
}

// mutations
const mutations = {
  SET_PROJECT(state, data) {
    state.projects = data
  },
  SET_DC(state, data) {
    state.dcs = data
  },
  SET_CABINETS(state, data) {
    state.cabinets = data
  },
  SET_SEARCHFIELDDATA(state,data){
    if (data) {
      // 空数据
      state.searchAbleFieldData = data
    } else {
      state.searchAbleFieldData = []
    }
  }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations,
}
