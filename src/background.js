'use strict'

import {
  Notification,
  ipcMain,
  app,
  protocol,
  BrowserWindow,
  dialog,
} from 'electron'
import {
  createProtocol,
} from 'vue-cli-plugin-electron-builder/lib'
import LoginBaidu from '@/lib/BaiduDiskLogin.js'
const OAuth2Provider = require('electron-oauth-helper/dist/oauth2').default
const querystring = require('querystring')
const isDevelopment = process.env.NODE_ENV !== 'production'
const Axios = require('axios')
const fs = require('fs')
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

// 通信-授权
ipcMain.on('async-authcode', function(event) {
  const baiduWin = new BrowserWindow({
    width: 600,
    height: 800,
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })
  if (!process.env.IS_TEST) baiduWin.webContents.openDevTools()
  const config = {
    authorize_url: 'http://openapi.baidu.com/oauth/2.0/authorize',
    response_type: 'token',
    client_id: 'nIoc7T7GA953ao9LWfd53zGf',
    redirect_uri: 'http://openapi.baidu.com/oauth/2.0/login_success',
  }
  const provider = new OAuth2Provider(config)
  provider.on('before-authorize-request', (parameter) => {
    parameter['force_login'] = 1
    parameter['scope'] = 'basic,netdisk'
    parameter['display'] = 'popup'
  })

  provider
    .perform(baiduWin)
    .then((raw) => {
      console.log(raw)
      const access_token = querystring.parse(raw)
      console.log(access_token)
      event.reply('async-authcode-reply', {
        state: 1,
        info: access_token,
      })
      baiduWin.close()
    })
    .catch((err) => {
      console.error(err)
    })
})
//通知消息
ipcMain.on('async-openNotiton', function(event, arg) {
  console.log(arg)
  let Notition = new Notification({
    body: '创建成功',
    silent: true,
    actions: {
      type: 'button',
      text: '关闭',
    },
  })
  Notition.show()
})

//webDAV
ipcMain.on('async-webdav', function(event, arg) {
  console.log(arg)
  let win = new BrowserWindow({
    minWidth: '500',
    minHeight: '400',
    show: false,
  })
  win.loadURL('http://0.0.0.0/accounts/login/')
  win.on('ready-to-show', () => {
    win.show()
  })
})

ipcMain.on('download', (event, msg) => {
  let { dinks, path, size } = msg
  Axios({
    //   url: 'http://kd.269.net/200.zip',
    url: dinks,
    method: 'get',
    onUploadProgress(e) {
      console.log(11, e)
    },
    onDownloadProgress: function(qq) {
      console.log(qq)
    },
    withCredentials: true,

    responseType: 'stream',
  })
    .then((result) => {
      let fileStream = fs.createWriteStream(path)
      let count = 0
      result.data.on('data', (c) => {
        count += c.length
        let prcentage = ((count / size) * 100).toFixed(0)
        event.reply('async-authcode-reply', {
          download: prcentage,
          status: 0,
        })
        fileStream.write(c)
      })
      result.data.on('end', () => {
        event.reply('async-authcode-reply', {
          download: 100,
          status: 1,
        })
        console.log('完成了 100%')
        fileStream.end()
      })
    })
    .catch((err) => {
      console.log('错误')
      console.log(err)
    })
})
function createWindow() {
  const windowHeight = 800
  const windowWidth = 1024
  const devtoolWidth = 500

  // Create the browser window.
  win = new BrowserWindow({
    minWidth: 960,
    width:
      isDevelopment && !process.env.IS_TEST
        ? windowWidth + devtoolWidth
        : windowWidth,
    height: windowHeight,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// 所有窗口关闭，退出程序
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

app.on('ready', async () => {
  console.log(LoginBaidu)
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()

  // downDialog
  ipcMain.on('async-openDialog', (event) => {
    let filepath = dialog.showOpenDialog(win, {
      title: '选择文件',
      buttonLabel: '确定',
      properties: ['openFile'],
    })
    if (filepath) {
      event.reply('async-get', filepath)
    }
  })
  // backup
  ipcMain.on('async-openBackDialog', (event) => {
    let filepath = dialog.showOpenDialog(win, {
      title: '选择备份目录',
      buttonLabel: '确定',
      properties: ['openDirectory'],
    })
    if (filepath) {
      event.reply('async-get', filepath)
    }
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
