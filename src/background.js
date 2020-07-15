'use strict'

import {
  ipcMain,
  app,
  protocol,
  BrowserWindow,
  dialog,
} from 'electron'
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib'
import LoginBaidu from '@/lib/BaiduDiskLogin.js'
import { start } from 'repl'
import http from '@/server/index.js'
const OAuth2Provider = require('electron-oauth-helper/dist/oauth2').default
const querystring = require('querystring')
const isDevelopment = process.env.NODE_ENV !== 'production'
const Axios = require('axios')
const fs = require('fs')
const chokidar = require('chokidar')
const md5 = require('md5')
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
      var watcher = chokidar.watch(path, {
        ignored: /[\/\\]\./,
        persistent: true,
        ignoreInitial: false,
        usePolling: true,
        useFsEvents: false,
        alwaysStat: true,
      })

      let log = console.log.bind(console)
      let filepath = []
      watcher
        .on('add', function(path, stats) {
          log('File', path, 'has been added', stats)
          let fileinfo = { path, stats }
          filepath.push(fileinfo)
        }) // 添加文件
        .on('addDir', function(path) {
          log('Directory', path, 'has been added')
        }) // 添加目录
        .on('change', function(path, stats) {
          log(stats)
        }) // 文件改变
        .on('unlink', (path) => log(`File ${path} has been removed`))
        .on('unlinkDir', (path) => {
          log(path)
        })
        .on('ready', () => {
          // 初始化扫描完成，开始上传文件
          function singleUpload(fileinfo, i) {
            return new Promise((res, rej) => {
              let { path, stats } = fileinfo
              let size = stats.size
              let chunkSize = 3 * 1024 * 1024 //每片分块的大小3M
              //计算每块的结束位置
              let enddata = Math.min(size, (i + 1) * chunkSize)
              let arr = []
              //创建一个readStream对象，根据文件起始位置和结束位置读取固定的分片
              let readStream = fs.createReadStream(path, {
                start: i * chunkSize,
                end: enddata - 1,
              })
              //on data读取数据
              readStream.on('data', (data) => {
                arr.push(data)
              })
              //on end在该分片读取完成时触发
              readStream.on('end', () => {
                res(md5(Buffer.concat(arr)))
              })
              readStream.on('error', () => {
                rej('分片读取失败')
              })
            })
          }
          function singlePieces(fileinfo, i) {
            return new Promise((res, rej) => {
              let { path, stats } = fileinfo
              let size = stats.size
              let chunkSize = 3 * 1024 * 1024 //每片分块的大小3M
              //计算每块的结束位置
              let enddata = Math.min(size, (i + 1) * chunkSize)
              let arr = []
              //创建一个readStream对象，根据文件起始位置和结束位置读取固定的分片
              let readStream = fs.createReadStream(path, {
                start: i * chunkSize,
                end: enddata - 1,
              })
              //on data读取数据
              readStream.on('data', (data) => {
                arr.push(data)
              })
              //on end在该分片读取完成时触发
              readStream.on('end', () => {
                let blob = new Blob(arr)
                res(blob)
              })
              readStream.on('error', () => {
                rej('分片读取失败')
              })
            })
          }
          filepath.forEach(async (item) => {
            let { stats } = item
            let fileSize = stats.size
            let chunkSize = 4 * 1024 * 1024
            let pieces = Math.ceil(fileSize / chunkSize) //总共的分片数
            let block_lists = []
            for (let i = 0; i < pieces; i++) {
              let filemd5 = await singleUpload(item, i)
              block_lists.push(filemd5)
            }
            console.log(fileSize)
            let preRes = await http.post(
              `https://pan.baidu.com/rest/2.0/xpan/file?method=precreate&access_token=123.17ab2fea084763a72ce05e1a7ec74b3c.YsWy6lXitNM7caGvCWxAm1b6Hzf4LY_3feRIAK5.hQgeXQ`,
              {
                path: '/apps/BTBD',
                size: fileSize,
                isdir: 0,
                autoinit: 1,
                rtype: 1,
                block_list: JSON.stringify(block_lists),
              },
            )
            const { block_list } = preRes.data
            for (let i = 0; i < block_list.length; i++) {
              console.log(await singlePieces(item, i))
            }
          })
        })
        .on('error', function(error) {
          log('Error happened', error)
          watcher.close()
        })
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
