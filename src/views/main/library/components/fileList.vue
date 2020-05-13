<template>
  <el-container>
    <el-header>
      <el-row type="flex" class="row-bg">
        <el-col :span="15">
          <div class="control">
            <el-button type="primary" @click="createDiretory"
              >新建文件夹</el-button
            >
            <el-button type="info">文件操作</el-button>
            <el-button type="danger" icon="el-icon-delete" :disabled="true"
              >删除</el-button
            >
            <el-button type="primary"
              >上传<i class="el-icon-upload el-icon--right"></i
            ></el-button>
            <el-button type="primary"
              >下载<i class="el-icon-download el-icon--right"></i
            ></el-button>
          </div>
        </el-col>
        <el-col :span="4" :offset="5">
          <div class="switch">
            <i class="el-icon-menu cos"></i>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        lazy
        :load="load"
        :default-expand-all="false"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="selection" width="50"> </el-table-column>
        <el-table-column label="文件名" sortable width="180">
          <template slot-scope="scope">
            <i
              :class="
                scope.row.isdir == 1 ? 'el-icon-folder' : 'el-icon-document'
              "
            ></i>
            <span style="margin-left: 10px">{{
              scope.row.server_filename
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="local_ctime"
          label="创建时间"
          sortable
          width="180"
        >
        </el-table-column>
        <el-table-column prop="local_mtime" label="修改日期"></el-table-column>
        <el-table-column prop="size" label="大小"> </el-table-column>
        <el-table-column label="修改">
          <el-button type="danger">删除</el-button>
        </el-table-column>
      </el-table>

      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="50%"
        center
      >
        <div class="form">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="目录名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')"
                >立即创建</el-button
              >
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import Dateformate from '@/lib/DateFormate.js'
import SizeConvert from '@/lib/SizeConvert.js'
export default {
  data() {
    return {
      tableData: [],
      centerDialogVisible: false,
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        region: '',
        type: '',
      },
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' },
        ],
        date1: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change',
          },
        ],
        date2: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change',
          },
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change',
          },
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' },
        ],
        desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }],
      },
    }
  },
  created() {
    const config = JSON.parse(localStorage.getItem('config'))[0]
    const { token } = config
    let id = 1
    this.$http
      .get(`/rest/2.0/xpan/file?method=list&access_token=${token}`)
      .then((res) => {
        const { list } = res.data
        let fileDate = {}
        for (let val of list) {
          // 由于返回数据没有标识，因此需要加上筛选拼接数据
          fileDate = {}
          if (val.isdir === 1) {
            fileDate.hasChildren = true
            fileDate.children = []
          }
          fileDate.id = id
          fileDate.server_filename = val.server_filename
          fileDate.local_mtime = Dateformate(val.local_mtime)
          fileDate.local_ctime = Dateformate(val.local_ctime)
          fileDate.size = SizeConvert(val.size)
          fileDate.isdir = val.isdir
          fileDate.path = val.path
          this.tableData.push(fileDate)
          ++id
        }
        console.log(list)
      })
      .catch((error) => {
        console.log(error.toJSON())
      })
  },
  methods: {
    load(tree, treeNode, resolve) {
      let childFileList = {}
      let children = []
      const config = JSON.parse(localStorage.getItem('config'))[0]
      const { token } = config
      this.$http
        .get(
          `/rest/2.0/xpan/multimedia?method=listall&path=${tree.path}&access_token=${token}&recursion=1`,
        )
        .then((res) => {
          const { list } = res.data
          for (let val of list) {
            childFileList = {}
            children.isdir = val.isdir
            childFileList.id = Math.random() * 100
            childFileList.server_filename = val.server_filename
            childFileList.local_ctime = Dateformate(val.local_ctime)
            childFileList.local_mtime = Dateformate(val.local_mtime)
            childFileList.size = SizeConvert(val.size)
            children.push(childFileList)
          }
          console.log(res)
          resolve(children)
        })
        .catch((error) => {
          console.log(error)
        })
      console.log(tree.path, treeNode, resolve, token)
    },
    createDiretory() {
      this.centerDialogVisible = true
    },
    submitCreate() {
      const config = JSON.parse(localStorage.getItem('config'))[0]
      const { token } = config
      this.$http(
        `/rest/2.0/xpan/file?method=create&access_token=${token}&isdir=1`,
      ).then((res) => {
        console.log(res.data)
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>
<style lang="less" scoped>
.el-container {
  margin: -20px;
}
.el-header {
  background-color: #fff;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}
.cos {
  color: rgba(78, 70, 70, 0.932);
  font-size: 20px;
}
.control {
  min-width: 600px;
}
.switch {
  min-height: 100px;
  margin-left: 50px;
}
.form {
  max-width: 400px;
  margin: auto;
}
</style>
