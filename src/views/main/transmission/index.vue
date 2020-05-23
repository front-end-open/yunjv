<template>
  <el-container>
    <!-- <h1>transmission</h1> -->
    <!-- 选项 -->
    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
      style="width:100%"
    >
      <el-tab-pane label="上传" name="up">
        <el-table
          v-loading="loading"
          element-loading-text="拼了老命的加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0,0,0,0.8)"
          :data="upData"
          style="width:100%"
          class="up-checkbox"
          index="/transmission/up"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="upName" label="文件名称" width="150">
          </el-table-column>
          <el-table-column prop="upSize" label="文件大小" width="150">
          </el-table-column>
          <el-table-column prop="upEvolve" label="上传进度" width="200">
            <el-progress
              :text-inside="true"
              :stroke-width="16"
              :percentage="0"
              :color="customColor"
            ></el-progress>
          </el-table-column>
          <el-table-column prop="upDate" label="上传日期" width="150">
          </el-table-column>
          <el-table-column width="300"> </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- <el-tab-pane label="下载" name="down"
       \><el-tabl
        v-loading="loading"
        element-loading-text="拼了老命的加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0,0,0,0.8)"
        :data="downData"
        height="600"
        style="width:100%"
        class="down-checkbox"
        index="/transmission/up"
      \>
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="downName" label="文件名称" width="150">
        </el-table-column>
        <el-table-column prop="downSize" label="文件大小" width="150">
        </el-table-column>
        <el-table-column prop="downEvolve" label="下载进度" width="200">
          <el-progress
            :text-inside="true"
            :stroke-width="16"
            :percentage="0"
            :color="customColor"
          \></el-progress>
        </el-table-column>
        <el-table-column prop="downDate" label="下载日期" width="150">
        </el-table-column>
        <el-table-column width="300">
          <template slot-scope="downscope">
            <el-button
              type="warning"
              icon="el-icon-video-pause"
              @click.native.stop="pauseup(upscope.$index, upEvolve)"
              size="small"
              circle
            \></el-button
            \><el-button
              type="warning"
              icon="el-icon-video-play"
              @click.native.self="palyup(upscope.$index, upEvolve)"
              size="small"
              circle
            \></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click.native.prevent="deleteup(upscope.$index, upData)"
              size="small"
              circle
            \>
            </el-button>
            <el-button
              icon="el-icon-folder"
              @click.native.capture="folderup(upscope.$index, upData)"
              size="small"
              circle
            \></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>-->
    </el-tabs>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'up',
      // percentage:#,
      customColor: '#409eff',
      upData: [
        {
          upName: '文件1',
          upSize: '120M',
          upEvolve: ' ',
          upDate: '2020-10-03',
        },
        {
          upName: '文件2',
          upSize: '12M',
          upEvolve: ' ',
          upDate: '2020-10-03',
        },
        {
          upName: '文件3',
          upSize: '13M',
          upEvolve: ' ',
          upDate: '2020-10-03',
        },
        {
          upName: '文件4',
          upSize: '14M',
          upEvolve: ' ',
          upDate: '2020-10-03',
        },
      ],
      downData: [{}],
      loading: false,
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    pauseup(index, upEvolve) {
      upEvolve.splice(index, 1)
    },
    deleteup(index, ups) {
      ups.splice(index, 1)
    },
  },
}
</script>

<style lang="less" scoped>
.up-checkbox {
  min-width: 600px;
  min-height: 400px;
}
</style>
