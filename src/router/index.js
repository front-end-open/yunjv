import Vue from 'vue'
import { Upload } from 'element-ui'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Main from '@/layout/main' //主页
import MainLibrary from '../views/main/library' //
import MainTransmission from '../views/main/transmission'
import MainBackup from '../views/main/backup'
import MainSetting from '../views/main/setting'

import { DownloadItem } from 'electron'

import libraryFileList from '../views/main/library/components/fileList.vue'
import Server from '../views/main/library/components/Server.vue'

import store from '@/store/index.js'
import http from '@/server/index.js'
import Dateformate from '@/lib/DateFormate.js'
import SizeConvert from '@/lib/SizeConvert.js'
import ServerFac from '@/lib/ServerFactory.js'
import OwnerConvert from '@/lib/PERMISSIONCONVERT.js'
import Distinct from '@/lib/arryDuplicateRemove.js'

const { SeafileAPI } = require('seafile-js')

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

// const config = JSON.parse(localStorage.getItem('config')),
//   { token } = config
0
const routes = [
  {
    path: '/',
    component: Home,
    redirect: '/main',
  },
  {
    path: '/main',
    component: Main,
    redirect: '/main/library/',
    children: [
      {
        path: 'library',
        component: MainLibrary,
        redirect: '/main/library/server/',
        props: true,
        children: [
          {
            path: 'server',
            component: Server,
          },
          {
            path: 'filelist/:serverType',
            name: 'filelist',
            component: libraryFileList,
            beforeEnter: (to, from, next) => {
              const { serverType, index } = to.params,
                seafileAPI = new SeafileAPI(),
                { token, user, pwd, host } = JSON.parse(
                  localStorage.getItem('config'),
                )[index],
                obj = { server: host, username: user, password: pwd }
              let data = [],
                singleFile = {}
              seafileAPI.init(obj)
              switch (serverType) {
                case 'baid':
                  http
                    .get(
                      `/rest/2.0/xpan/file?method=list&access_token=${token}`,
                    )
                    .then((res) => {
                      const { list } = res.data
                      let fileDate = {}
                      for (let val of list) {
                        //  由于返回数据没有标识，因此需要加上筛选拼接数据
                        fileDate = {}
                        fileDate.id = Math.random()
                        fileDate.fs_id = val.fs_id
                        fileDate.server_filename = val.server_filename
                        fileDate.local_mtime = Dateformate(val.local_mtime)
                        fileDate.local_ctime = Dateformate(val.local_ctime)
                        fileDate.size = SizeConvert(val.size)
                        fileDate.sizeC = val.size
                        fileDate.isdir = val.isdir
                        fileDate.path = val.path
                        data.push(fileDate)
                      }
                      store.commit('setindexDate', data)
                      next()
                    })
                  break
                case 'smb':
                  var smb = new ServerFac(
                    'SMB',
                    index,
                    JSON.parse(localStorage.getItem('config')),
                    '',
                    '',
                    '',
                  )
                  if (smb.loadFile()) {
                    data = smb.loadFile()
                    store.commit('setindexDate', data)
                    next()
                  }
                  break
                case 'ftp':
                  var ftp = new ServerFac(
                    'FTP',
                    index,
                    JSON.parse(localStorage.getItem('config')),
                    '',
                    '',
                    '',
                  )
                  ftp.loadFile().then((res) => {
                    for (let [index, item] of res.entries()) {
                      const {
                        name,
                        size,
                        isDirectory,
                        permissions,
                        date,
                        user,
                      } = item
                      singleFile = {}
                      singleFile.id = index
                      singleFile.server_filename = name
                      singleFile.size = size
                      singleFile.parent = '/'
                      singleFile.parentsPath = '/'
                      singleFile.path = `/${name}`
                      singleFile.isdir = Number(isDirectory)
                      singleFile.local_mtime = date
                      singleFile.permission = permissions
                        ? OwnerConvert(permissions)
                        : ''
                      singleFile.Owner = user
                      data.push(singleFile)
                    }
                    store.commit('setindexDate', data)
                    next()
                  })
                  break
                default:
                  // seafileAPI.init(obj)
                  seafileAPI
                    .login()
                    .then(async () => {
                      let arr = []
                      let axiosListDir = []
                      let arrDir = []
                      let repos = await seafileAPI.listRepos()
                      repos.data.repos.forEach((item) => {
                        arr.push(item.repo_id)
                      })
                      Distinct(arr).forEach((item) => {
                        axiosListDir.push(seafileAPI.listDir(item, ''))
                      })

                      await Promise.all(axiosListDir).then((res) => {
                        res.forEach((item, index) => {
                          arr[index]
                          for (let val of item.data.dirent_list) {
                            val.repos_id = arr[index]
                            arrDir.push(val)
                          }
                        })
                      })

                      for (let item of arrDir) {
                        if (item.type == 'file') {
                          const {
                            name,
                            size,
                            type,
                            permissions,
                            mtime,
                            parent_dir,
                            repos_id
                          } = item
                          singleFile = {}
                          singleFile.id = Math.random()
                          singleFile.server_filename = name
                          singleFile.size = size
                          singleFile.parent = parent_dir
                          singleFile.parentsPath = parent_dir
                          singleFile.path = `/${name}`
                          singleFile.isdir = type == 'file' ? 0 : 1
                          singleFile.local_mtime = mtime
                          singleFile.permission = permissions
                          singleFile.repos_id = repos_id
                        } else {
                          const {
                            name,
                            type,
                            permissions,
                            mtime,
                            parent_dir,
                            repos_id,
                          } = item
                          singleFile = {}
                          singleFile.id = Math.random()
                          singleFile.server_filename = name
                          singleFile.parent = parent_dir
                          singleFile.size = ''
                          singleFile.parentsPath = parent_dir
                          singleFile.path = `/${name}`
                          singleFile.isdir = type == 'dir' ? 1 : 0
                          singleFile.local_mtime = mtime
                          singleFile.permission = permissions
                          singleFile.repos_id = repos_id
                        }
                        data.push(singleFile)
                      }
                      store.commit('setindexDate', data)
                      next()
                    })
                    .catch((error) => {
                      console.log(error)
                    })
              }
            },
            props: true,
          },
        ],
      },
      {
        path: 'transmission',
        component: MainTransmission,
        chihdren: [
          {
            path: '/transmission/up',
            name: 'up',
            component: Upload,
          },
          {
            path: '/transmission/down',
            name: 'down',
            component: DownloadItem,
          },
        ],
      },
      {
        path: 'backup',
        component: MainBackup,
      },
      {
        path: 'setting',
        component: MainSetting,
      },
    ],
  },
]

const router = new VueRouter({
  routes,
})

export default router
