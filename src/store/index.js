import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/server/index.js'
import router from '@/router/index'
const ipcRenderer = require('electron').ipcRenderer
const npath = require('path')
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    config: JSON.parse(window.localStorage.getItem('config')),
    indexFileDate: null,
    fileinfo: {},
    downloadLists: null,
    tag: false,
    brandNum: 1,
    precentage: 0,
    index: 0,
    downpath: '',
    isLogin: false,
    user_id: null,
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
    downloadTasks(state, payload) {
      // state.downloadLi sts = []
      state.downloadLists = payload.file
      state.index = payload.index
      state.downpath = payload.downpath
      state.tag = true
    },
    clearDownTask(state) {
      state.tag = false
      state.precentage = 0
      state.downloadLists = []
    },
    process(state, payload) {
      state.precentage = payload
    },
    loginstate(state, payload) {
      if (payload.islogin) {
        state.isLogin = payload.islogin
        state.user_id = payload.user_id
        router.push({ path: '/main' })
      } else {
        state.user_id = payload.user_id
        state.isLogin = payload.islogin
        router.push('/login')
      }
    },
  },
  actions: {
    async startDownload({ state, commit }) {
      const fsidarr = []
      let dlink = ''
      const { token } = JSON.parse(localStorage.getItem('config'))[0]
      fsidarr.push(state.downloadLists[0].fs_id)
      await http
        .get(
          `https://pan.baidu.com/rest/2.0/xpan/multimedia?method=filemetas&access_token=${token}`,
          {
            params: {
              fsids: JSON.stringify(fsidarr),
              dlink: 1,
            },
          },
        )
        .then((res) => {
          dlink = res.data.list[0].dlink
        })
      let extname = npath.extname(state.downloadLists[0].server_filename)
      let path = `${state.downpath}${extname}`
      let dinks = `${dlink}&access_token=${token}`
      ipcRenderer.send('download', {
        dinks,
        path,
        size: state.downloadLists[0].size,
      })
      ipcRenderer.on('async-authcode-reply', (event, msg) => {
        if (!msg.status) {
          commit('process', msg.download)
        } else {
          commit('clearDownTask', msg.download)
        }
      })
    },
  },
  modules: {},
})
