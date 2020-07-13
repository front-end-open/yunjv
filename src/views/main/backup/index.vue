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
              设置本分目录，自动同步更新上传。。。。。。。
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
                    type="warning"
                    icon="el-icon-plus"
                  ></el-button>
                  <el-button type="primary" plain>应用</el-button>
                </div></el-col
              >
            </el-row>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{ '列表内容 ' + o }}
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script>
const ipcRenderer = require('electron').ipcRenderer
export default {
  name: 'BackUp',
  data() {
    return {
      input: '',
    }
  },
  methods: {
    addPath() {
      ipcRenderer.send('async-openBackDialog', 'open')
      ipcRenderer.on('async-get', (event, msg) => {
        this.input = msg[0]
      })
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
}
// .body {
//   min-height: 500px;
// }
.add,
.grid-content {
  min-height: 40px;
  line-height: 40px;
  padding-left: 12px;
}
// .bottom-tool {
//   position: fixed;
//   bottom: 0;
//   background: #fff;
// }
</style>
