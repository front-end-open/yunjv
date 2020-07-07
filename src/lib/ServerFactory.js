/**
 * 多服务类型类接口封装
 * @param {string} type - 服务类型
 * @param {number} serverindx - 服务索引
 * @param {config} config - 服务配置
 * @param {string} localpath - 本地路径
 * @param {string} remotepath - 服务远程路径
 * @param {object} rowfileinfo - other
 */

const client = require('basic-ftp')
const path = require('path')
const SMB = require('@marsaud/smb2')
const fs = require('fs')
// const md5 = require('md5')
const { SeafileAPI } = require('seafile-js')
import SizeConvert from '@/lib/SizeConvert.js'
import convert from './SizeConvert.js'
import OwnerConvert from './PERMISSIONCONVERT.js'
import http from '@/server/index.js'
import axios from 'axios'
import store from '@/store/index.js'
import { Buffer } from 'buffer'
import Distinct from '@/lib/arryDuplicateRemove.js'

export default function ServerFactory(
  type,
  serverindx = '',
  config = '',
  localpath = '',
  remotepath = '',
  rowfileinfo = '',
) {
  if (this instanceof ServerFactory) {
    return new this[type](
      serverindx,
      config,
      localpath,
      remotepath,
      rowfileinfo,
    )
  } else {
    throw new Error(
      '[wangshan-warn] the ServerFactory(constructor) must use new keywords! so you can new ServerFactory',
    )
  }
}
// 服务基类添加
ServerFactory.prototype = {
  BaiDu: function(index, config, lpath, remotepath, rowfileinfo) {
    console.log(index, config, lpath, remotepath, rowfileinfo)
    // 文件信息读取
    this.singleUpload = function(filepath) {
      let stats = fs.statSync(filepath) // 文件信息
      let chunkSize = 4 * Math.pow(1024, 2) // 分片大小
      let size = stats.size // 文件大小
      let pieces = Math.ceil(size / chunkSize) // 文件切片数量
      let filename = path.basename(filepath)

      const stream = fs.createReadStream(lpath)
      let arr = []

      stream.on('data', (data) => {
        arr.push(data)
      })
      stream.on('end', function() {
        var fileC = new File(Buffer.concat(arr), filename)
        // var fileC = Buffer.concat(arr)
        store.commit('upLoadFIlelist', {
          filename,
          chunkSize,
          size,
          pieces,
          lpath,
          fileC,
        })
      })
    }
    this.uploadpieces = function(chunkSize, size, i, lpath, file) {
      // 创建可读流
      console.log(1)
      let enddata = Math.min(size, (i + 1) * chunkSize)
      let arr = []

      console.log('chunkSize', chunkSize)
      console.log('size', size)
      //创建一个readStream对象，根据文件起始位置和结束位置读取固定的分片
      let readStream = fs.createReadStream(lpath, {
        start: i * chunkSize,
        end: enddata - 1,
      })
      //on data读取数据
      readStream.on('data', (data) => {
        arr.push(data)
      })
      //on end在该分片读取完成时触发
      readStream.on('end', async () => {
        // let convert = [md5(Buffer.concat(arr))]
        // let blob = new Blob(arr)
        console.log(arr)
        http
          .post(
            `/rest/2.0/xpan/file?method=precreate&access_token=123.408e3e7cbc0ba103a86b3bc80131f84a.Ymd0wqY1YGm0DkZJL0NRQBR-6EVbhgVqBZhhNkT.BDR5Ig`,
            {
              path: '/apps/BTBD',
              size,
              isdir: '0',
              autoinit: 1,
              rtype: 1,
              block_list: convert,
            },
          )
          .then((res) => {
            console.log(res.data)
            let params = new FormData()
            params.append('file', file)
            console.log(file)
            axios
              .post(
                `/rest/2.0/pcs/superfile2?method=upload&access_token=123.9b363f1852f72c024a6470c1e5e730fa.YgzruX0wiZqvTI4l6cI9XHemcKfx6yl9mBF4IdL.Bp9iaA&type=tmpfile&path=/apps/BTBD&uploadid=N1-NjEuMTU3LjI0My4xMjE6MTU5MjE5MDI4NjozODYwNzE1NTUzNjI5MTQ3Mzk1&partseq=1`,
                params,
                {
                  headers: { 'Content-Type': 'multipart/form-data' },
                },
              )
              .then((res) => {
                console.log(res)
              })
              .catch((error) => {
                console.log(error.toJSON())
              })
          })
      })
    }
  },
  SMB: function(serverindx, config) {
    // 首页文件目录加载
    this.loadFile = function() {
      let smbData = [] //存放smb数据
      const { host, user, pwd } = config[serverindx]
      try {
        const smbclient = new SMB({
          share: `\\\\${host}\\share`,
          domain: 'WORKGROUP',
          username: user,
          password: pwd,
        })
        smbclient.readdir('', (err, files) => {
          if (err) throw err
          let smbFile = {}
          for (const file of files) {
            smbFile = {}
            smbFile.id = Math.random()
            smbFile.parentsPath = ''
            smbFile.path = path.extname(file) ? `${file}` : `${file}\\\\`
            smbFile.server_filename = file
            smbFile.isdir = path.extname(file) ? 0 : 1
            smbData.push(smbFile)
          }
        })
        return smbData
      } catch (error) {
        console.log(error)
      }
    }
    // 目录创建

    // 文件上传
    this.upload = function(path, destination, parent) {
      const { host, pwd, user } = config[serverindx]
      let fileList = null
      try {
        var smbclient = new SMB({
          share: `\\\\${host}\\share`,
          domain: 'WORKGROUP',
          username: user,
          password: pwd,
          autocloseTimeout: 0,
        })
        smbclient.createWriteStream(path, function(err, writeStream) {
          if (err) throw err
          var readStream = fs.createReadStream(destination)
          readStream.pipe(writeStream)
          // TODO: 列表更新
          smbclient.readdir(parent, (error, files) => {
            if (error) throw error
            console.log(files)
            fileList = files
          })
        })
        return fileList
      } catch (error) {
        smbclient.disconnect()

        console.log(error)
      }
    }
    // 文件下载
    this.download = function(path, destination) {
      const { host, pwd, user } = config[serverindx]

      try {
        var smbclient = new SMB({
          share: `\\\\${host}\\share`,
          domain: 'WORKGROUP',
          username: user,
          password: pwd,
          autocloseTimeout: 0,
        })
        smbclient.createReadStream(path, function(err, readStream) {
          if (err) throw err
          var writeStream = fs.createWriteStream(destination)
          readStream.pipe(writeStream)
        })
        smbclient.disconnect()
      } catch (error) {
        smbclient.disconnect()
        console.log(error)
      }
    }
  },
  FTP: function(serverindx, config, localpath, remotepath, rowfileinfo) {
    //连接ftp
    const ftp = new client.Client()
    // 服务连接
    this.loadFile = async function() {
      const config = JSON.parse(localStorage.getItem('config'))[serverindx]
      const { host, user, pwd } = config
      try {
        await ftp
          .access({
            host,
            user,
            password: pwd,
            secure: false,
          })
          .then((res) => {
            console.log(res)
          })
        return await ftp.list('')
      } catch (err) {
        ftp.close()
      }
    }
    // 文件上传
    this.upload = async function() {
      const formatLocalPath = localpath.split('/')
      const { host, user, pwd } = config[serverindx]
      let currentFileInfo = {},
        fileData = []

      try {
        await ftp.access({
          host,
          user,
          password: pwd,
        })
        ftp.trackProgress((info) => {
          console.log('File', info.name)
          console.log('Type', info.type)
          console.log('Transferred', info.bytes)
          console.log('Transferred Overall', info.bytesOverall)
        })
        await ftp
          .uploadFromDir(
            localpath,
            `${remotepath}/${formatLocalPath[formatLocalPath.length - 1]}`,
          )
          .then((res) => {
            console.log(res)
          })
        await ftp
          .list(remotepath)
          .then((res) => {
            for (let [index, item] of res.entries()) {
              console.log(index)
              const { name, size, isDirectory, permissions, date, user } = item
              currentFileInfo = {}
              currentFileInfo.id = (Math.random() + 1) * 10
              currentFileInfo.server_filename = name
              currentFileInfo.size = convert(size)
              currentFileInfo.parent = path.basename(remotepath)
              currentFileInfo.parentsPath = remotepath
              currentFileInfo.path = `${remotepath}/${name}`
              currentFileInfo.isdir = Number(isDirectory)
              currentFileInfo.local_mtime = date
              currentFileInfo.permission = permissions
                ? OwnerConvert(permissions)
                : ''
              currentFileInfo.Owner = user
              fileData.push(currentFileInfo)
            }
          })
          .catch((error) => {
            console.log(error)
          })
        const filelist = await ftp.list(remotepath)
        for (let [index, item] of filelist.entries()) {
          console.log(index)
          const { name, size, isDirectory, permissions, date, user } = item
          currentFileInfo = {}
          currentFileInfo.id = (Math.random() + 1) * 10
          currentFileInfo.server_filename = name
          currentFileInfo.size = convert(size)
          currentFileInfo.parent = path.basename(remotepath)
          currentFileInfo.parentsPath = remotepath
          currentFileInfo.path =
            remotepath == '/' ? `${remotepath}${name}` : `${remotepath}/${name}`
          currentFileInfo.isdir = Number(isDirectory)
          currentFileInfo.local_mtime = date
          currentFileInfo.permission = permissions
            ? OwnerConvert(permissions)
            : ''
          currentFileInfo.Owner = user
          fileData.push(currentFileInfo)
        }
        return fileData
      } catch (error) {
        ftp.close()
        console.log(error, JSON.stringify(error))
      }
    }
    //文件下载
    this.download = async function() {
      const { host, user, pwd } = config[serverindx]
      const { server_filename, path, isdir } = rowfileinfo
      try {
        await ftp.access({
          host,
          user,
          password: pwd,
        })
        if (isdir) {
          ftp.trackProgress((info) => {
            console.log('File', info.name)
            console.log('Type', info.type)
            console.log('Transferred', info.bytes)
            console.log('Transferred Overall', info.bytesOverall)
          })
          return await ftp.downloadToDir(localpath, path).then((res) => {
            console.log(res)
          })
        } else {
          return await ftp
            .downloadTo(`${localpath}/${server_filename}`, path)
            .then((res) => {
              console.log(res)
            })
        }
      } catch (error) {
        ftp.close()
      }
    }
    // 创建目录
    this.createDir = async function(creatName) {
      const { host, user, pwd } = config[serverindx]
      let currentFileInfo = {},
        fileData = []
      try {
        await ftp.access({
          host,
          user,
          password: pwd,
          secure: false,
        })
        await ftp.ensureDir(`${remotepath}/${creatName}-${Math.random()}`)

        await ftp.list(remotepath).then((res) => {
          for (let item of res) {
            const { name, size, isDirectory, permissions, date, user } = item
            currentFileInfo = {}
            currentFileInfo.id = (Math.random() + 1) * 10
            currentFileInfo.server_filename = name
            currentFileInfo.size = SizeConvert(size)
            currentFileInfo.parent = path.basename(remotepath)
            currentFileInfo.parentsPath = remotepath
            currentFileInfo.path =
              remotepath == '/'
                ? `${remotepath}${name}`
                : `${remotepath}/${name}`
            currentFileInfo.isdir = Number(isDirectory)
            currentFileInfo.local_mtime = date
            currentFileInfo.permission = permissions
              ? OwnerConvert(permissions)
              : ''
            currentFileInfo.Owner = user
            fileData.unshift(currentFileInfo)
          }
        })
        ftp.close()
        return fileData
      } catch (error) {
        console.log(error)

        ftp.close()
      }
    }
    // //删除
    // this.delete = async function() {
    //   this.client.ftp.verbose = true
    //   //文件目录删除
    //   this.client.removeDir()
    //   //文件删除
    //   this.client.remove()
    // }
    //重命名
    this.rename = async function(currentName, newName) {
      const { host, user, pwd } = config[serverindx]
      try {
        await client.access({
          host,
          user,
          password: pwd,
          secure: false,
        })
        await client.rename(
          currentName, //设置要更改的文件/文件夹路径
          `${currentName}/${newName}`, //设置更改后的路径---祖先路径+当前文件名
        )

        await client.list(this.rowDate[1].parentsPath).then((res) => {
          this.tableDatas = []
          for (let [index, item] of res.entries()) {
            const { name, size, isDirectory, modifiedAt } = item
            this.singleFile = {}
            this.singleFile.parent = res.server_filename //行目录名
            //子目录请求内容
            this.singleFile.id = index + Math.random()
            this.singleFile.server_filename = name
            this.singleFile.size = SizeConvert(size)
            this.singleFile.parentsPath = this.rowDate[1].parentsPath
            this.singleFile.path =
              this.rowDate[1].parentsPath == '/'
                ? `${this.rowDate[1].parentsPath}${name}`
                : `${this.rowDate[1].parentsPath}/${name}`
            this.singleFile.isdir = Number(isDirectory)
            this.singleFile.local_mtime = modifiedAt
            this.tableDatas.push(this.singleFile) //把行请求内容加入到表格数据
          }
        })
        this.tableData = this.tableDatas //将新的列表赋给原列表

        this.centerDialogVisible2 = false //关闭模态框
      } catch (error) {
        console.log(error)
        client.close()
      }
    }
  },
  SEAFILE: function(index, config, localpath) {
    let seafileAPI = new SeafileAPI(),
      { host, user, pwd } = config[index],
      obj = { server: host, username: user, password: pwd },
      arr = [],
      singleFile = {},
      axiosListDir = [],
      arrDir = [],
      data = []
    seafileAPI.init(obj)
    console.log(index, config, localpath)
    this.createDir = function() {
      seafileAPI.login().then(async (response) => {
        console.log(response)
        let repos = await seafileAPI.listRepos()
        repos.data.repos.forEach((item) => {
          arr.push(item.repo_id)
        })

        Distinct(arr).forEach((item) => {
          axiosListDir.push(seafileAPI.listDir(item, ''))
        })

        await Promise.all(axiosListDir).then((res) => {
          res.forEach((item) => {
            for (let val of item.data.dirent_list) {
              arrDir.push(val)
            }
          })
        })

        for (let item of arrDir) {
          if (item.type == 'file') {
            console.log(item, 'file')
            const { name, size, type, permissions, mtime, parent_dir } = item
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
          } else {
            console.log(item, 'dir')
            const { name, type, permissions, mtime, parent_dir } = item
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
          }
          data.push(singleFile)
        }
      })
    }
  },
}
