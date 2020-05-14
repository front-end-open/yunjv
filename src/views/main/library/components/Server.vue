<template>
  <div class="server">
    <el-row>
      <el-col :span="24">
        <div class="toolbar">
          <el-button type="primary" @click="dialogVisible = true" round
            >添加服务</el-button
          >
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="服务添加"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="服务名称" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="必须"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="服务类型" prop="option">
          <el-select
            @change="optionCheck(ruleForm.option)"
            v-model="ruleForm.option"
            placeholder="选择服务类型"
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div v-if="tag">
          <el-form-item label="服务URL" prop="IP">
            <el-input
              v-model="ruleForm.IP"
              placeholder="必须"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input v-model.number="ruleForm.port" clearable></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="usr">
            <el-input placeholder="可选" v-model="ruleForm.usr" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <el-input
              type="password"
              placeholder="可选"
              v-model="ruleForm.pwd"
              autocomplete="off"
              show-password
              clearable
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >立即添加</el-button
        >
      </span>
    </el-dialog>

    <div class="server-list">
      <el-row :gutter="12">
        <el-col :span="8" v-for="(list, index) in server" :key="index">
          <div class="cardBox">
            <el-card shadow="hover">
              <div class="drop" style="text-align: right">
                <el-dropdown trigger="click" @command="configServer">
                  <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      :command="`change${index}`"
                      icon="el-icon-s-tools"
                      >修改配置</el-dropdown-item
                    >
                    <el-dropdown-item
                      :command="index"
                      icon="el-icon-delete-solid"
                      >删除服务</el-dropdown-item
                    >
                    <el-dropdown-item
                      command="openFileList"
                      icon="el-icon-delete-solid"
                      >查看文件</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div class="serDialog">
                <el-dialog
                  title="配置修改"
                  :visible.sync="dialogVisible2"
                  width="30%"
                  :before-close="handleClose"
                >
                  <el-form
                    :model="sapServerConfig"
                    :rules="rulesinG"
                    ref="sapServerConfig"
                  >
                    <el-form-item label="标签" prop="serverName">
                      <el-input
                        v-model="sapServerConfig.serverName"
                        clearable
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="服务类型">
                      <span>{{ sapServerConfig.type }}</span>
                    </el-form-item>
                    <el-form-item label="URL" prop="host">
                      <el-input
                        v-model="sapServerConfig.host"
                        clearable
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="Port" prop="port">
                      <el-input
                        v-model.number="sapServerConfig.port"
                        clearable
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="账户" prop="user">
                      <el-input
                        v-model="sapServerConfig.user"
                        clearable
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password" clearable>
                      <el-input
                        v-model.number="sapServerConfig.password"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible2 = false">取 消</el-button>
                    <el-button type="primary" @click="submitConfigFrom()"
                      >确 定</el-button
                    >
                  </span>
                </el-dialog>
              </div>
              <div>
                <v-icon name="server"></v-icon>
                <h2
                  style="display:inline-block; vertical-align: 2px; padding-left: 12px;"
                >
                  {{ list.serverName }}
                </h2>
              </div>

              <div>
                <v-icon name="code-branch"></v-icon>
                <h4
                  style="display:inline-block;vertical-align:2px; padding-left: 12px"
                >
                  {{ list.host ? list.host : '' }}
                </h4>
              </div>
              <el-progress
                :percentage="list.range"
                :color="customColors"
              ></el-progress>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
