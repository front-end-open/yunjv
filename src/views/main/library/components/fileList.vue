<template>
  <el-container>
    <el-header>
      <el-row class="row-bg" :gutter="20">
        <el-col :span="5">
          <div class="switch">
            <!-- <i class="el-icon-menu cos"></i> -->
            <el-button-group>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
              ></el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-share"
              ></el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-delete"
              ></el-button>
            </el-button-group>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="control">
            <el-button size="mini" type="primary" @click="createDiretory"
              >新建文件夹</el-button
            >
            <el-dropdown trigger="click" style="margin: 0 12px">
              <el-button size="mini" type="primary">
                文件操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="moveFile_btn_dad">
                  <el-button
                    size="mini"
                    class="moveFile_btn"
                    type="text"
                    @click="openDialog_move('copy')"
                    >复制</el-button
                  >

                  <el-dialog
                    title="复制到"
                    :visible.sync="copeDialog"
                    append-to-body
                    class="fixedWH"
                    width="550px"
                  >
                    <div class="border">
                      <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="selecPath"
                      >
                      </el-input>
                      <el-tree
                        class="filter-tree"
                        :props="props"
                        :filter-nodeDate-method="filterNode"
                        highlight-current
                        lazy
                        :load="lazyLoadTreeDir"
                        ref="tree"
                      >
                      </el-tree>
                    </div>

                    <div slot="footer" class="dialog-footer">
                      <el-button @click="copeDialog = false">取 消</el-button>
                      <el-button type="primary" @click="moveOk('copy')"
                        >确 定</el-button
                      >
                    </div>
                  </el-dialog>
                </el-dropdown-item>
                <el-dropdown-item class="moveFile_btn_dad">
                  <el-button
                    size="mini"
                    class="moveFile_btn"
                    type="text"
                    @click="openDialog_move('move')"
                    >移动</el-button
                  >

                  <el-dialog
                    title="移动到"
                    :visible.sync="moveDialog"
                    append-to-body
                    class="fixedWH"
                    width="550px"
                  >
                    <div class="border">
                      <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="selecPath"
                      >
                      </el-input>
                      <el-tree
                        class="filter-tree"
                        :props="props"
                        :filter-nodeDate-method="filterNode"
                        highlight-current
                        lazy
                        :load="lazyLoadTreeDir"
                        ref="tree"
                      >
                      </el-tree>
                    </div>

                    <div slot="footer" class="dialog-footer">
                      <el-button @click="moveDialog = false">取 消</el-button>
                      <el-button type="primary" @click="moveOk('move')"
                        >确 定</el-button
                      >
                    </div>
                  </el-dialog>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-button size="mini" type="primary" @click="upLoadFile"
              >上传<i class="el-icon-upload el-icon--right"></i
            ></el-button>
            <el-button
              size="mini"
              type="primary"
              :disabled="downtag"
              @click="downLoadFile"
              >下载<i class="el-icon-download el-icon--right"></i
            ></el-button>
          </div>
        </el-col>
        <el-col :span="5" :offset="4">
          <el-input placeholder="请输入内容">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
      </el-row>
    </el-header>

    <el-row class="breadbox">
      <el-col :span="24">
        <div class="bread" style="margin: 12px">
          <el-breadcrumb separator-class="el-icon-arrow-right">
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

    <el-main>
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        @select="selec"
        @selection-change="seleChange"
        :default-expand-all="false"
        @row-dblclick="switchDir"
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
            <el-popconfirm
              confirmButtonText="好的"
              cancelButtonText="不用了"
              icon="el-icon-info"
              iconColor="red"
              title="确认删除？"
              @onConfirm="deleteFile(scope.$index, scope.row)"
            >
              <el-button
                size="mini"
                slot="reference"
                type="text"
                :plain="true"
                class="delete"
                >删除
              </el-button>
            </el-popconfirm>
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
          <el-button @click="centerDialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="changeDirName">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import Dateformate from '@/lib/DateFormate.js'
