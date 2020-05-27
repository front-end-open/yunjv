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
            <el-button type="primary" @click="upLoadFile"
              >上传<i class="el-icon-upload el-icon--right"></i
            ></el-button>
            <el-button type="primary" :disabled="downtag" @click="downLoadFile"
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
                :to="{ path: item.path, query: { path: item.filePath } }"
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
        @select="selec"
        :default-expand-all="false"
        @row-dblclick="loadFile"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="selection" width="50"> </el-table-column>
        <el-table-column label="名字" sortable width="180">
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
        <el-table-column prop="size" label="大小"> </el-table-column>
        <el-table-column prop="local_mtime" label="已改变" sortable width="180">
        </el-table-column>
        <el-table-column prop="permission" label="权限" sortable width="180">
        </el-table-column>
        <el-table-column prop="Owner" label="所有者"> </el-table-column>
        <el-table-column label="文件操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="editFileName(scope.$index, scope.row)"
              >重命名</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="deleteFile(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 创建文件夹 -->
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
            <el-form-item>
              <el-button type="primary" @click="submitForm()"
                >立即创建</el-button
              >
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <!-- 重命名 -->
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible2"
        width="30%"
        center
      >
        <el-form :inline="true" :model="formDate" class="demo-form-inline">
          <el-form-item label="文件名">
            <el-input v-model="formDate.name" placeholder="文件名"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitChange">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import Vue from 'vue'
