<template>
  <el-container>
    <el-header>
      <el-row type="flex" class="row-bg">
        <el-col :span="15">
          <div class="control">
            <el-button type="primary" @click="createDiretory"
              >新建文件夹</el-button
            >
            <el-dropdown trigger="click" style="margin: 0 12px">
              <el-button type="primary">
                文件操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>移动到</el-dropdown-item>
                <el-dropdown-item>复制到</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button type="primary"
              >上传<i class="el-icon-upload el-icon--right"></i
            ></el-button>
            <el-button type="primary" ref="down" disabled @click="downLoadFile"
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
      <el-row type="flex" :gutter="12">
        <el-col :span="24">
          <div class="bread" style="margin: 12px">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item
                v-for="(item, index) in pathbread"
                :key="index"
                :to="{ path: item.path }"
                >{{ item.name }}</el-breadcrumb-item
              >
            </el-breadcrumb>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        lazy
        :load="load"
        @select="download"
        @cell-dblclick="loadFile"
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
        <el-table-column label="文件操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
              >重命名</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        title="新建"
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
            <el-form-item label="路径" prop="path">
              <el-select v-model="path" placeholder="请选择">
                <el-option
                  v-for="item in tableData"
                  :key="item.fs_id"
                  :label="'/' + item.server_filename"
                  :value="item.path"
                >
                </el-option>
              </el-select>
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
// import Vue from 'vue'
import Dateformate from '@/lib/DateFormate.js'
import SizeConvert from '@/lib/SizeConvert.js'
const SambaClient = require('samba-client')
const ftp = require('basic-ftp')
const client = new ftp.Client()
// const path = require('path')
export default {
  name: 'fileList',
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
        name: '新建文件夹',
        path: '/',
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        path: [{ required: true, message: '请指定文件路径', trigger: 'blur' }],
      },
      rowfileID: '',
      path: '/',
      query: this.$route.params.id,
      singleFile: {},
      pathbread: [],
      parents: [],
      cliDirTag: 0,
    }
  },
  created() {
    //属性路由
    this.pathbread = [
      {
        name: `${this.$route.params.id}:`,
        path: `/main/Library/filelist/${this.$route.params.id}`,
      },
    ]
    const { index } = this.$route.params
    if (index) {
      var config = JSON.parse(localStorage.getItem('config'))[index]
      var { token } = config
    }

    if (this.$route.params.id == 'ftp') {
      this.ftpclient().then((res) => {
        for (let [index, item] of res.entries()) {
          const { name, size, isDirectory, modifiedAt } = item
          this.singleFile = {}
          this.singleFile.id = index
          this.singleFile.server_filename = name
          this.singleFile.size = size
          this.singleFile.parent = '/'
          this.singleFile.path = `/${name}`
          this.singleFile.isdir = Number(isDirectory)
          this.singleFile.local_mtime = modifiedAt
          this.tableData.push(this.singleFile)
        }
      })
    } else if (this.$route.params.id == 'baid') {
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
            fileDate.fs_id = val.fs_id
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
          console.log(error)
        })
    } else if (this.$route.params.id == 'smb') {
      // this.smbClient()
    }
  },
  methods: {
    load(tree, treeNode, resolve) {
      let childFileList = {}
      let children = []
      const config = JSON.parse(localStorage.getItem('config'))[0]
      const { token } = config
      if (tree.isdir === 1) {
        this.$http
          .get(
            `/rest/2.0/xpan/multimedia?method=listall&start=0&path=${tree.path}&access_token=${token}&recursion=0&limit=100`,
          )
          .then((res) => {
            const { list } = res.data
            for (let val of list) {
              childFileList = {}
              if (val.isdir == 1) {
                childFileList.hasChildren = true
              }
              childFileList.isdir = val.isdir
              childFileList.fs_id = val.fs_id
              childFileList.path = val.path
              childFileList.id = Math.random() * 1000
              childFileList.server_filename = val.server_filename
              childFileList.local_ctime = Dateformate(val.local_ctime)
              childFileList.local_mtime = Dateformate(val.local_mtime)
              childFileList.size = SizeConvert(val.size)
              children.push(childFileList)
            }
            console.log(res.data, treeNode)
            resolve(children)
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        return false
      }

      console.log(tree)
    },
    createDiretory() {
      this.centerDialogVisible = true
    },
    submitForm(formName) {
      const config = JSON.parse(localStorage.getItem('config'))[0]
      const { token } = config
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http
            .post(`/rest/2.0/xpan/file?method=create`, {
              //身份认证失败，没有权限
              access_token: token,
              path: this.path,
              isdir: '1',
              size: '0',
            })
            .then((res) => {
              console.log(res.data)
            })
            .catch((error) => {
              console.log(error.toJSON())
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    download(selection, row) {
      this.$refs.down.disabled = !this.$refs.down.disabled
      // console.log(this.$refs.down)
      this.rowfileID = row.fs_id
    },
    downLoadFile() {
      const config = JSON.parse(localStorage.getItem('config'))[0]
      const { token } = config
      this.$http
        .get(
          `/rest/2.0/xpan/multimedia?method=filemetas&access_token=${token}&fs_id=${this.rowfileID}`,
        )
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    async ftpclient() {
      client.ftp.verbose = true
      try {
        await client.access({
          host: 'localhost',
          user: 'username',
          password: '175623',
          secure: false,
        })
        client.ftp.verbose = false // 传输信息展示

        const file = await client.list('')
        client.trackProgress() // 传输跟踪
        return file
      } catch (err) {
        console.log(err)
      }
      client.close()
    },
    async loadFile(row) {
      if (row.isdir == 1) {
        this.cliDirTag = 1
        this.tableData = []
        try {
          //异步错误捕获
          await client.access({
            host: 'localhost',
            user: 'username',
            password: '175623',
            secure: false,
          })
          const listFile = await client.list(row.path)
          for (let [index, item] of listFile.entries()) {
            const { name, size, isDirectory, modifiedAt } = item
            this.singleFile = {}
            this.singleFile.id = index
            this.singleFile.server_filename = name
            this.singleFile.size = size
            this.singleFile.parent = row.server_filename
            this.singleFile.path = `${row.path}/${name}`
            this.singleFile.isdir = Number(isDirectory)
            this.singleFile.local_mtime = modifiedAt
            this.tableData.push(this.singleFile)
          }

          this.$router.push({
            name: 'filelist',
            params: {
              id: `${row.server_filename}`,
              title: `${this.singleFile.path}`,
            },
          })
          client.close()
        } catch (error) {
          console.log(error)
        }
      }
    },
    async smbClient() {
      try {
        let client = new SambaClient({
          address: 'localhost', // required
          username: 'user', // not required, defaults to guest
          password: '175623', // not require
        })
        console.log(await client.getFile('hello.txt', 'smb-share/'))
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    // this.pathbread = this.$route.path
    // console.log(this.$route.matched)
  },
  watch: {
    '$route': function(newVal, oldVal) {
      const Path = {}
      if (this.parents.length == 0) {
        Path.name = newVal.params.id
        Path.path = newVal.path
        this.parents.push(oldVal.params.id)
        this.pathbread.push(Path)
        console.log(this.parents, 0)
      } else {
        this.parents.push(oldVal.params.id)
        for (let val of this.parents) {
          if (newVal.params.id === val) {
            this.cliDirTag = 0
          }
        }

        if (this.cliDirTag === 1) {
          Path.name = newVal.params.id
          Path.path = newVal.path
          this.pathbread.push(Path)
          console.log('ok')
        } else {
          return
        }
      }

      console.log(newVal)
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
