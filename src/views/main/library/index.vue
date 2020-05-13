<template>
  <div>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
// const { tstring } = require('@/lib/TailoringString')
// const ipcRenderer = require('electron').ipcRenderer
// let child = null
export default {
  name: 'Library',
  // data() {
  //   var validateHost = (rule, value, callback) => {
  //     // IP匹配正则
  //     const regexp = new RegExp(
  //       /^(?:(?:25[0-5]|2[0-4]\d|[1-9]?\d|1\d{2})\.){3}(?:25[0-5]|2[0-4]\d|[1-9]?\d|1\d{2})$/,
  //       'g',
  //     )
  //     if (!value.match(regexp)) {
  //       callback(new Error('输入IP不合法'))
  //     } else {
  //       callback()
  //     }
  //   }
  //   var validatePort = (rule, value, callback) => {
  //     if (value < 0 || value > 65535) {
  //       console.log(value)
  //       callback(new Error('端口非法，请从新输入'))
  //     }
  //   }
  //   return {
  //     tag: false,
  //     dialogVisible: false,
  //     ruleForm: {
  //       name: '',
  //       option: '',
  //       IP: '',
  //       port: 21,
  //       usr: '',
  //       pwd: '',
  //     },
  //     rules: {
  //       name: [
  //         { required: true, message: '输入服务名称', trigger: 'blur' },
  //         {
  //           min: 3,
  //           max: 50,
  //           message: '长度在 5 到 50 个字符',
  //           trigger: 'blur',
  //         },
  //       ],
  //       option: [
  //         { required: true, message: '至少选择一项目服务', trigger: 'change' },
  //       ],
  //       IP: [
  //         {
  //           required: true,
  //           message: '输入IP',
  //           trigger: 'blur',
  //         },
  //         {
  //           validator: validateHost,
  //           trigger: ['blur', 'change'],
  //         },
  //       ],
  //       port: [
  //         { required: true, message: '端口不能为空' },
  //         { type: 'number', message: '端口必须为数字值' },
  //       ],
  //       usr: [
  //         { min: 0, max: 200, message: '长度在 0-200之间', trigger: 'change' },
  //       ],
  //       pwd: [
  //         { min: 0, max: 200, message: '长度在 0-200之间', trigger: 'change' },
  //       ],
  //     },
  //     rulesinG: {
  //       serverName: [
  //         { required: true, message: '输入服务名称', trigger: 'blur' },
  //         {
  //           min: 0,
  //           max: 50,
  //           message: '长度在 0 到 50 个字符',
  //           trigger: 'blur',
  //         },
  //       ],
  //       port: [
  //         { required: true, message: '端口不能为空' },
  //         { type: 'number', message: '端口必须为数字值' },
  //         { validator: validatePort, trigger: 'blur' },
  //       ],
  //       host: [
  //         {
  //           required: true,
  //           message: '输入IP',
  //           trigger: 'blur',
  //         },
  //         {
  //           validator: validateHost,
  //           trigger: ['blur', 'change'],
  //         },
  //       ],
  //       usr: [
  //         { min: 0, max: 200, message: '长度在 0-200之间', trigger: 'change' },
  //       ],
  //       pwd: [
  //         { min: 0, max: 200, message: '长度在 0-200之间', trigger: 'change' },
  //       ],
  //     },
  //     options: [
  //       {
  //         value: 'baiduyun0',
  //         label: '百度云盘',
  //       },
  //       {
  //         value: 'ftp1',
  //         label: 'Ftp',
  //       },
  //     ],
  //     customColors: [
  //       { color: '#f56c6c', percentage: 20 },
  //       { color: '#e6a23c', percentage: 40 },
  //       { color: '#5cb87a', percentage: 60 },
  //       { color: '#1989fa', percentage: 80 },
  //       { color: '#6f7ad3', percentage: 100 },
  //     ],
  //     server: [],
  //     sapServerConfig: {},
  //     dialogVisible2: false,
  //   }
  // },
  // created() {
  //   if (localStorage.getItem('config')) {
  //     this.server = JSON.parse(localStorage.getItem('config'))
  //   }
  // },
  // methods: {
  //   handleClose(done) {
  //     this.$confirm('确认关闭？')
  //       .then(() => {
  //         done()
  //       })
  //       .catch((error) => {
  //         console.log(error)
  //       })
  //   },
  //   submitForm(formName) {
  //     const list = {},
  //       config = localStorage.getItem('config')
  //         ? JSON.parse(localStorage.getItem('config'))
  //         : []
  //     const tag = tstring(this.ruleForm.option) // 展开添加服务面板tag
  //     this.$refs[formName].validate((valid) => {
  //       if (valid) {
  //         if (tag === 0) {
  //           // 百度认证
  //           ipcRenderer.send('asynchronous-message', 'ping') // 发送消息
  //           ipcRenderer.on('asynchronous-reply', (event, arg) => {
  //             const { state, info } = arg
  //             console.log(state, info)
  //             if (state) {
  //               //授权成功
  //               list.serverName = this.ruleForm.name
  //               list.type = this.ruleForm.option
  //               list.range = 100
  //               list.token = info.access_token
  //               this.server.push(list)
  //               config.push(list)
  //               window.localStorage.setItem(`config`, JSON.stringify(config)) //存储配置
  //             }
  //           })
  //         } else {
  //           //在每次组件加载时，拿到服务器数据，添加服务时候进行比对，对于同样的iP将排除
  //           if (JSON.parse(localStorage.getItem('config'))) {
  //             for (let val of JSON.parse(localStorage.getItem('config'))) {
  //               if (val.host == this.ruleForm.IP) {
  //                 alert('服务已被添加')
  //                 break
  //               }
  //             }
  //           } else {
  //             // ftp服务添加
  //             list.serverName = this.ruleForm.name //ftp
  //             list.host = this.ruleForm.IP
  //             list.type = this.ruleForm.option
  //             list.port = this.ruleForm.port
  //             list.user = this.ruleForm.usr
  //             list.password = this.ruleForm.password
  //             list.range = 50
  //             list.tag = tag
  //             this.server.push(list)

  //             config.push(list)
  //             window.localStorage.setItem(`config`, JSON.stringify(config))
  //             ipcRenderer.send('asynchronous-message', list)
  //           }
  //         }
  //         this.dialogVisible = false // 关闭dialog的时机
  //       } else {
  //         return false
  //       }
  //     })
  //   },
  //   resetForm(formName) {
  //     this.$refs[formName].resetFields()
  //   },
  //   optionCheck(value) {
  //     if (value && tstring(this.ruleForm.option) === 1) {
  //       this.tag = true
  //     } else {
  //       this.tag = false
  //     }
  //   },
  //   configServer(commtag) {
  //     if (Number.isInteger(commtag)) {
  //       const config = JSON.parse(localStorage.getItem('config'))
  //       //[].length
  //       if (this.server) {
  //         this.server.splice(Number(commtag), 1)
  //         config.splice(Number(commtag), 1)
  //         localStorage.setItem('config', JSON.stringify(config))
  //         this.$message({
  //           message: '删除成功',
  //           type: 'success',
  //         })
  //       }
  //     } else {
  //       const tag = tstring(commtag),
  //         config = JSON.parse(localStorage.getItem('config'))[tag]
  //       // 后续情况，需要在打开对话框的时候，就请求当前服务配置
  //       if (config.type && tstring(config.type)) {
  //         this.sapServerConfig = config
  //         this.sapServerConfig.flat = tag
  //         this.dialogVisible2 = true //打开对话框
  //       } else {
  //         alert('暂不提供修改')
  //       }
  //     }
  //   },
  //   submitConfigFrom() {
  //     //这里暂为提供修改配置表单验证， 表单获取出现bug.
  //     // 先模拟修改，由于没发拿到当前该条数据的tag表识，因此没发准确插入数据库修改。
  //     // 后期存储数据库，统一为每条数据进行唯一标识。
  //     const config = JSON.parse(localStorage.getItem('config'))
  //     config.splice(this.sapServerConfig.flag, 1)
  //     this.server.splice(this.sapServerConfig.flag, 1)

  //     this.server.push(this.sapServerConfig)
  //     config.push(this.sapServerConfig)
  //     localStorage.setItem('config', JSON.stringify(config))
  //     this.$message({
  //       showClose: true,
  //       message: '恭喜你，这是一条成功消息',
  //       type: 'success',
  //     })
  //     this.dialogVisible2 = false
  //   },
  // },
}
</script>
<style lang="less" scoped>
.el-row {
  margin: -20px -20px 0px -20px;
}
.toolbar {
  padding: 12px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
