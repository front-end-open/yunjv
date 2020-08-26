'use strict'

import { ipcMain, app, protocol, BrowserWindow, dialog } from 'electron'
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib'
import LoginBaidu from '@/lib/BaiduDiskLogin.js'
// import { Buffer } from 'buffer'
// import http from '@/server/index.js'
const OAuth2Provider = require('electron-oauth-helper/dist/oauth2').default
const querystring = require('querystring')
const isDevelopment = process.env.NODE_ENV !== 'production'
const Axios = require('axios')
const fs = require('fs')
const chokidar = require('chokidar')
const ftp = require('basic-ftp')
const paths = require('path')
// const md5 = require('md5')
// const FormData = require('form-data')

let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])
// shell.openExternal('https://github.com')
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
// 文件下载
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
        console.log(prcentage, size)
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
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
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
  // backup-BT
  ipcMain.on('async-openBackDialog', (event, msg) => {
    let { status, path } = msg
    if (status === 'getPath') {
      let filepath = dialog.showOpenDialog(win, {
        title: '选择备份目录',
        buttonLabel: '确定',
        properties: ['openDirectory'],
      })
      if (filepath) {
        event.reply('async-get', filepath)
      }
    } else {
      console.log('111111')
      var watcher = chokidar.watch(path, {
        ignored: /[\\/\\]\./,
        persistent: true,
        ignoreInitial: false,
        usePolling: true,
        useFsEvents: false,
        alwaysStat: true,
      })

      let log = console.log.bind(console)
      let filepath = []
      let backupPath = null

      let status = 0
      watcher
        .on('add', async function(path, stats) {
          const client = new ftp.Client()
          log('File', path, 'has been added', stats)
          let fileinfo = { path, stats }
          filepath.push(fileinfo)
          status++
          let extname = paths.basename(path)

          if (status > 1) {
            try {
              await client.access({
                host: '10.10.12.8',
                user: 'scitc',
                password: 'scitc',
              })
              await client
                .uploadFrom(path, `/BackUp/${extname}`)
                .then(() => {
                  console.log('同步成功')
                })
                .catch((error) => {
                  console.log(error, '同步失败')
                })
            } catch (error) {
              console.log(error)
            }
          }
        }) // 添加文件
        .on('addDir', function(path) {
          log('Directory', path, 'has been added')
          backupPath = path
        }) // 添加目录
        .on('change', function(path, stats) {
          log(stats)
        }) // 文件改变
        .on('unlink', (path) => log(`File ${path} has been removed`))
        .on('unlinkDir', (path) => {
          log(path)
        })
        .on('ready', async () => {
          const client = new ftp.Client()
          try {
            await client.access({
              host: '10.10.12.8',
              user: 'scitc',
              password: 'scitc',
            })
            await client
              .uploadFromDir(backupPath, '/BackUp')
              .then(() => {
                console.log('备份成功')
              })
              .catch((error) => {
                console.log(error)
              })
          } catch (error) {
            console.log(error)
          }
        })
        .on('error', function(error) {
          log('Error happened', error)
          watcher.close()
        })
    }
  })
  //downloadSave
  ipcMain.on('async-save', async (event) => {
    let path = dialog.showSaveDialog(win, {
      title: '下载',
      showsTagField: true,
      properties: [
        'createDirectory',
        'showOverwriteConfirmation',
        'dontAddToRecent',
      ],
    })
    if (path) {
      event.reply('async-savepath', path)
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
