import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Main from '../views/Main.vue'
import MainLibrary from '../views/main/library'
import MainTransmission from '../views/main/transmission'
import MainBackup from '../views/main/backup'
import MainSetting from '../views/main/setting'
import libraryFileList from '../views/main/library/components/fileList.vue'
import Server from '../views/main/library/components/Server.vue'

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
    redirect: '/main/library/',
    children: [
      {
        path: 'library',
        component: MainLibrary,
        redirect: '/main/library/server/',
        props: true,
        children: [
          {
            path: 'filelist',
            component: libraryFileList,
          },
          {
            path: 'server',
            component: Server,
          },
        ],
      },
      {
        path: 'transmission',
        component: MainTransmission,
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
