import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    config: JSON.parse(window.localStorage.getItem('config')),
  },
  mutations: {
    saveconfig(state) {
      state.config.push(JSON.parse(window.localStorage.getItem('config')))
    },
  },
  actions: {},
  modules: {},
})
