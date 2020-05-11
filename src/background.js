'use strict'

import { ipcMain, app, protocol, BrowserWindow } from 'electron'
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib'
import LoginBaidu from '@/lib/BaiduDiskLogin.js'
const OAuth2Provider = require('electron-oauth-helper/dist/oauth2').default
const qs = require('querystring')
const Client = require('ftp')
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

// 通信

ipcMain.on('asynchronous-message', function(event, arg) {
  console.log(event, arg)
  console.log(arg)
  const { tag, host, port, user, password } = arg
  const config = {
    host: host,
    port: port,
    user: user,
    password: password,
    keepalive: 10000,
  }
  if (tag === 1) {
    const c = new Client()
    c.on('ready', function() {
      console.log('OK')
    })
    c.connect(config)
  } else {
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

    const provider = new OAuth2Provider({
      authorize_url:
        'https://openapi.baidu.com/oauth/2.0/authorize?client_id=UHtXpF46VABa01jCCQiNAdhy&display=popup&force_login=1&confirm_login=1',
      access_token_url:
        'https://openapi.baidu.com/oauth/2.0/token?grant_type=authorization_code',
      response_type: 'token',
      client_id: 'UHtXpF46VABa01jCCQiNAdhy',
      client_secret: 'RoWvLITnNAuhPvGOO6O7c3IxY5lGQQjV',
      grant_type: 'authorization_code',
      redirect_uri: 'http://111.231.195.214:3000/yunjv',
      scope: 'basic,netdisk',
    })
    provider
      .perform(baiduWin)
      .then((raw) => {
        const result = qs.parse(raw)
        event.reply('asynchronous-reply', {
          state: 1,
          info: result,
        })
        console.log('result', result)
        baiduWin.close()
      })
      .catch((err) => {
        console.error(err)
      })
  }
})

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  console.log(LoginBaidu)
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
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
