<template>
  <div class="Ls flexCol">
    <el-card shadow="hover">
      <h3 class="marginB30 fontSizeS">传输设置</h3>
      <ul>
        <li class="marginB30">
          <el-row type="flex" class="row-bg marginB15 fontSizeF" justify="left">
            <h4>并行任务:</h4>
          </el-row>
          <el-row type="flex">
            <el-col :span="10" :offset="2" class="inine_h_dad">
              <div class="nowarp">
                <span class="fontSizeF inline_h">上传并行任务数：</span>
                <el-select
                  v-model="upload"
                  size="small"
                  class="udLoad"
                  @change="groupChange(1)"
                >
                  <el-option
                    v-for="item in optionsUp"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <div class="submit_group" v-show="group1">
                  <el-button
                    class="submit"
                    @click="submit('', upload, '', 1)"
                    type="primary"
                    size="small"
                    >提交</el-button
                  >
                  <el-button
                    class="submit"
                    @click="cancel(1)"
                    type="primary"
                    size="small"
                    >取消</el-button
                  >
                </div>
              </div>
            </el-col>
            <el-col :span="10" :offset="2">
              <div class="nowarp">
                <span class="fontSizeF inline_h">下载并行任务数：</span>
                <el-select
                  v-model="download"
                  size="small"
                  class="udLoad"
                  @change="groupChange(2)"
                >
                  <el-option
                    v-for="item in optionsDown"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <div class="submit_group" v-show="group2">
                  <el-button
                    class="submit"
                    @click="submit(download, '', '', 2)"
                    type="primary"
                    size="small"
                    >提交</el-button
                  >
                  <el-button
                    class="submit"
                    @click="cancel(2)"
                    type="primary"
                    size="small"
                    >取消</el-button
                  >
                </div>
              </div>
            </el-col>
          </el-row>
        </li>
        <li>
          <el-row type="flex" justify="left" class="marginB15 fontSizeF">
            <h4>文件下载路径:</h4>
          </el-row>
          <el-row type="flex" :gutter="10">
            <el-col :span="10" :offset="2">
              <el-input
                placeholder="请浏览文件路径"
                size="small"
                :disabled="true"
                v-model="filePath"
              >
              </el-input>
            </el-col>
            <el-col :span="3">
              <el-button
                type="info"
                plain
                size="small"
                @click="files(3)"
                class="liulan"
                >浏览</el-button
              >
            </el-col>
            <el-col :span="4">
              <div class="submit_group" v-show="group3">
                <el-button
                  class="submit"
                  type="primary"
                  @click="submit('', '', filePath, 3)"
                  size="small"
                  >提交</el-button
                >
                <el-button
                  @click="cancel(3)"
                  class="submit"
                  type="primary"
                  size="small"
                  >取消</el-button
                >
              </div>
            </el-col>
          </el-row>
        </li>
      </ul>
    </el-card>

    <el-card shadow="hover">
      <h3 class="marginB30 fontSizeS">使用反馈</h3>
      <ul>
        <li>
          <el-link href="https://github.com/issues" target="_blank"
            >反馈建议</el-link
          >
        </li>
      </ul>
    </el-card>

    <el-card shadow="hover bottomColR">
      <h3 class="marginB30 fontSizeS">自动更新</h3>
      <ul>
        <li>
          <el-link
            href="https://github.com/PachVerb/yunjv/releases"
            target="_blank"
            >版本更新</el-link
          >
        </li>
      </ul>
    </el-card>

    <!-- 分割线 -->
    <!-- <el-divider></el-divider> -->

    <el-card shadow="hover">
      <h3 class="fontSizeS">关于</h3>
      <ul class="fontSizeF flexBox">
        <li>{{ aboutName }}</li>
        <li>当前版本：{{ aboutEdition }}</li>
        <li>
          <span>XX公司</span>
          <el-divider direction="vertical"></el-divider>
          <span>版权所有</span>
          <el-divider direction="vertical"></el-divider>
          <span><el-link href="#" target="_blank">用户协议</el-link></span>
        </li>
        <li>{{ aboutOwnership }}</li>
      </ul>
      <div class="bottomCol"></div>
    </el-card>
    <p>{{ test }}</p>
  </div>
