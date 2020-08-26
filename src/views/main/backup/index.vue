<template>
  <div class="back-content">
    <el-container>
      <el-header>
        <el-collapse accordion>
          <el-collapse-item>
            <template slot="title">
              <h2>Backup</h2>
              <el-tooltip
                class="item"
                effect="dark"
                content="backup"
                placement="right"
              >
                <i class="header-icon el-icon-info"></i>
              </el-tooltip>
            </template>
            <div>
              备份频繁使用、不定期更新的照片、占用本地空间的文件、番剧等
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-header>
      <el-main>
        <el-card class="box-card1" shadow="never">
          <div slot="header" class="body">
            <el-row>
              <el-col :span="20"
                ><div class="add">
                  <el-input
                    v-model="input"
                    placeholder="select your computer local Dir to setting"
                  ></el-input></div
              ></el-col>
              <el-col :span="4"
                ><div class="grid-content bg-purple-light">
                  <el-button
                    @click="addPath"
                    plain
                    icon="el-icon-plus"
                  ></el-button>
                  <el-button @click="isAddPath" plain>应用</el-button>
                </div></el-col
              >
            </el-row>
          </div>
          <div
            v-for="(item, index) in this.backDirList"
            :key="index"
            class="text item"
          >
            <span class="rig">{{ item }}</span>
            <el-button
              type="danger"
              @click="delec(index)"
              icon="el-icon-delete"
              circle
            ></el-button>
          </div>
        </el-card>

        <el-dialog
          title="配置"
          :visible.sync="centerDialogVisible"
          width="30%"
          center
        >
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="auto"
            class="demo-ruleForm"
          >
            <el-form-item label="服务" prop="server">
              <el-select v-model="ruleForm.server" placeholder="选择备份到服务">
                <el-option
                  v-for="(item, index) in config"
                  :label="item"
                  :value="item"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')"
                >立即创建</el-button
              >
              <el-button @click="resetForm('ruleForm')">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>
<script>
const ipcRenderer = require('electron').ipcRenderer
import axios from 'axios'
export default {
  name: 'BackUp',
  data() {
    return {
      input: '',
      ruleForm: {
        server: [],
      },
      rules: {
        server: [{ required: true, message: '请选择服务', trigger: 'blur' }],
        path: [{ required: true, message: '请选择备份目录', trigger: 'blur' }],
      },
      config: ['FTP'],
      centerDialogVisible: false,
      backupDir: [],
      backDirList: [],
      ftp: null,
    }
  },
  created() {
    ipcRenderer.on('async-get', (event, msg) => {
      this.input = msg[0]
      this.backDirList.push(msg[0])
    })
    axios
      .post('http://121.40.30.117:5000/server/getservers', {
        user_id: this.$store.state.user_id,
      })
      .then((res) => {
        const { server_configs } = res.data
        server_configs.forEach((val) => {
          if (JSON.parse(val.config).type == 'FTP1') {
            this.ftp = JSON.parse(val.config)
            console.log(this)
          }
        })
      })
  },
  methods: {
    // 备份目录
    addPath() {
      ipcRenderer.send('async-openBackDialog', { status: 'getPath' })
    },
    delec(index) {
      this.backDirList.splice(index, 1)
    },
    // 开始备份
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          ipcRenderer.send('async-openBackDialog', {
            status: 'backup',
            path: this.input,
            config: this.ftp,
          })

          this.backupDir.push(this.input)
          ipcRenderer.on('send', (event, msg) => {
            this.$message({
              message: msg,
              type: 'success',
            })
            this.centerDialogVisible = false
          })
        } else {
          return false
        }
      })
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.centerDialogVisible = false
    },
    isAddPath() {
      if (this.input) {
        this.centerDialogVisible = true
      } else {
        alert('请选择备份目录')
      }
    },
    //清除数据
    deletion() {
      this.tableData = []
    },
  },
}
</script>
<style lang="less" scoped>
.back-content {
  position: relative;
  margin: -20px;
  background: #222c32;
  height: 100vh;
}
.backup {
  font-size: 5em;
}
.el-card {
  border: none;
  min-height: 50em;
}
.add,
.grid-content {
  min-width: 164px;
  min-height: 40px;
  line-height: 40px;
  padding-left: 12px;
}
.rig {
  margin-right: 100px;
}
</style>
