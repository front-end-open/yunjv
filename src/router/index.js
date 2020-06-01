import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Main from '@/layout/main'
import MainLibrary from '../views/main/library'
import MainTransmission from '../views/main/transmission'
import MainBackup from '../views/main/backup'
import MainSetting from '../views/main/setting'

import { Upload } from 'element-ui'
import { DownloadItem } from 'electron'

import libraryFileList from '../views/main/library/components/fileList.vue'
import Server from '../views/main/library/components/Server.vue'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
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
            path: 'filelist/:id',
            name: 'filelist',
            component: libraryFileList,
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
