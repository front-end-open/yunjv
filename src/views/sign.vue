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
      <span class="title">注册</span>
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
          <el-form-item prop="name">
            <el-input
              v-model="ruleForm2.name"
              auto-complete="off"
              placeholder="昵称"
            ></el-input>
          </el-form-item>

          <el-form-item prop="tel">
            <el-input
              v-model="ruleForm2.user"
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
          <el-form-item prop="checkPass">
            <el-input
              type="password"
              v-model="ruleForm2.checkPass"
              auto-complete="off"
              placeholder="确认密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm2')"
              style="width:100%;"
              >注册</el-button
            >
            <router-link to="/login">已有账号？立即登录</router-link>
            <!-- <p class="login" @click="gotoLogin">已有账号？立即登录</p> -->
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import Axios from 'axios'
export default {
  name: 'Register',
  data() {
    //验证昵称是否合法
    let zhanghao = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入昵称'))
      } else if (!this.checkMobile2(value)) {
        callback(new Error('昵称不合法'))
      } else {
        callback()
      }
    }
    // <!--验证账号是否合法-->
    let checkTel = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'))
      } else if (!this.checkMobile(value)) {
        callback(new Error('账号不合法'))
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
    // <!--二次验证密码-->
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm2: {
        pwd: '',
        checkPass: '',
        user: '',
        name: '',
      },
      rules2: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        user: [{ validator: checkTel, trigger: 'blur' }],
        name: [{ validator: zhanghao, trigger: 'blur' }],
      },
      flag: true,
    }
  },
  methods: {
    // <!--提交注册-->
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Axios.post('http://121.40.30.117:5000/api/user/sign', {
            nick: this.ruleForm2.name,
            account: this.ruleForm2.user,
            pwd: this.ruleForm2.pass,
          })
            .then((res) => {
              const { status, msg } = res.data
              if (status === 5) {
                this.$message({
                  message: msg,
                  type: 'info',
                })
              } else {
                this.$message({
                  message: msg,
                  type: 'success',
                })

                this.$router.push({ path: '/login' })
              }
            })
            .catch((error) => {
              this.$message({
                showClose: true,
                message: '注册失败',
                type: 'error',
              })
              console.log(error)
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
    // 验证昵称
    checkMobile2(str) {
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
