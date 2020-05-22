import "./ren.js"

<template>
  <div class="Ls">
    <div>
      <el-row type="flex" justify="left">
        <h3>传输设置</h3>
      </el-row>
      <ul>
        <li class="marginB30">
          <el-row type="flex" class="row-bg marginB15" justify="left">
            <h4>并行任务:</h4>
          </el-row>
          <el-row type="flex">
            <el-col :span="6" :offset="3">
              <div>
                <span class="fontSizeforth">上传并行任务数：</span>
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
            <el-col :span="6" :offset="1">
              <div>
                <span class="fontSizeforth">下载并行任务数：</span>
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
          <el-row type="flex" justify="left" class="marginB15">
            <h4>文件下载路径:</h4>
          </el-row>
          <el-row type="flex">
            <el-col :span="6" :offset="4">
              <el-input
                placeholder="请浏览文件路径"
                ref="files_name"
                size="mini"
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
    </div>

    <!-- 分割线 -->
    <el-divider></el-divider>

    <div>
      <h3>使用反馈</h3>
      <ul class="fontSizeforth">
        <li><el-link href="#" target="_blank">反馈建议</el-link></li>
      </ul>
    </div>

    <!-- 分割线 -->
    <el-divider></el-divider>

    <div>
      <h3>自动更新</h3>
      <ul class="fontSizeforth">
        <li><el-link href="#" target="_blank">版本更新</el-link></li>
      </ul>
    </div>

    <!-- 分割线 -->
    <el-divider></el-divider>

    <div>
      <h3>关于</h3>
      <ul class="fontSizeforth">
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
    </div>
  </div>
</template>

<script>
// 获取文件路径
const { dialog } = require('electron').remote
export default {
  data() {
    return {
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
      dialog.showOpenDialog(
        {
          properties: ['openFile', 'openDirectory'],
          title: '红烧牛肉面',
          buttonLabel: '买单',
        },
        (result) => {
          this.$refs.files_name.value = result
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
.fontSizeforth {
  font-size: 14px;
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
</style>