import Dateformate from '@/lib/DateFormate.js'
import SizeConvert from '@/lib/SizeConvert.js'
import Server from '@/lib/ServerFactory.js'
import OwnerConvert from '@/lib/PERMISSIONCONVERT.js'
const ipcRenderer = require('electron').ipcRenderer
const SMB = require('@marsaud/smb2')
const ftp = require('basic-ftp')
const path = require('path')
const { dialog } = require('electron').remote
const client = new ftp.Client()
client.ftp.verbose = true
export default {
  name: 'fileList',
  data() {
    return {
      tableData: [],
      centerDialogVisible: false,
      centerDialogVisible2: false,
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        region: '',
        type: '',
      },
      ruleForm: {
        name: '新建文件夹',
        path: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        path: [{ required: true, message: '请指定文件路径', trigger: 'blur' }],
      },
      formDate: {
        name: '',
      },
      rowfileID: '',
      path: '/',
      query: this.$route.params.id,
      singleFile: {},
      pathbread: [],
      parents: [],
      cliDirTag: 0,
      isSame: '',
      rightEventrowDate: null,
      rowDate: {},
      servertypeIndex: null,
      downtag: true,
    }
  },
  created() {
    //面包屑初始路径加载
    this.pathbread = [
      {
        name: `${this.$route.params.id}:`,
        path: `/main/Library/filelist/${this.$route.params.id}`,
        filePath: '/',
      },
    ]
    //服务索引
    this.servertypeIndex = this.$route.params.index
    //服务类型
    this.parents.push(this.$route.params.id)

    if (this.$route.params.id == 'ftp') {
      this.ftpclient().then((res) => {
        console.log(res)
        for (let [index, item] of res.entries()) {
          const { name, size, isDirectory, permissions, date, user } = item
          this.singleFile = {}
          this.singleFile.id = index
          this.singleFile.server_filename = name
          this.singleFile.size = size
          this.singleFile.parent = '/'
          this.singleFile.parentsPath = '/'
          this.singleFile.path = `/${name}`
          this.singleFile.isdir = Number(isDirectory)
          this.singleFile.local_mtime = date
          this.singleFile.permission = OwnerConvert(permissions)
          this.singleFile.Owner = user
          this.tableData.push(this.singleFile)
        }
      })
    } else if (this.$route.params.id == 'baid') {
      let id = 1
      const { index } = this.$route.params
      const config = JSON.parse(localStorage.getItem('config'))[index],
        { token } = config

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
      this.smbClient()
    }
  },
  methods: {
    //百度tree懒加载， 该api已废弃
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
    //创建目录-开启模态
    createDiretory() {
      this.centerDialogVisible = true
    },
    //创建目录
    async submitForm() {
      //ftp服务
      let currentFileInfo = {},
        fileData = []
      try {
        await client.access({
          host: 'localhost',
          user: 'username',
          password: '175623',
          secure: false,
        })
        await client.ensureDir(`${this.path}/${this.ruleForm.name}`)
        await client.list(this.path).then((res) => {
          for (let [index, item] of res.entries()) {
            console.log(index)
            const { name, size, isDirectory, permissions, date, user } = item
            currentFileInfo = {}
            currentFileInfo.id = (Math.random() + 1) * 10
            currentFileInfo.server_filename = name
            currentFileInfo.size = SizeConvert(size)
            currentFileInfo.parent = path.basename(this.path)
            currentFileInfo.parentsPath = this.path
            currentFileInfo.path = `${this.path}/${name}`
            currentFileInfo.isdir = Number(isDirectory)
            currentFileInfo.local_mtime = date
            currentFileInfo.permission = OwnerConvert(permissions)
            currentFileInfo.Owner = user
            fileData.unshift(currentFileInfo)
          }
          this.tableData = fileData
        })
        ipcRenderer.send('async-openNotiton', 'notion') // 发送消息
        ipcRenderer.on('async-openNotiton-reply', (event, arg) => {
          console.log(arg)
        })
        this.centerDialogVisible = false
      } catch (error) {
        console.log(error)
        this.centerDialogVisible = false
        client.close()
      }
    },
    //目录更名
    async submitChange() {
      try {
        await client.access({
          host: '1',
          user: 'username',
          password: '175623',
          secure: false,
        })
        await client.rename(
          this.rowDate[1].path,
          this.rowDate[1].parentsPath + this.formDate.name,
        )
        Vue.set(
          this.tableData[this.rowDate[0]],
          'server_filename',
          this.formDate,
        )
        client.close()
        this.centerDialogVisible2 = false
      } catch (error) {
        console.log(error)
      }
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 选中行，获取行数据
    selec(selection, row) {
      this.rowDate = row
      this.rowfileID = row.fs_id
      if (selection.length) {
        this.downtag = false
      } else {
        this.downtag = true
      }
    },
    //测试用api
    //测试用api
    downLoadFile() {
      const filepath = dialog.showOpenDialog({
        properties: ['openDirectory'],
      })
      const server = new Server(
        'FTP',
        this.servertypeIndex,
        JSON.parse(localStorage.getItem('config')),
        filepath[0],
        this.path,
        this.rowDate,
      )
      server.download().then((res) => {
        console.log(res)
      })
    },
    // 重命名
    //重命名-开启模态框
    //重命名-开启模态框
    async editFileName(index, row) {
      this.centerDialogVisible2 = true
      this.rowDate.push(index, row)
      this.formDate.name = row.server_filename
    },
    //待开发
    deleteFile(index, row) {
      console.log(index, row)
    },
    //文件列表获取
    async ftpclient() {
      const config = JSON.parse(localStorage.getItem('config'))[
        Number(this.servertypeIndex)
      ]
      const { host, user, pwd } = config
      try {
        await client.access({
          host: host,
          user: user,
          password: pwd,
          secure: false,
        })
        console.log(await client.send('PwD'))
        return await client.list('')
      } catch (err) {
        console.log(err)
      }
      client.close()
    },
    //目录切换
    async loadFile(row) {
      //ftp
      const config = JSON.parse(localStorage.getItem('config'))[
        Number(this.servertypeIndex)
      ]
      const { host, user, pwd } = config
      if (row.isdir == 1) {
        //处理目录
        this.cliDirTag = 1
        this.tableData = []
        try {
          //异步错误捕获
          await client.access({
            host: host,
            user: user,
            password: pwd,
            secure: false,
          })
          const listFile = await client.list(row.path) // row 请求目录
          for (let [index, item] of listFile.entries()) {
            const { name, size, isDirectory, permissions, date, user } = item
            this.singleFile = {}
            this.singleFile.parent = row.server_filename //行目录名
            //子目录请求内容
            this.singleFile.id = index
            this.singleFile.server_filename = name
            this.singleFile.size = SizeConvert(size)
            this.singleFile.parentsPath = row.path
            this.singleFile.path = `${row.path}/${name}` // 作为子目录，请求remote-path
            this.singleFile.isdir = Number(isDirectory)
            this.singleFile.local_mtime = date
            this.singleFile.permission = OwnerConvert(permissions)
            this.singleFile.Owner = user
            this.tableData.push(this.singleFile) //把行请求内容加入到表格数据
          }

          this.path = row.path
          this.$router.push({
            name: 'filelist',
            params: {
              id: `${row.server_filename}`,
              title: `${row.path}`,
            },
          })
          client.close()
        } catch (error) {
          console.log(error)
        }
      }
    },
    //smb服务文件列表获取
    async smbClient() {
      try {
        const smbclient = new SMB({
          share: '\\\\172.20.87.53\\smbshare', // required
          domain: 'WORKGROUP', // not required
          username: 'wangshan', // not required, defaults to guest
          password: '175623', // not required
        })
        smbclient.readFile('foo.txt', function(err, content) {
          if (err) throw err
          console.log(content)
        })
      } catch (error) {
        console.log(error)
      }
    },
    //面包屑切换文件列表加载
    async getFile(path, parent) {
      //ftp
      const config = JSON.parse(localStorage.getItem('config'))[
        Number(this.servertypeIndex)
      ]
      const { host, user, pwd } = config
      if (path) {
        try {
          await client.access({
            host: host,
            user: user,
            password: pwd,
            secure: false,
          })
          var source = await client.list(path)
          return source
        } catch (error) {
          console.log(error)
        }
        client.close()
      } else {
        await client.access({
          host: 'localhost',
          user: 'username',
          password: '175623',
          secure: false,
        })
        source = await client.list(parent)
        client.close()
      }
      return source
    },
    //文件上传
    upLoadFile() {
      if (this.parents[0] == 'ftp') {
        const filepath = dialog.showOpenDialog({
          properties: ['openDirectory'],
        })
        const server = new Server(
          'FTP',
          this.servertypeIndex,
          JSON.parse(localStorage.getItem('config')),
          filepath[0],
          this.path,
          this.rowDate,
        )
        server.upload().then((res) => {
          if (res) {
            for (let val of res) {
              this.tableData.push(val)
            }
          }
        })
      }
    },
  },
  computed: {
    filterDate: function() {
      const inFiltered = this.tableData.filter((val) => {
        if (val.isdir == 1) {
          return true
        }
      })
      return inFiltered
    },
  },
  mounted() {},
  watch: {
    //面包屑功能-路由列表加载
    '$route': function(newVal) {
      const Path = {}
      for (let val of this.parents) {
        //面包屑路由切换
        if (newVal.params.id === val) {
          this.cliDirTag = 0
        }
      }
      if (this.cliDirTag === 1) {
        //目录切换
        Path.name = newVal.params.id
        Path.filePath = newVal.params.title
        Path.path = newVal.path
        this.parents.push(newVal.params.id)
        this.pathbread.push(Path)
      } else {
        for (let [index, item] of this.parents.entries()) {
          if (newVal.params.id === item) {
            this.isSame = index
          }
        }

        this.getFile(newVal.query.path, newVal.params.id).then((res) => {
          this.tableData = []
          for (let item of res) {
            const { name, size, isDirectory, permissions, date, user } = item
            this.singleFile = {}
            this.singleFile.id = (Math.random() + 1) * 10
            this.singleFile.server_filename = name
            this.singleFile.size = SizeConvert(size)
            this.singleFile.parentsPath = newVal.query.path
            this.singleFile.path = `${newVal.query.path}${name}`
            this.singleFile.isdir = Number(isDirectory)
            this.singleFile.local_mtime = date
            this.singleFile.permission = OwnerConvert(permissions)
            this.singleFile.Owner = user
            this.tableData.push(this.singleFile)
          }
          this.pathbread.splice(this.isSame + 1)
          this.parents.splice(this.isSame + 1)
        })
      }
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
