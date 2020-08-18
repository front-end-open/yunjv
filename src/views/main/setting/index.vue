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
                <el-select v-model="upload" size="small" class="udLoad">
                  <el-option
                    v-for="item in optionsUp"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <div class="submit_group">
                  <el-button class="submit" type="primary" size="small"
                    >提交</el-button
                  >
                  <el-button class="submit" type="primary" size="small"
                    >取消</el-button
                  >
                </div>
              </div>
            </el-col>
            <el-col :span="10" :offset="2">
              <div class="nowarp">
                <span class="fontSizeF inline_h">下载并行任务数：</span>
                <el-select v-model="download" size="small" class="udLoad">
                  <el-option
                    v-for="item in optionsDown"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <div class="submit_group">
                  <el-button class="submit" type="primary" size="small"
                    >提交</el-button
                  >
                  <el-button class="submit" type="primary" size="small"
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
          <el-row type="flex" gutter="10">
            <el-col :span="6" :offset="2">
              <el-input
                placeholder="请浏览文件路径"
                size="small"
                v-model="filePath"
              >
              </el-input>
            </el-col>
            <el-col :span="2">
              <el-button
                type="info"
                plain
                size="small"
                @click="files"
                class="liulan"
                >浏览</el-button
              >
            </el-col>
            <el-col :span="4">
              <div class="submit_group">
                <el-button class="submit" type="primary" size="small"
                  >提交</el-button
                >
                <el-button class="submit" type="primary" size="small"
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
  </div>
</template>

<script>
// 获取文件路径

export default {
  data() {
    return {
      filePath: '', //下载文件地址
      upload: '1', //上传并行任务数
      optionsUp: [
        {
          //上传选项
          value: '选项1',
          label: '1',
        },
        {
          value: '选项2',
          label: '2',
        },
        {
          value: '选项3',
          label: '3',
        },
        {
          value: '选项4',
          label: '4',
        },
      ],

      download: '2', //下载并行任务数
      optionsDown: [
        {
          //下载选项
          value: '选项1',
          label: '1',
        },
        {
          value: '选项2',
          label: '2',
        },
        {
          value: '选项3',
          label: '3',
        },
        {
          value: '选项4',
          label: '4',
        },
      ],

      aboutName: '云居', //程序名称
      aboutEdition: '1.1.1', //当前版本号
      aboutOwnership: 'Copyright © 2020 Yanqi All Rights Reserved', //所有权
    }
  },
  methods: {
    //点击浏览按钮 将input的value值替换为文件夹路径
    files() {
      const { dialog } = require('electron').remote
      dialog.showOpenDialog(
        {
          properties: ['openFile', 'openDirectory'],
          title: '默认下载地址',
          buttonLabel: '确定',
        },
        (result) => {
          this.filePath = String(result)
        },
      )
    },
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
