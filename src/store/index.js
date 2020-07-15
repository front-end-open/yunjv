import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/server/index.js'
const ipcRenderer = require('electron').ipcRenderer
const npath = require('path')
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    config: JSON.parse(window.localStorage.getItem('config')),
    indexFileDate: null,
    fileinfo: {},
    downloadLists: [],
    tag: false,
    brandNum: 0,
    precentage: 0,
    index: 0,
    downpath: '',
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
      state.downloadLists.push(payload.file)
      state.index = payload.index
      state.downpath = payload.downpath
      state.tag = true
      state.brandNum++
    },
    clearDownTask(state) {
      state.brandNum = 0
      state.tag = false
      state.precentage = 0
      state.downloadLists = []
    },
    process(state, payload) {
      state.precentage = payload
    },
  },
  actions: {
    async startDownload({ state, commit }) {
      const fsidarr = []
      let dlink = ''
      const config = JSON.parse(localStorage.getItem('config'))[state.index]
      fsidarr.push(state.downloadLists[0].fs_id)
      await http
        .get(
          `https://pan.baidu.com/rest/2.0/xpan/multimedia?method=filemetas&access_token=${config.token}`,
          {
            params: {
              fsids: JSON.stringify(fsidarr),
              dlink: 1,
            },
          },
        )
        .then((res) => {
          console.log(res.data)
          dlink = res.data.list[0].dlink
        })
      console.log(path)
      let extname = npath.extname(state.downloadLists[0].server_filename)
      let path = `${state.downpath}${extname}`
      let dinks = `${dlink}&access_token=${config.token}`
      ipcRenderer.send('download', {
        dinks,
        path,
        size: state.downloadLists[0].sizeC,
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