import SizeConvert from '@/lib/SizeConvert.js'
import Server from '@/lib/ServerFactory.js'
import OwnerConvert from '@/lib/PERMISSIONCONVERT.js'
const ipcRenderer = require('electron').ipcRenderer
const path = require('path')
const ftp = require('basic-ftp')
const SMB = require('@marsaud/smb2')
// const fs = require('fs')
const { dialog } = require('electron').remote
const client = new ftp.Client()
export default {
  name: 'fileList',
  data() {
    return {
      props: {
        label: 'name',
        children: 'zones',
      },
      tableData: [],
      tableDatas: [],
      centerDialogVisible: false,
      centerDialogVisible2: false,
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        region: '',
        type: '',
      },
      ruleForm: {
        name: 'NEW',
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
      query: this.$route.params.serverType,
      singleFile: {},
      pathbread: [],
      parents: [],
      cliDirTag: 0,
      isSame: '',
      rightEventrowDate: null,
      rowDate: {},
      servertypeIndex: null,
      downtag: true,
      showtag: false,
      // 目录移动数据
      selecPath: '',
      moveDialog: false, // 关闭dialog
      copeDialog: false, // 关闭dialog

      moveDatas: [],
    }
  },
  created() {
    // 面包屑初始路径加载
    // 服务索引
    this.servertypeIndex = this.$route.params.index
    // 服务类型
    this.parents.push(this.$route.params.serverType)

    if (this.$route.params.serverType == 'ftp') {
      this.pathbread = [
        {
          name: `${this.$route.params.serverType}:`,
          path: `/main/Library/filelist/${this.$route.params.serverType}`,
          filePath: '/',
        },
      ]
      this.tableData = this.$store.state.indexFileDate
    } else if (this.$route.params.serverType == 'baid') {
      this.tableData = this.$store.state.indexFileDate
      this.pathbread = [
        {
          name: `${this.$route.params.serverType}:`,
          path: `/main/Library/filelist/${this.$route.params.serverType}`,
          filePath: '/',
        },
      ]
    } else if (this.$route.params.serverType == 'smb') {
      this.pathbread = [
        {
          name: `${this.$route.params.serverType}:`,
          path: `/main/Library/filelist/${this.$route.params.serverType}`,
          filePath: '',
        },
      ]
      // this.smbClient()
      this.tableData = this.$store.state.indexFileDate
    }
  },
  methods: {
    // 创建目录-开启模态
    createDiretory() {
      this.centerDialogVisible = true
    },
    // 创建目录
    async submitForm() {
      var config = JSON.parse(localStorage.getItem('config'))[
        Number(this.servertypeIndex)
      ]
      const { host, user, pwd } = config
      switch (this.parents[0]) {
        case 'ftp':
          var createD = new Server( // 实列话类
            'FTP',
            this.servertypeIndex,
            JSON.parse(localStorage.getItem('config')),
            '',
            this.path,
            '',
          )
          createD.createDir(this.ruleForm.name).then(
            // 创建目录
            (res) => {
              ipcRenderer.send('async-openNotiton', 'notion') //  发送消息
              ipcRenderer.on('async-openNotiton-reply', (event, arg) => {
                console.log(arg)
              })
              this.tableData = res
              this.centerDialogVisible = false
            },
            () => {
              this.centerDialogVisible = false
            },
          )
          break
        case 'smb':
          var smbclient = new SMB({
            share: `\\\\${host}\\share`,
            domain: 'WORKGROUP',
            username: user,
            password: pwd,
          })
          this.path == '/'
            ? smbclient.mkdir(
                `${this.ruleForm.name}` + Math.random(),
                (err) => {
                  if (err) throw err
                  console.log('Directory created!')
                  let tableDatas = []
                  smbclient.readdir('').then((res) => {
                    for (let item of res) {
                      this.singleFile = {}
                      this.singleFile.parent = res.server_filename // 行目录名
                      // 子目录请求内容
                      this.singleFile.id = Math.random()
                      this.singleFile.server_filename = item
                      this.singleFile.parentsPath = ``
                      this.singleFile.path = `${item}` //  作为子目录，请求remote-path
                      this.singleFile.isdir = path.extname(item) ? 0 : 1
                      this.singleFile.local_mtime = ''
                      this.singleFile.permission = ''
                      this.singleFile.Owner = 'owner'
                      tableDatas.push(this.singleFile) // 把行请求内容加入到表格数据
                    }
                    this.tableData = tableDatas
                  })
                },
              )
            : smbclient.mkdir(
                `${this.path}${this.ruleForm.name}` + Math.random(),
                (err) => {
                  if (err) throw err
                  console.log('Directory created!')

                  let tableDatas = []
                  smbclient.readdir(this.path).then((res) => {
                    for (let item of res) {
                      this.singleFile = {}
                      this.singleFile.parent = res.server_filename // 行目录名
                      // 子目录请求内容
                      this.singleFile.id = Math.random()
                      this.singleFile.server_filename = item
                      this.singleFile.parentsPath = `${this.path}`
                      this.singleFile.path = `${this.path}${item}\\\\` //  作为子目录，请求remote-path
                      this.singleFile.isdir = path.extname(item) ? 0 : 1
                      this.singleFile.local_mtime = ''
                      this.singleFile.permission = ''
                      this.singleFile.Owner = 'owner'
                      tableDatas.push(this.singleFile) // 把行请求内容加入到表格数据
                    }

                    this.tableData = tableDatas
                  })
                },
              )
          this.centerDialogVisible = false
          break
        case 'baid':
          this.$http
            .post(
              `/rest/2.0/xpan/file?method=create&access_token=123.9b363f1852f72c024a6470c1e5e730fa.YgzruX0wiZqvTI4l6cI9XHemcKfx6yl9mBF4IdL.Bp9iaA`,
              {
                path: '/w2',
                size: '0',
                isdir: '1',
              },
            )
            .then((res) => {
              console.log(res)
            })
          break
      }
    },
    // 重命名-开启模态框
    async editFileName(index, row) {
      this.rowDate = []
      this.centerDialogVisible2 = true // 打开模态框
      this.rowDate.push(row)
      this.formDate.name = row.server_filename
    },
    // 重命名-目录更该
    async changeDirName() {
      const config = JSON.parse(localStorage.getItem('config'))[
        Number(this.servertypeIndex)
      ]
      if (this.parents[0] == 'ftp') {
        const { host, user, pwd } = config
        const client = new ftp.Client()
        client.ftp.verbose = true
        try {
          await client.access({
            host,
            user,
            password: pwd,
            secure: false,
          })
          await client.rename(
            this.rowDate[0].path, // 设置要更改的文件/文件夹路径
            `${this.rowDate[0].parentsPath}/${this.formDate.name}`, // 设置更改后的路径---祖先路径+当前文件名
          )
          await client.list(this.path).then((res) => {
            this.tableDatas = []
            for (let [index, item] of res.entries()) {
              const { name, size, isDirectory, modifiedAt } = item
              this.singleFile = {}
              this.singleFile.parent = res.server_filename // 行目录名
              // 子目录请求内容
              this.singleFile.id = index + Math.random()
              this.singleFile.server_filename = name
              this.singleFile.size = SizeConvert(size)
              this.singleFile.parentsPath = this.rowDate[0].parentsPath
              this.singleFile.path =
                this.rowDate[0].parentsPath == '/'
                  ? `${this.rowDate[0].parentsPath}${name}`
                  : `${this.rowDate[0].parentsPath}/${name}`
              this.singleFile.isdir = Number(isDirectory)
              this.singleFile.local_mtime = modifiedAt
              this.tableDatas.push(this.singleFile) // 把行请求内容加入到表格数据
            }
          })
          this.tableData = this.tableDatas // 将新的列表赋给原列表
          this.centerDialogVisible2 = false
          //  }
          client.close()
        } catch (error) {
          this.centerDialogVisible2 = false // 关闭模态框
          console.log(error)
          client.close()
        }
      } else if (this.parents[0] == 'smb') {
        const { host, user, pwd } = config
        var smbclient = new SMB({
          share: `\\\\${host}\\share`,
          domain: 'WORKGROUP',
          username: user,
          password: pwd,
        })
        if (this.rowDate[0].parentsPath == '') {
          //根目录下重命名
          smbclient.rename(
            this.rowDate[0].path.slice(0, -2),
            `${this.formDate.name}`,
            function(err) {
              if (err) throw err
              console.log('file has been renamed')
            },
          )
        } else {
          //子目录下更名
          smbclient.rename(
            `${this.rowDate[0].parentsPath}${this.rowDate[0].server_filename}`,
            `${this.rowDate[0].parentsPath}${this.formDate.name}`,
            function(err) {
              if (err) throw err
              console.log('file has been renamed')
            },
          )
          this.centerDialogVisible2 = false //关闭模态框
        }
      } else if (this.parents[0] == 'baid') {
        const { token } = config
        this.tableData = []
        let id = 1
        this.$http
          .get(`/rest/2.0/xpan/file`, {
            params: {
              method: 'filemanager',
              opera: 'rename',
              access_token: token,
              filelist: [
                {
                  'path': this.rowDate[0].path,
                  'dest': this.path,
                  'newname': this.formDate,
                },
              ],
              async: 1,
            },
          })
          .then((res) => {
            const { list } = res.data
            console.log(res)
            let fileDate = {}
            for (let val of list) {
              //  由于返回数据没有标识，因此需要加上筛选拼接数据
              fileDate = {}
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
          })
          .catch((error) => {
            console.log(error)
          })
      }
      this.centerDialogVisible2 = false // 关闭模态框
    },
    // TODO: 文件删除
    async deleteFile(index, row) {
      const config = JSON.parse(localStorage.getItem('config'))[
        this.servertypeIndex
      ]
      const { host, user, pwd, token } = config

      if (this.parents[0] == 'ftp') {
        // ftp__删除文件/夹路径
        try {
          await client.access({
            host,
            user,
            password: pwd,
            secure: false,
          })
          switch (row.isdir) {
            case 1:
              await client.removeDir(row.path)
              break
            case 0:
              await client.remove(row.path)
              break
          }
          await client.list(row.parentsPath).then((res) => {
            this.tableDatas = []
            for (let [index, item] of res.entries()) {
              const { name, size, isDirectory, modifiedAt } = item
              this.singleFile = {}
              this.singleFile.parent = res.server_filename // 行目录名
              // 子目录请求内容
              this.singleFile.id = index + Math.random()
              this.singleFile.server_filename = name
              this.singleFile.size = SizeConvert(size)
              this.singleFile.parentsPath = row.parentsPath
              this.singleFile.path =
                row.parentsPath == '/'
                  ? `${row.parentsPath}${name}`
                  : `${row.parentsPath}/${name}`
              this.singleFile.isdir = Number(isDirectory)
              this.singleFile.local_mtime = modifiedAt
              this.tableDatas.push(this.singleFile) // 把行请求内容加入到表格数据
            }
          })
          this.tableData = this.tableDatas // 将新的列表赋给原列表
        } catch (error) {
          console.log(error)
        }
      } else if (this.parents[0] == 'smb') {
        // smb__删除文件/夹路径
        try {
          const config = JSON.parse(localStorage.getItem('config'))[
            Number(this.servertypeIndex)
          ]
          const { host, user, pwd } = config
          var smbclient = new SMB({
            share: `\\\\${host}\\share`,
            domain: 'WORKGROUP',
            username: user,
            password: pwd,
          })
          if (row.isdir === 1) {
            await smbclient.rmdir(`${row.server_filename}`, function(err) {
              if (err) throw err
              console.log('dirctory has been deleted')
            })
          } else {
            await smbclient.unlink(`${row.server_filename}`, function(err) {
              if (err) throw err
              console.log('file has been deleted')
            })
          }
        } catch (error) {
          console.log(error)
        }
      } else if (this.parents[0] == 'baid') {
        this.tableData = []
        let id = 1

        const filePath = []
        console.log(this.rowDate.path)
        filePath.path = this.rowDate.path

        this.$http
          .get(`/rest/2.0/xpan/file`, {
            params: {
              opera: 'delete',
              filelist: filePath,
              async: 0,
              method: 'filemanager',
              access_token: token,
            },
          })
          .then((res) => {
            const { list } = res.data
            console.log(res)
            let fileDate = {}
            for (let val of list) {
              fileDate = {}
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
              console.log(this.tableData)
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    //  ftp--文件列表获取
    async ftpclient() {
      const config = JSON.parse(localStorage.getItem('config'))[
        Number(this.servertypeIndex)
      ]
      const { host, user, pwd } = config
      try {
        await client
          .access({
            host,
            user,
            password: pwd,
            secure: false,
          })
          .then((res) => {
            console.log(res)
          })
        return await client.list('')
      } catch (err) {
        console.log(err)
        client.close()
      }
    },
    //  smb服务文件列表获取
    async smbClient() {
      switch (this.parents[0]) {
        case 'ftp':
          break
        case 'smb':
          var files = new Server(
            'SMB',
            this.servertypeIndex,
            JSON.parse(localStorage.getItem('config')),
            '',
            '',
            '',
          )
          //  获取文件
          this.tableData = files.loadFile()
          break
      }
    },
    //  目录切换
    async switchDir(row) {
      // ftp
      const config = JSON.parse(localStorage.getItem('config'))[
        Number(this.servertypeIndex)
      ]
      const { host, user, pwd, token } = config
      this.switchDirTag = 1
      switch (this.parents[0]) {
        case 'ftp':
          if (row.isdir == 1) {
            // 处理目录
            //  let currentDirflag = Math.ceil(Math.random() + 10)
            this.tableData = [] // 目录清空

            try {
              // 异步错误捕获
              await client.access({
                host,
                user,
                password: pwd,
                secure: false,
              })
              await client.list(row.path).then((res) => {
                for (let [index, item] of res.entries()) {
                  const {
                    name,
                    size,
                    isDirectory,
                    permissions,
                    date,
                    user,
                  } = item
                  this.singleFile = {}
                  this.singleFile.parent = row.server_filename // 行目录名
                  // 子目录请求内容
                  this.singleFile.id = index
                  this.singleFile.server_filename = name
                  this.singleFile.size = SizeConvert(size)
                  this.singleFile.parentsPath = row.path + '/'
                  this.singleFile.path = `${row.path}/${name}` //  作为子目录，请求remote-path
                  this.singleFile.isdir = Number(isDirectory)
                  this.singleFile.local_mtime = date
                  this.singleFile.permission = permissions
                    ? OwnerConvert(permissions)
                    : ''
                  this.singleFile.Owner = user
                  this.tableData.push(this.singleFile) // 把行请求内容加入到表格数据
                }
              })
              this.path = row.path
              this.$router.push({
                name: 'filelist',
                params: {
                  serverType: `${row.server_filename}`,
                  currentdirpath: `${row.path}`,
                },
              })
            } catch (error) {
              this.$router.push({
                name: 'filelist',
                params: {
                  serverType: `${row.server_filename}`,
                  currentdirpath: `${row.path}`,
                },
              })
              alert('目录无内容')
              client.close()
              console.log(error)
            }
          }
          break
        case 'baid':
          console.log(row)
          if (row.isdir) {
            this.tableData = []
            this.path = row.path
            this.$router.push({
              name: 'filelist',
              params: {
                serverType: `${row.server_filename}`,
                currentdirpath: `${row.path}`,
              },
            })
            this.$http
              .get('/rest/2.0/xpan/multimedia', {
                params: {
                  path: row.path,
                  access_token: token,
                  order: 'size',
                  method: 'listall',
                  recursion: '0',
                  desc: '1',
                  start: 0,
                },
              })
              .then((res) => {
                const { list } = res.data
                let fileDate = {},
                  id = 0
                for (let val of list) {
                  //  由于返回数据没有标识，因此需要加上筛选拼接数据
                  fileDate = {}
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
              })
              .catch((error) => {
                this.path = row.path
                this.$router.push({
                  name: 'filelist',
                  params: {
                    serverType: `${row.server_filename}`,
                    currentdirpath: `${row.path}`,
                  },
                })
                console.log(error.toJSON())
              })
          }
          break
        case 'smb':
          if (row.isdir == 1) {
            // 处理目录
            //  let currentDirflag = Math.ceil(Math.random() + 10)
            this.switchDirTag = 1
            this.tableData = [] // 目录清空

            try {
              // 异步错误捕获
              var smbclient = new SMB({
                share: `\\\\${host}\\share`,
                domain: 'WORKGROUP',
                username: user,
                password: pwd,
                autoCloseTimeout: 0,
              })
              // smbclient.exists(row.path).then((res) => {
              //   console.log(res)
              // })
              await smbclient.readdir(row.path).then((res) => {
                for (let item of res) {
                  this.singleFile = {}
                  this.singleFile.parent = row.server_filename // 行目录名
                  // 子目录请求内容
                  this.singleFile.id = Math.random()
                  this.singleFile.server_filename = item
                  this.singleFile.parentsPath = `${row.path}`
                  this.singleFile.path = `${row.path}${item}\\\\` //  作为子目录，请求remote-path
                  this.singleFile.isdir = path.extname(item) ? 0 : 1
                  this.singleFile.local_mtime = ''
                  this.singleFile.permission = ''
                  this.singleFile.Owner = 'owner'
                  this.tableData.push(this.singleFile) // 把行请求内容加入到表格数据
                }
              })
              this.path = row.path
              this.$router.push({
                name: 'filelist',
                params: {
                  serverType: `${row.server_filename}`,
                  currentdirpath: `${row.path}`,
                },
              })
              smbclient.disconnect()
            } catch (error) {
              this.$router.push({
                name: 'filelist',
                params: {
                  serverType: `${row.server_filename}`,
                  currentdirpath: `${row.path}`,
                },
              })
              // alert('目录无内容')
              smbclient.disconnect()
              console.log(error)
            }
          }
          break
      }
    },
    //面包屑切换文件列表加载
    async getFile(path, parent) {
      // ftp
      const config = JSON.parse(localStorage.getItem('config'))[
        Number(this.servertypeIndex)
      ]
      const { host, user, pwd, token } = config
      if (this.parents[0] == 'ftp') {
        if (path) {
          var source = null
          try {
            await client.access({
              host,
              user,
              password: pwd,
              secure: false,
            })
            source = await client.list(path)
            //  return source
          } catch (error) {
            client.close()
            console.log(error)
          }
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
      } else if (this.parents[0] == 'baid') {
        // 待完成
        let id = 1
        this.$http
          .get(`/rest/2.0/xpan/multimedia`, {
            params: {
              path,
              method: 'listall',
              access_token: token,
            },
          })
          .then((res) => {
            const { list } = res.data
            let fileDate = {}
            for (let val of list) {
              //  由于返回数据没有标识，因此需要加上筛选拼接数据
              fileDate = {}
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
          })
          .catch((error) => {
            console.log(error)
          })
      } else if (this.parents[0] == 'smb') {
        const smbclient = new SMB({
          share: `\\\\${host}\\share`,
          domain: 'WORKGROUP',
          username: user,
          password: pwd,
          autoCloseTimeout: 0,
        })
        return await smbclient.readdir(path)
      }
    },
    //  文件上传
    //  TODO: 文件上传
    upLoadFile() {
      if (this.parents[0] == 'ftp') {
        const filepath = dialog.showOpenDialog({
          properties: ['openDirectory'],
        })
        if (filepath) {
          const server = new Server(
            'FTP',
            this.servertypeIndex,
            JSON.parse(localStorage.getItem('config')),
            filepath[0],
            this.path,
            this.rowDate,
          )
          server.upload().then((res) => {
            this.tableData = res
            console.log(res)
          })
        }
      } else if (this.parents[0] == 'smb') {
        const selecfilepath = dialog.showOpenDialog({
          properties: ['openFile', 'promptToCreate'],
          message: '选择文件',
        })
        let filename = path.basename(selecfilepath[0])
        let smbServer = new Server(
          'SMB',
          this.servertypeIndex,
          JSON.parse(localStorage.getItem('config')),
          '',
          '',
          '',
        )
        let file = smbServer.upload(`${filename}`, selecfilepath[0], parent)
        if (file) {
          this.tableData = []
          for (let item of file) {
            this.singleFile = {}
            this.singleFile.parent = path.basename(this.path)
            this.singleFile.id = Math.random()
            this.singleFile.parentsPath = this.path
            this.singleFile.path = this.path ? `${this.path}\\\\${item}` : item
            this.singleFile.isdir = path.extname(item) ? 0 : 1
            this.singleFile.local_mtime = ''
            this.singleFile.permissions = ''
            this.singleFile.Owner = 'owner'
            this.tableData.push(this.singleFile)
          }
        }
      } else if (this.parents[0] == 'baid') {
        const filepath = dialog.showOpenDialog({
          properties: ['openDirectory'],
        })
        filepath[0]
        this.$http.post('')
      }
    },
    //  文件下载
    // TODO: 下载优化
    downLoadFile() {
      //  ftp-目录出创建

      switch (this.parents[0]) {
        case 'ftp':
          var filepath = dialog.showOpenDialog({
            properties: ['openDirectory'],
          })
          var server = new Server(
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
          break
        case 'baid':
          break
        case 'smb':
          var selecfilepath = dialog.showOpenDialog({
            properties: ['openDirectory', 'createDirectory', 'promptToCreate'],
            message: '选择文件',
          })
          var smb = new Server(
            'SMB',
            this.servertypeIndex,
            JSON.parse(localStorage.getItem('config')),
            '',
            '',
            '',
          )
          smb
            .download(
              this.rowDate.path,
              `${selecfilepath[0]}//${this.rowDate.server_filename}`,
            )
            .then((res) => {
              console.log(res)
            })
          break
      }
    },
    openDialog_move(select) {
      select == 'move' ? (this.moveDialog = true) : (this.copeDialog = true) // 打开模态框
    },
    //  文件移动/复制--点击列表
    async lazyLoadTreeDir(node, resolve) {
      const config = JSON.parse(localStorage.getItem('config'))[
        Number(this.servertypeIndex)
      ]
      const { host, user, pwd, token } = config
      let moveFile = {},
        moveData = []
      const client = new ftp.Client()
      if (node.level === 0) {
        for (let item of this.tableData) {
          const { server_filename, isdir } = item
          moveFile = {}
          //   // 子目录请求内容
          if (isdir) {
            moveFile.id = Math.random()
            moveFile.name = server_filename // 行目录名
            if (this.parents[0] == 'ftp') {
              moveFile.parentsPath = `/`
              moveFile.path = `/${server_filename}`
            } else if (this.parents[0] == 'smb') {
              moveFile.parentsPath = ``
              moveFile.path = `${server_filename}`
              moveFile.isdir = path.extname(server_filename) ? 0 : 1
            } else if (this.parents[0] == 'baid') {
              moveFile.path = `/${server_filename}`
            }
            moveData.push(moveFile)
          }
        }
        return resolve(moveData)
      }
      if (this.parents[0] == 'ftp') {
        try {
          const client = new ftp.Client()
          await client.access({
            host,
            user,
            password: pwd,
            secure: false,
          })
          await client.list(node.data.path).then((res) => {
            for (let [index, item] of res.entries()) {
              moveFile = {}
              const { name, isDirectory } = item
              if (isDirectory) {
                moveFile.id = index + Math.random()
                moveFile.parentsPath = node.data.path
                moveFile.path = `${node.data.path}/${name}`
                moveFile.name = name // 行目录名
                moveData.push(moveFile)
              }
            }

            this.selecPath = node.data.path
            resolve(moveData)
          })
          client.close()
        } catch (error) {
          console.log(error)
          client.close()
        }
      } else if (this.parents[0] == 'smb') {
        try {
          const config = JSON.parse(localStorage.getItem('config'))[
            Number(this.servertypeIndex)
          ]
          const { host, user, pwd } = config
          var smbclient = new SMB({
            share: `\\\\${host}\\share`,
            domain: 'WORKGROUP',
            username: user,
            password: pwd,
          })
          smbclient.readdir(node.data.path).then((res) => {
            for (let item of res.entries()) {
              moveFile = {}
              if (node.data.isdir) {
                moveFile.id = Math.random()
                moveFile.name = item[1]
                moveFile.isdir = path.extname(node.data.path) ? 0 : 1
                moveFile.path = `${node.data.path}\\\\${item[1]}` //  作为子目录，请求remote-path
                moveData.push(moveFile) // 把行请求内容加入到表格数据
              }
            }
            this.selecPath = node.data.path

            resolve(moveData)
          })
        } catch (error) {
          console.log(error)
          client.close()
        }
      } else if (this.parents[0] == 'baid') {
        console.log(node.data.path)
        this.$http
          .get('/rest/2.0/xpan/file', {
            params: {
              dir: node.data.path,
              access_token: token,
              order: 'size',
              method: 'list',
              recursion: '0',
              desc: '1',
              start: 0,
            },
          })
          .then((res) => {
            const { list } = res.data
            let id = 0
            for (let val of list) {
              //  由于返回数据没有标识，因此需要加上筛选拼接数据
              moveFile = {}
              if (val.isdir) {
                moveFile.id = id
                moveFile.fs_id = val.fs_id
                moveFile.name = val.server_filename
                moveFile.isdir = val.isdir
                moveFile.path = val.path
                moveData.push(moveFile)
                ++id
              }
            }
            this.selecPath = node.data.path
            resolve(moveData)
          })
          .catch((error) => {
            console.log(error.toJSON())
          })
      }
    },
    // 移动/复制 提交
    async moveOk(select) {
      const config = JSON.parse(localStorage.getItem('config'))[
        Number(this.servertypeIndex)
      ]
      const { host, user, pwd, token } = config
      if (this.parents[0] == 'ftp') {
        try {
          await client.access({
            host,
            user,
            password: pwd,
            secure: false,
          })
          if (select == 'move') {
            await client.rename(
              this.rowDate.path,
              `${this.selecPath}/${this.rowDate.server_filename}`,
            )
            await client.list(this.rowDate.parentsPath).then((res) => {
              this.tableDatas = []
              for (let [index, item] of res.entries()) {
                const { name, isDirectory } = item
                this.singleFile = {}
                this.singleFile.parent = res.server_filename // 行目录名
                // 子目录请求内容
                this.singleFile.id = index + Math.random()
                this.singleFile.server_filename = name
                this.singleFile.parentsPath = this.selecPath
                this.singleFile.path =
                  this.selecPath == '/'
                    ? `${this.selecPath}${name}`
                    : `${this.selecPath}/${name}`
                this.singleFile.isdir = Number(isDirectory)
                this.tableDatas.push(this.singleFile) // 把行请求内容加入到表格数据
              }
            })
            this.tableData = this.tableDatas // 将新的列表赋给原列表
            await client.lint
          } else if (select == 'copy') {
            console.log('复制功能')
          }
          this.copeDialog = false
          this.moveDialog = false
        } catch (error) {
          console.log(error)
          client.close()
        }
      } else if (this.parents[0] == 'smb') {
        console.log('smb文件移动')
      } else if (this.parents[0] == 'baid') {
        if (select == 'move') {
          this.tableData = []
          const filePath = []
          filePath.path = this.rowDate.path
          filePath.dest = this.selecPath
          filePath.newname = this.rowDate.server_filename
          this.$http.get(`/rest/2.0/xpan/file?`, {
            params: {
              method: 'filemanager',
              opera: 'move',
              access_token: token,
              filelist: filePath,
              async: 1,
            },
          })
        } else {
          this.tableData = []
          const filePath = []
          let fileMag = {}
          fileMag.path = this.rowDate.path
          fileMag.dest = this.selecPath
          fileMag.newname = this.rowDate.server_filename
          filePath.push(fileMag)
          console.log(filePath)
          this.$http.get(`/rest/2.0/xpan/file`, {
            params: {
              method: 'filemanager',
              opera: 'copy',
              access_token: token,
              filelist: filePath,
              async: 1,
            },
          })
        }
      }

      this.moveDialog = false //关闭模态框
      this.copeDialog = false //关闭模态框
    },

    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    //  选中行，获取行数据
    selec(selection, row) {
      if (selection.length) {
        this.rowDate = row
        // this.downtag = false
      } else {
        this.rowDate = []
        // this.downtag = true
      }
    },
    // 文件移动--搜索展示
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    seleChange(selection) {
      if (selection.length) {
        this.downtag = false
      } else {
        this.downtag = true
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
    // 搜索内容
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    // New.params.id 切换目录，当前目录
    // New.params.title 当前目录路径
    // 面包屑功能-路由列表加载
    '$route': function(newVal) {
      console.log(newVal)
      const Path = {} // 存入当前面包屑路径
      for (let val of this.parents) {
        // 面包屑路由切换
        if (newVal.params.serverType === val) {
          this.switchDirTag = 0
        }
      }
      //  cliDirTag 表示路由的前进后退
      if (this.switchDirTag === 1) {
        // 目录切换，添加面包屑路径
        Path.name = newVal.params.serverType
        Path.filePath = newVal.params.currentdirpath
        Path.path = newVal.path
        this.parents.push(newVal.params.serverType)
        this.pathbread.push(Path)
      } else {
        // 面包屑切换
        this.path = newVal.query.path
        for (let [index, item] of this.parents.entries()) {
          if (newVal.params.serverType === item) {
            this.isSame = index //
          }
        }
        if (this.parents[0] == 'ftp') {
          this.getFile(newVal.query.path, newVal.params.serverType).then(
            (res) => {
              this.tableData = []
              for (let item of res) {
                const {
                  name,
                  size,
                  isDirectory,
                  permissions,
                  date,
                  user,
                } = item
                this.singleFile = {}
                this.singleFile.id = (Math.random() + 1) * 10
                this.singleFile.server_filename = name
                this.singleFile.size = SizeConvert(size)
                this.singleFile.parentsPath = newVal.query.path
                this.singleFile.path = `${newVal.query.path}${name}`
                this.singleFile.isdir = Number(isDirectory)
                this.singleFile.local_mtime = date
                this.singleFile.permission = permissions
                  ? OwnerConvert(permissions)
                  : ''
                this.singleFile.Owner = user
                this.tableData.push(this.singleFile)
              }
              this.pathbread.splice(this.isSame + 1)
              this.parents.splice(this.isSame + 1)
            },
          )
        } else if (this.parents[0] == 'baid') {
          this.tableData = []
          this.getFile(newVal.query.path)
          this.pathbread.splice(this.isSame + 1)
          this.parents.splice(this.isSame + 1)
        } else if (this.parents[0] == 'smb') {
          this.tableData = []
          this.getFile(newVal.query.path).then((res) => {
            for (let item of res) {
              this.singleFile = {}
              this.singleFile.id = (Math.random() + 1) * 10
              this.singleFile.server_filename = item
              this.singleFile.size = ''
              this.singleFile.parentsPath = newVal.query.path
              this.singleFile.path = `${newVal.query.path}${item}`
              this.singleFile.isdir = path.extname(item) ? 0 : 1
              this.singleFile.local_mtime = ''
              this.singleFile.permission = ''
              this.singleFile.Owner = 'Ower'
              this.tableData.push(this.singleFile)
            }
            this.pathbread.splice(this.isSame + 1)
            this.parents.splice(this.isSame + 1)
          })
        }
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
  height: 60px;
  line-height: 60px;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  user-select: none;
}
.cos {
  color: rgba(78, 70, 70, 0.932);
  font-size: 20px;
}
.form {
  max-width: 400px;
  margin: auto;
}
.moveFile_btn {
  width: 102%;
}
.moveFile_btn_dad {
  padding: 0;
  width: 80px;
}
.border {
  border: 1px solid #ebeef5;
  padding: 0 !important;
  height: 331px;
  overflow-y: scroll;
}
.el-main {
  height: calc(100vh - 110px);
}
.breadbox {
  background: rgb(220, 230, 246);
}
.delete:hover {
  border: none;
  background: initial !important;
}
.delete {
  border: none;
  background: initial !important;
}
</style>
