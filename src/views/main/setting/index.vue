import "./ren.js"

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
            <el-col :span="7" :offset="3" class="inine_h_dad">
              <div class="nowarp">
                <span class="fontSizeF inline_h">上传并行任务数：</span>
                <el-select v-model="upload" size="mini" class="udLoad">
                  <el-option
                    v-for="item in optionsUp"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="7" :offset="2">
              <div class="nowarp">
                <span class="fontSizeF inline_h">下载并行任务数：</span>
                <el-select v-model="download" size="mini" class="udLoad">
                  <el-option
                    v-for="item in optionsDown"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </li>
        <li>
          <el-row type="flex" justify="left" class="marginB15 fontSizeF">
            <h4>文件下载路径:</h4>
          </el-row>
          <el-row type="flex">
            <el-col :span="6" :offset="3">
              <el-input
                placeholder="请浏览文件路径"
                size="mini"
                v-model="filePath"
              >
              </el-input>
            </el-col>
            <el-col :span="3" style="margin-left:5px">
              <el-row>
                <el-button type="info" plain size="mini" @click="files"
                  >浏览</el-button
                >
              </el-row>
            </el-col>
          </el-row>
        </li>
      </ul>
    </el-card>

    <!-- 分割线 -->
    <!-- <el-divider></el-divider> -->

    <el-card shadow="hover">
      <h3 class="marginB30 fontSizeS">使用反馈</h3>
      <ul>
        <li>
          <el-link href="#" target="_blank">反馈建议</el-link>
        </li>
      </ul>
    </el-card>

    <!-- 分割线 -->
    <!-- <el-divider></el-divider> -->

    <el-card shadow="hover">
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
      <h3 class="marginB30 fontSizeS">关于</h3>
      <ul class="fontSizeF">
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
          title: '红烧牛肉面',
          buttonLabel: '买单',
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
<style>
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
  line-height: 27px;
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
  /* 全局flex */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.el-card.is-hover-shadow {
  margin-bottom: 15px;
}
</style>
