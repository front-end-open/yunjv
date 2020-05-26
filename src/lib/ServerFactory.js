const ftp = require('basic-ftp')
const config = JSON.parse(localStorage.getItem('config'))

export default function ServerFactory(type, serverindx, content) {
  console.log(type, serverindx)
  if (this instanceof ServerFactory) {
    return new this[type](content)
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
  FTP: function(serverindx, content) {
    // 创建ftp服务实列
    this.client = new ftp.Client()
    //获取服务配置
    const { host, user, password } = config[serverindx]
    //服务连接
    // 文件上传
    this.upload = async function() {
      this.client.access({
        host,
        user,
        password,
      })
      this.client.ftp.verbose = true
      return await this.client.uploadFromDir(content.local, content.remote)
    }
    //文件下载
    this.download = async function() {
      this.client.access({
        host,
        user,
        password,
      })
      this.client.ftp.verbose = true
      return await this.client.downloadToDir(content.local, content.remote)
    }
    //文件移动
    this.remove = async function() {
      this.client.access({
        host,
        user,
        password,
      })
      this.client.ftp.verbose = true
    }
    //删除
    this.delete = async function() {
      this.client.access({
        host,
        user,
        password,
      })
      this.client.ftp.verbose = true
      //文件目录删除
      this.client.removeDir(content.remote)
      //文件删除
      this.client.remove(content.remote)
    }
    //重命名
    this.rename = async function() {
      this.client.rename(config.remote, 'config.remote')
    }
  },
  SEAFILE: function() {
    console.log('seafile')
  },
}
