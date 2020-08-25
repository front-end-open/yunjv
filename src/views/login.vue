<template>
  <div>
    <header>
      <div>
        <img
          src="https://img-blog.csdnimg.cn/20200717124303439.png"
          alt="yunjv"
        />
        <h1>云居</h1>
      </div>
    </header>
    <div class="titleParent">
      <span class="title">登录</span>
    </div>
    <div>
      <div id="register">
        <el-form
          :model="ruleForm2"
          status-icon
          :rules="rules2"
          ref="ruleForm2"
          label-width="0"
          class="demo-ruleForm"
        >
          <el-form-item prop="tel">
            <el-input
              v-model="ruleForm2.name"
              auto-complete="off"
              placeholder="请输入账号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="pass">
            <el-input
              type="password"
              v-model="ruleForm2.pass"
              auto-complete="off"
              placeholder="输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm2')"
              style="width:100%;"
              >登录</el-button
            >
            <router-link to="/sign">现在注册？</router-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import Axios from 'axios'
const instance = Axios.create({
  baseURL: 'http://121.40.30.117:5000',
})
instance.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log(response)
    return response
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log(error.toJSON())
    return Promise.reject(error)
  },
)
export default {
  name: 'Register',
  data() {
    // <!--验证账号是否合法-->
    let checkTel = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    // <!--验证密码-->
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass')
        }
        callback()
      }
    }
    return {
      ruleForm2: {
        pass: '',
        name: '',
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: 'change' }],
        name: [{ validator: checkTel, trigger: 'change' }],
      },
      flag: true,
    }
  },
  methods: {
    // <!--提交登录-->
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          instance
            .post('/api/user/login', {
              account: this.ruleForm2.name,
              pwd: this.ruleForm2.pass,
            })
            .then((res) => {
              console.log(res)
              const { status, msg, user_id } = res.data
              if (status) {
                this.$message({
                  showClose: true,
                  message: msg,
                  type: 'success',
                })
                this.$store.commit('loginstate', {
                  islogin: true,
                  user_id,
                })
              } else {
                this.$message({
                  showClose: true,
                  message: msg,
                  type: 'warning',
                })
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 验证账号
    checkMobile(str) {
      let re = /^[a-zA-z]\w{3,15}$/
      if (re.test(str)) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>

<style scoped>
.loading-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #aedff8;
  display: flex;
  align-items: center;
  justify-content: center;
}
.register-wrapper img {
  position: absolute;
  z-index: 1;
}
.register-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
#register {
  max-width: 340px;
  margin: 60px auto;
  margin-top: 0;
  background: #fff;
  padding: 20px 40px;
  border-radius: 10px;
  position: relative;
  z-index: 9;
}
.title {
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  height: 56px;
  line-height: 56px;
  margin: 0 auto;
  padding: 0 20px;
  background: #fff;
}
.el-form-item {
  text-align: center;
}
.login {
  margin: 10px 0;
  margin-right: 3px;
  font-size: 14px;
  line-height: 22px;
  color: rgb(102, 177, 255);
  cursor: pointer;
  text-align: right;
  text-indent: 8px;
  width: 100%;
}
.code >>> .el-form-item__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.code button {
  margin-left: 20px;
  width: 140px;
  text-align: center;
}
.el-button--primary:focus {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}
.titleParent {
  width: 980px;
  height: 28px;
  margin: 0 auto;
  margin-top: 60px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 28px;
  text-align: center;
}
header {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(236, 245, 255);
  padding: 20px;
}
header > div {
  display: flex;
  justify-content: center;
  align-items: center;
}
img {
  vertical-align: middle;
  width: 60px;
  height: 60px;
  font-size: 40px;
  margin-right: 10px;
  border-radius: 50%;
}
</style>