</template>

<script>
// 获取文件路径
import axios from 'axios'

export default {
  name: 'setting',
  data() {
    return {
      filePath: '', //下载文件地址
      upload: '', //上传并行任务数
      optionsUp: [
        {
          //上传选项
          value: '1',
          label: '1',
        },
        {
          value: '1',
          label: '2',
        },
        {
          value: '3',
          label: '3',
        },
        {
          value: '4',
          label: '4',
        },
      ],

      download: '', //下载并行任务数
      optionsDown: [
        {
          //下载选项
          value: '1',
          label: '1',
        },
        {
          value: '2',
          label: '2',
        },
        {
          value: '3',
          label: '3',
        },
        {
          value: '4',
          label: '4',
        },
      ],

      aboutName: '云居', //程序名称
      aboutEdition: '1.1.1', //当前版本号
      aboutOwnership: 'Copyright © 2020 Yanqi All Rights Reserved', //所有权
      group1: false,
      group2: false,
      group3: false,
      test: 'helllosdfasfasd',
    }
  },
  created() {
    axios
      .post('http://121.40.30.117:5000/server/addsetting', {
        user_id: this.$store.state.user_id,
        downtask: this.download,
        uptask: this.upload,
        downpath: this.filePath,
      })
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.log(error)
      })
  },
  methods: {
    //点击浏览按钮 将input的value值替换为文件夹路径
    files(num) {
      const { dialog } = require('electron').remote
      dialog.showOpenDialog(
        {
          properties: ['openDirectory'],
          title: '默认下载地址',
          buttonLabel: '确定',
        },
        (result) => {
          if (result) {
            this.filePath = String(result)
            let tag = 'group' + num
            this[`${tag}`] = true
          }
        },
      )
    },
    groupChange(num) {
      this[`group${num}`] = true
    },
    submit(down, up, dowpath, num) {
      axios
        .post('http://121.40.30.117:5000/server/modifyset', {
          user_id: this.$store.state.user_id,
          downtask: down,
          uptask: up,
          downpath: dowpath,
        })
        .then(() => {
          this.$message({
            message: '更新成功',
            type: 'success',
          })
          this[`group${num}`] = false
        })
    },
    cancel(num) {
      this[`group${num}`] = false
    },
  },
  mounted() {
    axios
      .get('http://121.40.30.117:5000/server/postset', {
        params: {
          user_id: this.$store.state.user_id,
        },
      })
      .then((res) => {
        let { down_path, uptask_num, downtask_num } = res.data.seting
        this.filePath = down_path
        this.upload = uptask_num
        this.download = downtask_num
      })
      .catch((error) => {
        console.log(error)
      })
  },
  computed: {},
  watch: {},
}
</script>
<style scoped>
ul,
ol,
li {
  list-style: none;
}
/* 上传下载框 */
.el-select {
  width: 53px;
}
/* 14号字 */
.fontSizeF {
  font-size: 14px;
  line-height: 14px;
}
/* 16号字 */
.fontSizeS {
  font-size: 16px;
}
.inline_h {
  line-height: 36px;
}
.inine_h_dad {
  line-height: 100%;
}
.Ls {
  /*全局字符间距 */
  letter-spacing: 1px;
}
.marginB15 {
  margin-bottom: 15px;
}
.marginB30 {
  margin-bottom: 30px;
}
.nowarp {
  /* 并行任务数不换行 */
  display: flex;
  flex-wrap: warp;
}
.flexCol {
  /* flex */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 50px 38px;
}
.el-card {
  margin-bottom: 20px;
  border-radius: 5px;
  background: rgb(249, 249, 249);
  font-family: serif;
}
.flexBox {
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.udLoad {
  width: 77px;
}
.liulan {
  width: 60%;
  display: flex;
  justify-content: center;
}
.submit {
  margin-left: 12px;
}
</style>
