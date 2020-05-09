<template>
  <div>
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
        class="demo-ruleForm"
      >
        <el-form-item label="服务名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="服务类型" prop="region">
          <el-select v-model="value" placeholder="选择服务类型">
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
            <el-input v-model="ruleForm.IP"></el-input>
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input v-model="ruleForm.port"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="usr">
            <el-input placeholder="可选" v-model="ruleForm.usr"> </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <el-input
              type="password"
              v-model="ruleForm.pwd"
              autocomplete="off"
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
    <el-row :gutter="12">
      <el-col :span="8" v-for="(list, index) in server" :key="index">
        <el-card shadow="hover">
          <h4>{{ list.serverName }}</h4>
          <el-progress
            :percentage="list.range"
            :color="customColors"
          ></el-progress>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
const { tstring } = require('@/lib/TailoringString')
const ipcRenderer = require('electron').ipcRenderer
// let child = null
export default {
  name: 'Library',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    return {
      tag: false,
      dialogVisible: false,
      ruleForm: {
        name: '',
        value: '',
        IP: '',
        port: '',
        usr: '',
        pwd: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        value: [{ required: true, message: '选择一项服务', trigger: 'change' }],
        IP: [
          {
            require: true,
            message: 'IP不能为空',
            trigger: 'blur',
          },
        ],
        port: [
          {
            required: true,
            message: '端口必须',
            trigger: 'blur  ',
          },
        ],
        pwd: [{ validator: validatePass, trigger: 'blur' }],
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
        {
          value: 'seafile1',
          label: 'SeaFile',
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
      value: '',
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
      const list = {}
      this.$refs[formName].validate((valid) => {
        if (valid) {
          ipcRenderer.send('asynchronous-message', 'ping')
          ipcRenderer.on('asynchronous-reply', (event, arg) => {
            const { state } = arg
            if (state) {
              list.serverName = this.value
              list.range = 100
              this.server.push(list)
            }
          })
          this.dialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
  watch: {
    value: function(newVal) {
      console.log(newVal)
      if (newVal && tstring(newVal) === 1) {
        this.tag = true
      } else {
        this.tag = false
      }
    },
  },
  mounted() {
    // console.log(tstring('adb1234'))
  },
}
</script>
<style lang="less" scoped>
.el-row {
  margin: -20px -20px 0px -20px;
}
.toolbar {
  padding: 12px;
}
</style>
