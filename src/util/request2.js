import axios from 'axios'
import store from '@/store'
// create axios
const service = axios.create({
  baseURL: '/api', // api base_url
  timeout: 0, // timeout,
  headers: { 'Access-Control-Allow-Origin': '*' },
})

const err = (error) => {
  // 超时时间
  if (!error.response) {
    store.commit('SHOW_SNACKBAR', { text: error.message, color: 'error' })
    return Promise.reject(error)
  }
  const { status, data } = error.response
  const { errors } = data
  let message = []
  for (let field in errors) {
    message.push(errors[field])
  }
  switch (status) {
    case 400:
      store.commit('SHOW_SNACKBAR', { text: data.message, color: 'error' })
      break
    case 422:
      store.commit('SHOW_SNACKBAR', { text: message, color: 'error' })
      break
    case 401:
      store.commit('SHOW_SNACKBAR', { text: data.message, color: 'error' })
      break
    case 403:
      store.commit('SHOW_SNACKBAR', { text: message, color: 'error' })
      break
    case 500:
      store.commit('SHOW_SNACKBAR', { text: 'server error', color: 'error' })
      break
    default:
      break
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use((config) => {
  config.headers['Access-Control-Allow-Origin'] = '*'
  config.headers['Content-Type'] = 'application/json'
  config.headers['Authorization'] = 'Basic ' + store.getters.getAccessToken

  return config
}, err)

// response interceptor

service.interceptors.response.use(({ data, config }) => {

  if (['put', 'post', 'delete', 'patch'].includes(config.method) && data.msg) {
    store.commit('SHOW_SNACKBAR', { text: data.msg, color: 'success' })
  }
  if (data.status != 0) {
    store.commit('SHOW_SNACKBAR', { text: data.msg, color: 'error' })
    return Promise.reject('错误的响应体')
  } else {
    return data
  }
}, err)

export default service
