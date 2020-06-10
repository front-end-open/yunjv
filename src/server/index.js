import Vue from 'vue'
import axios from 'axios'

const config = {
  //   responseType: 'json',
}
const instance = axios.create(config)

instance.interceptors.request.use(
  function(config) {
    // console.log(config)
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  function(response) {
    // console.log(response)
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
