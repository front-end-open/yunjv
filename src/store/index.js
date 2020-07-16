import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/server/index.js'
const ipcRenderer = require('electron').ipcRenderer

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    config: JSON.parse(window.localStorage.getItem('config')),
    indexFileDate: null,
    fileinfo: {},
    downloadLists: [],
    tag: false,
    brandNum: 1,
    precentage: 0,
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
      state.downloadLists.push(payload.file)
      state.tag = true
    },
    clearDownTask(state) {
      state.tag = false
      state.precentage = 0
      state.downloadLists = []
    },
    process(state, payload) {
      state.precentage = payload
      console.log(payload)
    },
  },
  actions: {
    async startDownload({ state, commit }) {
      const fsidarr = []
      let dlink = ''
      fsidarr.push(state.downloadLists[0].fs_id)
      await http
        .get(
          `https://pan.baidu.com/rest/2.0/xpan/multimedia?method=filemetas&access_token=123.17ab2fea084763a72ce05e1a7ec74b3c.YsWy6lXitNM7caGvCWxAm1b6Hzf4LY_3feRIAK5.hQgeXQ`,
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
      let path = `/Users/ousan/desktop/${state.downloadLists[0].server_filename}`
      let dinks = `${dlink}&access_token=123.17ab2fea084763a72ce05e1a7ec74b3c.YsWy6lXitNM7caGvCWxAm1b6Hzf4LY_3feRIAK5.hQgeXQ`
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
