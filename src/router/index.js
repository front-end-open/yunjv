import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Main from '../views/Main.vue'
import MainLibrary from '../views/main/library'
import MainTransmission from '../views/main/transmission'
import MainBackup from '../views/main/backup'
import MainSetting from '../views/main/setting'
import { Upload } from 'element-ui'
import { DownloadItem } from 'electron'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    redirect: '/main',
  },
  {
    path: '/main',
    component: Main,
    redirect: '/main/library',
    children: [
      {
        path: 'library',
        component: MainLibrary,
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
