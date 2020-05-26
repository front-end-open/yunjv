const client = require('basic-ftp')
const path = require('path')
import convert from './SizeConvert.js'
export default function ServerFactory(
  type,
  serverindx,
  config,
  localpath,
  remotepath,
) {
  if (this instanceof ServerFactory) {
    return new this[type](serverindx, config, localpath, remotepath)
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
  FTP: function(serverindx, config, localpath, remotepath) {
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
        await ftp.uploadFromDir(localpath, remotepath)
        const filelist = await ftp.list(remotepath)
        for (let [index, item] of filelist.entries()) {
          console.log(index)
          const { name, size, isDirectory, modifiedAt } = item
          currentFileInfo = {}
          currentFileInfo.id = (Math.random() + 1) * 10
          currentFileInfo.server_filename = name
          currentFileInfo.size = convert(size)
          currentFileInfo.parent = path.basename(remotepath)
          currentFileInfo.parentsPath = remotepath
          currentFileInfo.path = `${remotepath}/${name}`
          currentFileInfo.isdir = Number(isDirectory)
          currentFileInfo.local_mtime = modifiedAt
          fileData.push(currentFileInfo)
        }
        return fileData
      } catch (error) {
        ftp.close()
        console.log(error)
      }
    }
    //文件下载
    this.download = async function() {
      try {
        await ftp.access({
          host: 'localhost',
          user: 'username',
          password: '175623',
        })
        return await ftp.downloadToDir(localpath)
      } catch (error) {
        console.log(error)
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
