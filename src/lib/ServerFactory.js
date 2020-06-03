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
// const SMB = require('@marsaud/smb2')
import SizeConvert from '@/lib/SizeConvert.js'
import convert from './SizeConvert.js'
import OwnerConvert from './PERMISSIONCONVERT.js'

export default function ServerFactory(
  type,
  serverindx,
  config,
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
  BaiDu: function() {
    console.log('baidu')
  },
  SMB: function() {
    console.log('smb')
  },
  FTP: function(serverindx, config, localpath, remotepath, rowfileinfo) {
    //连接ftp
    const ftp = new client.Client()
    // 服务连接
    // 文件上传
    this.upload = async function() {
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
        // if (isdir) {
        await ftp.uploadFromDir(localpath, remotepath)
        // } else {
        //   await ftp.appendFrom(localpath, parentsPath)
        // }
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
            return fileData
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
          currentFileInfo.path = `${remotepath}/${name}`
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
      const { server_filename, path, isdir } = rowfileinfo
      try {
        await ftp.access({
          host: '10.10.12.8',
          user: 'scitc',
          password: 'scitc',
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
            currentFileInfo.parentsPath = this.path
            currentFileInfo.path = `${remotepath}/${name}`
            currentFileInfo.isdir = Number(isDirectory)
            currentFileInfo.local_mtime = date
            currentFileInfo.permission = permissions
              ? OwnerConvert(permissions)
              : ''
            currentFileInfo.Owner = user
            fileData.unshift(currentFileInfo)
          }
        })
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
  SEAFILE: function() {
    console.log('seafile')
  },
}
