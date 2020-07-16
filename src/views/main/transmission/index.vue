<template>
  <el-container>
    <el-table :data="this.$store.state.downloadLists">
      <el-table-column
        align="center"
        header-align="center"
        label="文件名"
        width="180"
        prop="server_filename"
      >
      </el-table-column>
      <el-table-column
        label="大小"
        width="180"
        align="center"
        header-align="center"
        prop="size"
      >
      </el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        label="进度"
        width="180"
      >
        <span>{{ this.$store.state.precentage + '%' }}</span>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            <i class="el-icon-video-play"></i
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            ><i class="el-icon-delete"></i
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-container>
</template>

<script>
export default {
  name: 'transission',
  data() {
    return {
      tableData: [
        {
          server_filename: '2016-05-02',
          size: '王小虎',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
      ],
      precentage: Number(this.$store.state.precentage),
    }
  },
  created() {
    console.log(this.$store.state.precentage)
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
  },
  watch: {
    precentage(newVal, oldVal) {
      console.log(newVal, oldVal)
    },
  },
}
</script>

<style lang="less" scoped>
.el-table {
  width: 100%;
  margin-top: -15px;
}
</style>
