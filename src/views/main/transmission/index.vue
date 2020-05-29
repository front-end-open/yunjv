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
          <el-table-column prop="upName" label="文件名称"> </el-table-column>
          <el-table-column prop="upSize" label="文件大小"> </el-table-column>
          <el-table-column prop="upEvolve" label="上传进度">
            <el-progress
              :text-inside="true"
              :stroke-width="16"
              :percentage="0"
              :color="customColor"
              :visible.sync="transmissionSchedule"
            ></el-progress>
          </el-table-column>

          <el-table-column prop="upDate" label="上传日期"> </el-table-column>
          <!-- 传输控制 -->
          <el-table-column width="180" :visible.sync="transmissionControl">
            <template slot-scope="upscope">
              <el-button
                type="warning"
                icon="el-icon-video-pause"
                @click.native.stop="pauseup(upscope.$index, upEvolve)"
                size="small"
                circle
              ></el-button
              ><el-button
                type="warning"
                icon="el-icon-video-play"
                @click.native.self="palyup(upscope.$index, upEvolve)"
                size="small"
                circle
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click.native.prevent="deleteup(upscope.$index, upData)"
                size="small"
                circle
              >
              </el-button>
              <el-button
                icon="el-icon-folder"
                @click.native.capture="folderup(upscope.$index, upData)"
                size="small"
                circle
              ></el-button>
            </template>
          </el-table-column>
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
      <el-upload
        class="upload-demo"
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpload"
          >上传到服务器</el-button
        >
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-tabs>
  </el-container>
</template>

<script>
import Server from '@/lib/ServerFactory.js'
export default {
  data() {
    return {
      activeName: 'up',

      fileList: [
        {
          name: 'food.jpeg',
          url:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
        {
          name: 'food2.jpeg',
          url:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        },
      ],

      // percentage:#,
      customColor: '#409eff',
      transmissionControl: false,
      transmissionSchedule: false,
      upData: [
        {
          upName: '1',
          upSize: '2',
          upEvolve: ' ',
          upDate: '2010-02-01',
        },
      ],
      downData: [
        {
          downName: '1',
          downSize: '2',
          dwonEvolve: ' ',
          downDate: '2010-02-01',
        },
      ],
      loading: false,
    }
  },
  created() {
    this.upload()
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
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    upload() {
      let { chunkSize, pieces, size, lpath, fileC } = this.$store.state.fileinfo
      let server = new Server('BaiDu', '', '', '', '', '')
      for (let i = 0; i < pieces; i++) {
        server.uploadpieces(chunkSize, size, i, lpath, fileC)
      }
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
