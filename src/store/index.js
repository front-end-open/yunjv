import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    config: JSON.parse(window.localStorage.getItem('config')),
    indexFileDate: null,
    fileinfo: {},
  },
  mutations: {
    saveconfig(state) {
      state.config.push(JSON.parse(window.localStorage.getItem('config')))
    },
    setindexDate(state, filelist) {
      state.indexFileDate = filelist
    },
    upLoadFIlelist(state, payload) {
      state.fileinfo = payload
    },
  },
  actions: {},
  modules: {},
})