const { tstring } = require('@/lib/TailoringString')
const ipcRenderer = require('electron').ipcRenderer
export default {
  name: 'Server',
  data() {
    var validateHost = (rule, value, callback) => {
      // IP匹配正则
      const regexp = new RegExp(
        /^(?:(?:25[0-5]|2[0-4]\d|[1-9]?\d|1\d{2})\.){3}(?:25[0-5]|2[0-4]\d|[1-9]?\d|1\d{2})$/,
        'g',
      )
      if (!value.match(regexp)) {
        callback(new Error('输入IP不合法'))
      } else {
        callback()
      }
    }
    var validatePort = (rule, value, callback) => {
      if (value < 0 || value > 65535) {
        console.log(value)
        callback(new Error('端口非法，请从新输入'))
      }
    }
    return {
      tag: false,
      dialogVisible: false,
      ruleForm: {
        name: '',
        option: '',
        IP: '',
        port: 21,
        usr: '',
        pwd: '',
      },
      rules: {
        name: [
          { required: true, message: '输入服务名称', trigger: 'blur' },
          {
            min: 3,
            max: 50,
            message: '长度在 5 到 50 个字符',
            trigger: 'blur',
          },
        ],
        option: [
          { required: true, message: '至少选择一项目服务', trigger: 'change' },
        ],
        IP: [
          {
            required: true,
            message: '输入IP',
            trigger: 'blur',
          },
          {
            validator: validateHost,
            trigger: ['blur', 'change'],
          },
        ],
        port: [
          { required: true, message: '端口不能为空' },
          { type: 'number', message: '端口必须为数字值' },
        ],
        usr: [
          { min: 0, max: 200, message: '长度在 0-200之间', trigger: 'change' },
        ],
        pwd: [
          { min: 0, max: 200, message: '长度在 0-200之间', trigger: 'change' },
        ],
      },
      rulesinG: {
        serverName: [
          { required: true, message: '输入服务名称', trigger: 'blur' },
          {
            min: 0,
            max: 50,
            message: '长度在 0 到 50 个字符',
            trigger: 'blur',
          },
        ],
        port: [
          { required: true, message: '端口不能为空' },
          { type: 'number', message: '端口必须为数字值' },
          { validator: validatePort, trigger: 'blur' },
        ],
        host: [
          {
            required: true,
            message: '输入IP',
            trigger: 'blur',
          },
          {
            validator: validateHost,
            trigger: ['blur', 'change'],
          },
        ],
        usr: [
          { min: 0, max: 200, message: '长度在 0-200之间', trigger: 'change' },
        ],
        pwd: [
          { min: 0, max: 200, message: '长度在 0-200之间', trigger: 'change' },
        ],
      },
      options: [
        {
          value: 'baiduyun0',
          label: '百度云盘',
        },
        {
          value: 'ftp1',
          label: 'Ftp',
        },
      ],
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 },
      ],
      server: [],
      sapServerConfig: {},
      dialogVisible2: false,
    }
  },
  created() {
    if (localStorage.getItem('config')) {
      this.server = JSON.parse(localStorage.getItem('config'))
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    submitForm(formName) {
      const list = {},
        config = localStorage.getItem('config')
          ? JSON.parse(localStorage.getItem('config'))
          : []
      console.log(config)
      const tag = tstring(this.ruleForm.option) // 展开添加服务面板tag
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (tag === 0) {
            // 百度认证
            ipcRenderer.send('asynchronous-message', 'ping') // 发送消息
            ipcRenderer.on('asynchronous-reply', (event, arg) => {
              const { state, info } = arg
              const { access_token } = JSON.parse(info)
              if (state) {
                //授权成功
                list.serverName = this.ruleForm.name
                list.type = this.ruleForm.option
                list.range = 100
                list.token = access_token
                this.server.push(list)
                config.push(list)
                window.localStorage.setItem(`config`, JSON.stringify(config)) //存储配置
              }
            })
          } else {
            console.log('ftp')
            //在每次组件加载时，拿到服务器数据，添加服务时候进行比对，对于同样的iP将排除
            // if (config !== []) {
            //   console.log('ftp2')
            //   for (let val of config) {
            //     console.log(val)
            //     if (val.host || val.host !== this.ruleForm.IP) {
            //       // 添加相同服务拒绝
            //       //再次添加不同服务
            //       list.serverName = this.ruleForm.name //ftp
            //       list.host = this.ruleForm.IP
            //       list.type = this.ruleForm.option
            //       list.port = this.ruleForm.port
            //       list.user = this.ruleForm.usr
            //       list.password = this.ruleForm.password
            //       list.range = 50
            //       list.tag = tag
            //       this.server.push(list)
            //       config.push(list)
            //       window.localStorage.setItem(`config`, JSON.stringify(config))
            //       ipcRenderer.send('asynchronous-message', list)
            //       break
            //     } else {
            //       alert('服务已经被添加')
            //       break
            //     }
            //   }
            // } else {
            console.log('添加新服务')
            // ftp服务添加
            list.serverName = this.ruleForm.name //ftp
            list.host = this.ruleForm.IP
            list.type = this.ruleForm.option
            list.port = this.ruleForm.port
            list.user = this.ruleForm.usr
            list.password = this.ruleForm.password
            list.range = 50
            list.tag = tag
            this.server.push(list)

            config.push(list)
            window.localStorage.setItem(`config`, JSON.stringify(config))
            // ipcRenderer.send('asynchronous-message', list)
          }
          this.dialogVisible = false // 关闭dialog的时机
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    optionCheck(value) {
      if (value && tstring(this.ruleForm.option) === 1) {
        this.tag = true
      } else {
        this.tag = false
      }
    },
    configServer(commtag) {
      let config = JSON.parse(localStorage.getItem('config'))

      if (Number.isInteger(commtag)) {
        const config = JSON.parse(localStorage.getItem('config'))
        //[].length
        if (this.server) {
          this.server.splice(Number(commtag), 1)
          config.splice(Number(commtag), 1)
          localStorage.setItem('config', JSON.stringify(config))
          this.$message({
            message: '删除成功',
            type: 'success',
          })
        }
      } else if (commtag === 'openFileList') {
        config.forEach((val) => {
          if (tstring(val.type) === 1) {
            this.$router.push({
              path: '/main/library/filelist',
              query: { server: 'ftp' },
            })
          } else if (tstring(val.type)) {
            this.$router.push({
              path: '/main/library/filelist',
              query: { server: 'baid' },
            })
          }
        })
      } else {
        const tag = tstring(commtag),
          config = JSON.parse(localStorage.getItem('config'))[tag]
        // 后续情况，需要在打开对话框的时候，就请求当前服务配置
        if (config.type && tstring(config.type)) {
          this.sapServerConfig = config
          this.sapServerConfig.flat = tag
          this.dialogVisible2 = true //打开对话框
        } else {
          alert('暂不提供修改')
        }
      }
    },
    submitConfigFrom() {
      //这里暂为提供修改配置表单验证， 表单获取出现bug.
      // 先模拟修改，由于没发拿到当前该条数据的tag表识，因此没发准确插入数据库修改。
      // 后期存储数据库，统一为每条数据进行唯一标识。
      const config = JSON.parse(localStorage.getItem('config'))
      config.splice(this.sapServerConfig.flag, 1)
      this.server.splice(this.sapServerConfig.flag, 1)

      this.server.push(this.sapServerConfig)
      config.push(this.sapServerConfig)
      localStorage.setItem('config', JSON.stringify(config))
      this.$message({
        showClose: true,
        message: '恭喜你，这是一条成功消息',
        type: 'success',
      })
      this.dialogVisible2 = false
    },
    openFile() {
      this.$router.push('/main/library/filelist')
    },
  },
}
</script>
<style lang="less" scoped>
.server-list {
  margin: 20px;
}
</style>
