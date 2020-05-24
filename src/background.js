'use strict'

import { Notification, ipcMain, app, protocol, BrowserWindow } from 'electron'
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib'
import LoginBaidu from '@/lib/BaiduDiskLogin.js'
const OAuth2Provider = require('electron-oauth-helper/dist/oauth2').default
const isDevelopment = process.env.NODE_ENV !== 'production'

let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

// 通信-授权
ipcMain.on('async-authcode', function() {
  // const baiduWin = new BrowserWindow({
  //   width: 600,
  //   height: 800,
  //   show: true,
  //   webPreferences: {
  //     nodeIntegration: false,
  //     contextIsolation: true,
  //   },
  // })
  // if (!process.env.IS_TEST) baiduWin.webContents.openDevTools()
  // const config = {
  //   authorize_url: 'http://openapi.baidu.com/oauth/2.0/authorize',
  //   access_token_url:
  //     'https://openapi.baidu.com/oauth/2.0/token?grant_type=authorization_code',
  //   response_type: 'code',
  //   client_id: 'nIoc7T7GA953ao9LWfd53zGf',
  //   redirect_uri: 'oob',
  // }
  // const provider = new OAuth2Provider(config)
  // provider.on('before-authorize-request', (parameter) => {
  //   parameter['force_login'] = 1
  //   parameter['client_secret'] = 'oBMLK7VSa7sZAUAAjVUkriBGpSkbe6Y'
  //   parameter['scope'] = 'basic,netdisk'
  // })
  // provider.on('before-access-token-request', (parameter) => {
  //   const code = parameter.code
  //   parameter['grant_type'] = 'authorization_code'
  //   parameter['code'] = code
  //   parameter['client_id'] = 'nIoc7T7GA953ao9LWfd53zGf'
  //   parameter['client_secret'] = 'oBMLK7VSa7sZAUAAjVUkriBGpSkbe6Y'
  //   parameter['redirect_uri'] = 'oob'
  // })
  // const provider = new OAuth2Provider({
  //   authorize_url: 'http://openapi.baidu.com/oauth/2.0/authorize',
  //   response_type: 'token',
  //   client_id: 'nIoc7T7GA953ao9LWfd53zGf',
  //   client_secret: 'oBMLK7VSa7sZAUAAjVUkriBGpSkbe6Y',
  //   scope: 'basic,netdisk',
  //   redirect_uri: 'oob',
  // })
  // provider.on('before-authorize-request', (parameter) => {
  //   parameter['force_login'] = 1
  // })
  // provider
  //   .perform(baiduWin)
  //   .then((raw) => {
  //     console.log(raw)
  //     const { body } = raw
  //     event.reply('async-authcode-reply', {
  //       state: 1,
  //       info: body,
  //     })
  //     baiduWin.close()
  //   })
  //   .catch((err) => {
  //     console.error(err)
  //   })
  const authWin = new BrowserWindow({
    width: 600,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (!process.env.IS_TEST) authWin.webContents.openDevTools()

  const provider = new OAuth2Provider({
    authorize_url:
      'https://openapi.baidu.com/oauth/2.0/authorize?client_id=UHtXpF46VABa01jCCQiNAdhy&display=popup&force_login=1',
    access_token_url:
      'https://openapi.baidu.com/oauth/2.0/token?grant_type=authorization_code',
    response_type: 'token',
    client_id: 'nIoc7T7GA953ao9LWfd53zGf',
    client_secret: 'oBMLK7VSa7sZAUAAjVUkriBGpSkbe6Y',
    grant_type: 'authorization_code',
    redirect_uri: 'oob',
    scope: 'basic,netdisk',
  })
  provider.on('before-authorize-request', (parameter) => {
    parameter['force_login'] = 1
  })
  provider
    .perform(authWin)
    .then((raw) => {
      console.log(raw)
      authWin.close()
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
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    minWidth: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
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

// Quit when all windows are closed.
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
