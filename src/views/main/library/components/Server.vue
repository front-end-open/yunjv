<template>
  <div class="server" v-loading="loadding">
    <el-row type="flex" class="row-bg" justify="end">
      <el-col :span="2">
        <div class="grid-content bg-purple">
          <el-button
            type="primary"
            @click="dialogVisible = true"
            icon="el-icon-plus"
            circle
          ></el-button>
          <!-- 添加服务 -->
          <el-dialog
            title="服务添加"
            :visible.sync="dialogVisible"
            :before-close="closeAddServerdialog"
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
                  @change="isOpenPanel(ruleForm.option)"
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
              <div v-if="serverPanelVisible">
                <el-form-item label="IP或URL" prop="IP">
                  <el-input
                    v-model="ruleForm.IP"
                    placeholder="如：0.0.0.0"
                    clearable
                  ></el-input>
                </el-form-item>
                <el-form-item label="端口" prop="port">
                  <el-input v-model.number="ruleForm.port"></el-input>
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
              <el-button @click="cancelAddServer('ruleForm')">取消</el-button>
              <el-button type="primary" @click="addServer('ruleForm')"
                >立即添加</el-button
              >
            </span>
          </el-dialog>
        </div></el-col
      >
    </el-row>
    <!-- 服务列表 -->
    <div class="server-list">
      <el-row :gutter="12" class="listCard">
        <el-col :span="8" v-for="(list, index) in server" :key="index">
          <div>
            <el-card shadow="hover" class="ServerCard">
              <div class="cardSelec">
                <el-dropdown trigger="click" @command="singleServerSelec">
                  <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      :command="{ opration: 'changeConfig', index: list.id }"
                      icon="el-icon-s-tools"
                      >修改配置</el-dropdown-item
                    >
                    <el-dropdown-item
                      :command="{ opration: 'dele', index: list.id }"
                      icon="el-icon-delete-solid"
                      >删除服务</el-dropdown-item
                    >
                    <el-dropdown-item
                      :command="{
                        opration: JSON.parse(list.config).type,
                        index: list.id,
                      }"
                      icon="el-icon-folder-opened"
                      >查看文件</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>

              <div class="serverPanel">
                <div>
                  <span>服务类型：</span>
                  <strong>
                    {{ JSON.parse(list.config).type }}
                  </strong>
                </div>
                <div>
                  <span>服务名称:</span>
                  <strong>
                    {{ JSON.parse(list.config).serverName }}
                  </strong>
                </div>
                <div>
                  <span>IP:</span>
                  <strong>
                    {{
                      JSON.parse(list.config).host
                        ? JSON.parse(list.config).host
                        : ''
                    }}
                  </strong>
                </div>
              </div>

              <!-- 服务配置 -dialog-->
              <el-dialog
                :title="configServerName"
                :visible.sync="dialogVisible2"
                width="50%"
                :before-close="closeAddServerdialog"
              >
                <el-form
                  :model="sapServerConfig"
                  :rules="rulesinG"
                  ref="sapServerConfig"
                >
                  <el-form-item label="服务名称">
                    <el-input
                      v-model="sapServerConfig.serverName"
                      clearable
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="服务IP或URL" prop="host">
                    <el-input
                      v-model="sapServerConfig.host"
                      clearable
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Port" prop="port" disabled>
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
                  <el-form-item label="密码" prop="password">
                    <el-input
                      show-password
                      v-model.number="sapServerConfig.pwd"
                    ></el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible2 = false"
                    >放弃修改</el-button
                  >
                  <el-button type="primary" @click="changeServerConfig"
                    >确 定</el-button
                  >
                </span>
              </el-dialog>
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
import axios from 'axios'
const instance = axios.create({
  baseURL: 'http://121.40.30.117:5000',
})
axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)
export default {
  name: 'Server',
  data() {
    // IP验证
    var validateHost = (rule, value, callback) => {
      // IP匹配正则
      const regexp = new RegExp(
          /^(?:(?:25[0-5]|2[0-4]\d|[1-9]?\d|1\d{2})\.){3}(?:25[0-5]|2[0-4]\d|[1-9]?\d|1\d{2})$/,
          'g',
        ),
        regexp2 = new RegExp(
          /^(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Za-z0-9+&@#/%=~_|$?!:,.]*\)|[-A-Za-z0-9+&@#/%=~_|$?!:,.])*(?:\([-A-Za-z0-9+&@#/%=~_|$?!:,.]*\)|[A-Za-z0-9+&@#/%=~_|$])$/,
          'g',
        )
      console.log(value.match(regexp))
      if (!value.match(regexp) && !value.match(regexp2)) {
        callback(new Error('输入IP或url不合法'))
      } else {
        callback()
      }
    }
    // 端口验证
    var validatePort = (rule, value, callback) => {
      if (value < 0 || value > 65535) {
        console.log(value)
        callback(new Error('端口非法，请从新输入'))
      }
    }
    return {
      ruleForm: {
        name: '',
        option: '',
        IP: '',
        port: 21,
        usr: '',
        pwd: '',
      },
      rules: {
        name: [{ required: true, message: '输入服务名称', trigger: 'blur' }],
        option: [
          { required: true, message: '至少选择一项目服务', trigger: 'change' },
        ],
        IP: [
          {
            required: true,
            message: '输入IP或URL',
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
          {
            min: 0,
            max: 200,
            message: '长度在 0-200之间',
            trigger: 'change',
          },
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
          value: 'BAIDU-DISK0',
          label: '百度网盘',
        },
        {
          value: 'FTP1',
          label: 'FTP',
        },
        {
          value: 'SMB2',
          label: 'SMB',
        },
        {
          value: 'webDAV3',
          label: 'Seafile',
        },
      ],
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 },
      ],
      configServerName: '',
      serverPanelVisible: false,
      server: [], //添加服务暂存配置
      sapServerConfig: {},
      dialogVisible2: false,
      dialogVisible: false,
      current_index: null,
      loadding: true,
    }
  },
  created() {
    instance
      .post('/server/getservers', {
        user_id: this.$store.state.user_id,
      })
      .then(async (res) => {
        const { server_configs } = res.data
        this.server = server_configs
        window.clearTimeout(interval)
        var interval = setTimeout(() => {
          this.loadding = false
          this.$message({
            message: '服务加载完成',
            type: 'success',
          })
        }, 2000)
      })
      .catch((error) => {
        console.log(error)
        throw error
      })
  },
  methods: {
    closeAddServerdialog(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async addServer(formName) {
      const list = {}
      let server_tag = 0
      const tag = tstring(this.ruleForm.option) // 展开添加服务面板tag
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (tag === 0) {
            // 百度认证
            // if (!isADD) {
            ++server_tag
            ipcRenderer.send('async-authcode', 'ping') // 发送消息
            ipcRenderer.on('async-authcode-reply', async (event, arg) => {
              const { state, info } = arg
              const { access_token } = info
              if (state) {
                //授权成功
                list.serverName = this.ruleForm.name
                list.host = ''
                list.port = ''
                list.user = ''
                list.pwd = ''
                list.tag = tstring(this.ruleForm.option)
                list.type = this.ruleForm.option
                list.server_tag = server_tag
                list.range = 100 //后面需要单独获取
                list.token = access_token

                await instance
                  .post('http://121.40.30.117:5000/server/addserver', {
                    config: list,
                    id: this.$store.state.user_id,
                    type: this.ruleForm.option,
                  })
                  .then((res) => {
                    console.log(res)
                    const { status } = res.data
                    if (status) {
                      this.$message({
                        type: 'success',
                        message: '服务成功添加',
                      })
                    } else {
                      alert('服务已经添加')
                    }
                    console.log(res)
                  })
                  .catch((error) => {
                    console.log(error)
                  })
                await instance
                  .post('/server/getservers', {
                    user_id: this.$store.state.user_id,
                  })
                  .then((res) => {
                    const { server_configs } = res.data
                    this.server = server_configs
                  })
                  .catch((error) => {
                    throw error
                  })
                this.$refs[formName].resetFields()
              }
            })
            // }
          } else {
            ++server_tag
            list.serverName = this.ruleForm.name //ftp
            list.host = this.ruleForm.IP
            list.type = this.ruleForm.option
            list.port = this.ruleForm.port
            list.user = this.ruleForm.usr
            list.pwd = this.ruleForm.pwd
            list.range = 50
            list.tag = tag
            list.server_tag = server_tag //标识服务的添加状态
            list.token = ''

            await instance
              .post('/server/addserver', {
                config: list,
                id: this.$store.state.user_id,
                type: this.ruleForm.option,
              })
              .then((res) => {
                console.log(res)
                const { status } = res.data
                if (status) {
                  this.$message({
                    type: 'success',
                    message: '服务成功添加',
                  })

                  // config.push(list)
                  // window.localStorage.setItem(`config`, JSON.stringify(config))
                } else {
                  alert('服务已添加')
                }
              })
              .catch((error) => {
                console.log(error)
              })
            await instance
              .post('/server/getservers', {
                user_id: this.$store.state.user_id,
              })
              .then((res) => {
                const { server_configs } = res.data
                this.server = server_configs
              })
              .catch((error) => {
                throw error
              })
            this.$refs[formName].resetFields()
          }
          this.dialogVisible = false // 关闭dialog的时机
        } else {
          return false
        }
      })
    },
    // 设置添加服务下拉取面板展开收缩
    isOpenPanel(value) {
      if (value && tstring(this.ruleForm.option) !== 0) {
        this.serverPanelVisible = true
      } else {
        this.serverPanelVisible = false
      }
    },
    singleServerSelec(commtag) {
      const { opration, index } = commtag
      // let config = JSON.parse(localStorage.getItem('config'))

      if (opration == 'dele') {
        //[].length
        if (this.server) {
          this.$confirm('此操作将永久删除服务, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(async () => {
              await instance
                .get('/server/delserver', {
                  params: {
                    id: index,
                  },
                })
                .then((res) => {
                  if (res.data.status) {
                    this.$message({
                      type: 'success',
                      message: '删除成功!',
                    })
                  }
                })
                .catch((error) => {
                  this.$message({
                    type: 'success',
                    message: '删除失败, 网络错误',
                  })
                  throw error
                })

              await instance
                .post('/server/getservers', {
                  user_id: this.$store.state.user_id,
                })
                .then((res) => {
                  const { server_configs } = res.data
                  this.server = server_configs
                })
                .catch((error) => {
                  throw error
                })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除',
              })
            })
        }
      } else if (opration == 'changeConfig') {
        this.current_index = index
        instance
          .get('/server/singserver', {
            params: {
              id: index,
            },
          })
          .then((res) => {
            console.log(res)
            this.sapServerConfig = res.data.single_config
            this.dialogVisible2 = true
          })
      } else {
        const { opration, index } = commtag, //索引
          tag = Number(opration.slice(-1)) // 服务
        if (tag == 1) {
          this.$router.push({
            name: 'filelist',
            params: { serverType: 'ftp', index },
          })
        } else if (tag == 0) {
          this.$router.push({
            name: 'filelist',
            params: { serverType: 'baid', index },
          })
        } else if (tag == 2) {
          this.$router.push({
            name: 'filelist',
            params: { serverType: 'smb', index },
          })
        } else {
          this.$router.push({
            name: 'filelist',
            params: { serverType: 'seafile', index },
          })
          // ipcRenderer.send('async-webdav', 'open-webdav')
        }
      }
    },
    async changeServerConfig() {
      if (this.sapServerConfig.type !== 'BAIDU-DISK0') {
        await instance.post('/server/modifyserver', {
          id: this.current_index,
          config: this.sapServerConfig,
        })

        await instance
          .post('/server/getservers', {
            user_id: this.$store.state.user_id,
          })
          .then((res) => {
            const { server_configs } = res.data
            this.server = server_configs
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success',
            })
          })
          .catch((error) => {
            throw error
          })
      } else {
        alert('该服务不提供修改')
      }
      this.dialogVisible2 = false
    },
    cancelAddServer(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },
  },
}
</script>
<style lang="less" scoped>
.server-list {
  margin: 12px;
}
.listCard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px 14px;
}
.listCard > * {
  width: 100%;
}
.ServerCard {
  width: 100%;
  height: 130px;
  background: url('https://img-blog.csdnimg.cn/20200716074111712.jpg');
}
.cardSelec {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
}
.serverPanel > div {
  font-family: serif;
  font-size: 14px;
  margin-bottom: 3px;
}
.listCard::before,
.listCard::after {
  display: none;
}
</style>
