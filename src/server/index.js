import Vue from 'vue'
import axios from 'axios'

const config = {
  transformRequest: [
    function(data) {
      // post 数据转表单
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    },
  ],
}
const instance = axios.create(config)

instance.interceptors.request.use(
  function(config) {
    // post请求设置表单格式头部
    if (config.method === 'post') {
      config.headers = Object.assign(
        {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        config.headers,
      )
    }
    return Promise.resolve(config)
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  function(response) {
    return response
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

Vue.prototype.$http = instance

export default instance
