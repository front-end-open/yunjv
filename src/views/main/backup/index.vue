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
        <el-card class="box-card" shadow="never">
          <div class="body">
            <el-row>
              <el-col :span="22"
                ><div class="add">
                  <el-input
                    v-model="input"
                    placeholder="select your computer local Dir to setting"
                  ></el-input></div
              ></el-col>
              <el-col :span="2"
                ><div class="grid-content bg-purple-light">
                  <el-button
                    @click="addPath"
                    type="warning"
                    icon="el-icon-plus"
                    size="mini"
                    circle
                  ></el-button></div
              ></el-col>
            </el-row>
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
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    addPath() {
      ipcRenderer.send('async-openBackDialog', 'open')
      ipcRenderer.on('async-get')
    },
  },
}
</script>
<style lang="less" scoped>
.back-content {
  margin: -20px;
  background: #222c32;
  height: 100vh;
}
.backup {
  font-size: 5em;
}
.el-card {
  border: none;
  background: #222c32;
}
.body {
  min-height: 500px;
}
.add,
.grid-content {
  min-height: 40px;
  line-height: 40px;
  padding-left: 12px;
}
</style>
