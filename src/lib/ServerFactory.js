const client = require('basic-ftp')
const path = require('path')
import convert from './SizeConvert.js'
import OwnerConvert from './PERMISSIONCONVERT.js'
export default function ServerFactory(
  type,
  serverindx,
  config,
  localpath,
  remotepath,
  rowfileinfo,
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
    console.log('Smb')
  },
  FTP: function(serverindx, config, localpath, remotepath, rowfileinfo) {
    //连接ftp
    const ftp = new client.Client()
    // 服务连接
    // 文件上传
    this.upload = async function() {
      let currentFileInfo = {},
        fileData = []
      try {
        await ftp.access({
          host: 'localhost',
          user: 'username',
          password: '175623',
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
    // //文件移动
    // this.remove = async function() {
    //   this.client.ftp.verbose = true
    // }
    // //删除
    // this.delete = async function() {
    //   this.client.ftp.verbose = true
    //   //文件目录删除
    //   this.client.removeDir()
    //   //文件删除
    //   this.client.remove()
    // }
    // //重命名
    // this.rename = async function() {
    //   this.client.rename(config.remote, 'config.remote')
    // }
  },
  SEAFILE: function() {
    console.log('seafile')
  },
}
