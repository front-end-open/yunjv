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
                icon="el-icon-s-unfold"
                @click="setTable"
              ></el-button>
              <el-button
                size="mini"
                type="primary"
                @click="setGrid"
                icon="el-icon-s-grid"
              ></el-button>
            </el-button-group>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="control">
            <el-button size="mini" type="primary" @click="createDiretory"
              >新建文件夹</el-button
            >
            <!-- 上传 -->
            <el-button size="mini" type="primary" @click="upLoadFile"
              >上传<i class="el-icon-upload el-icon--right"></i
            ></el-button>

            <template v-if="show">
              <el-dropdown trigger="click" style="margin: 0 12px">
                <el-button size="mini" type="primary">
                  文件操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <!-- 复制 -->
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
                      <el-input
                        placeholder="当前路径"
                        v-model="selecPath"
                        :disabled="true"
                      >
                      </el-input>
                      <div class="border">
                        <el-tree
                          class="filter-tree"
                          :props="props"
                          :filter-nodeDate-method="filterNode"
                          highlight-current
                          lazy
                          @node-click="handleNodeClick"
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
                  <!-- 移动 -->
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
                      <el-input
                        placeholder="当前路径"
                        v-model="selecPath"
                        :disabled="true"
                      >
                      </el-input>
                      <div class="border">
                        <el-tree
                          class="filter-tree"
                          :props="props"
                          :filter-nodeDate-method="filterNode"
                          highlight-current
                          lazy
                          @node-click="handleNodeClick"
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
              <!-- 下载 -->
              <el-button size="mini" type="primary" @click="downLoadFile"
                >下载<i class="el-icon-download el-icon--right"></i
              ></el-button>
            </template>
          </div>
        </el-col>
        <el-col :span="6" :offset="3">
          <el-input
            placeholder="请输入"
            v-model="searchFile"
            @change="searchClick"
          >
            <i
              slot="prefix"
              class="el-input__icon el-icon-search cursor"
              @click="searchClick"
            ></i>
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
      <!-- 列表 -->
      <el-table
        v-if="this.layout == 'table'"
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        @select="selec"
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
        <!-- 重命名、删除 -->
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
      <!-- 网格 -->
      <div class="gridContainer" v-if="layout == 'grid'">
        <div v-for="(item, index) of tableData" :key="index">
          <v-icon :name="item.isdir ? 'folder-open' : 'file-word'" scale="2" />
          <a>{{ item.server_filename }}</a>
        </div>
      </div>
      <!-- 创建文件夹 -->
      <el-dialog
        title="新建"
        :visible.sync="centerDialogVisible"
        width="437px"
        class="createClass"
      >
        <div class="form">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
          >
            <el-form-item label="目录名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item class="createFlex">
              <el-button @click="resetForm('ruleForm')">重置</el-button>

              <el-button type="primary" @click="submitForm()"
                >立即创建</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <!-- 重命名模态框 -->
      <el-dialog
        title="重命名"
        :visible.sync="centerDialogVisible2"
        width="437px"
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
      showtag: false,
      // 目录移动数据
      selecPath: '',
      moveDialog: false, // 关闭dialog
      copeDialog: false, // 关闭dialog
      moveDatas: [],
      moveIndex: '', //选中行的索引
      //搜索文件
      searchFile: '',
      //文件操作、下载默认隐藏
      show: false,
      layout: 'table',
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
    } else {
      this.tableData = this.$store.state.indexFileDate
    }
  },
  methods: {
    //搜索文件
    searchClick() {
      var config = JSON.parse(localStorage.getItem('config'))[
        Number(this.servertypeIndex)
      ]
      const { token } = config
      switch (this.parents[0]) {
        case 'ftp':
          break
        case 'smb':
          break
        case 'baid':
          this.$http
            .get(`/rest/2.0/xpan/file?method=search&access_token=${token}`, {
              params: {
                dir: `/`,
                key: `${this.searchFile}`,
                recursion: '1',
                web: 1,
              },
            })
            .then((res) => {
              const { list } = res.data
              let id = 0
              let moveFile = {}
              let moveData = []
              for (let val of list) {
                //  由于返回数据没有标识，因此需要加上筛选拼接数据
                moveFile = {}
                if (val.isdir) {
                  moveFile.id = id
                  moveFile.fs_id = val.fs_id
                  moveFile.server_filename = val.server_filename
                  moveFile.isdir = val.isdir
                  moveFile.path = val.path
                  moveData.push(moveFile)
                  ++id
                }
              }
              this.tableData = moveData
              console.log(this.tableData)
            })
            .catch((error) => {
              console.log(error.toJSON())
            })
          break
      }
    },
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
          break
      }
      this.centerDialogVisible = false
    },
    // 重命名-开启模态框
    async editFileName(index, row) {
      this.rowDate = []
      this.centerDialogVisible2 = true // 打开模态框
      this.rowDate.push(row)
      this.formDate.name = row.server_filename
      this.formDate.id = index
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
        let path = `[{"path":"${this.rowDate[0].path}","newname":"${this.formDate.name}"}]`
        this.$http
          .post(
            `/rest/2.0/xpan/file?access_token=${token}&method=filemanager&opera=rename`,
            {
              async: 2,
              filelist: path,
            },
          )
          .then((res) => {
            console.log(res)
            if (this.path == '/') {
              this.$set(this.tableData, this.formDate.id, {
                'fs_id': this.tableData[this.formDate.id].fs_id,
                'id': this.tableData[this.formDate.id].id,
                'isdir': this.tableData[this.formDate.id].isdir,
                'local_ctime': this.tableData[this.formDate.id].local_ctime,
                'local_mtime': this.tableData[this.formDate.id].local_mtime,
                'server_filename': this.formDate.name,
                'size': this.tableData[this.formDate.id].size,
                'path': `${this.path}${this.formDate.name}`,
              })
            } else {
              this.$set(this.tableData, this.formDate.id, {
                'fs_id': this.tableData[this.formDate.id].fs_id,
                'id': this.tableData[this.formDate.id].id,
                'isdir': this.tableData[this.formDate.id].isdir,
                'local_ctime': this.tableData[this.formDate.id].local_ctime,
                'local_mtime': this.tableData[this.formDate.id].local_mtime,
                'server_filename': this.formDate.name,
                'size': this.tableData[this.formDate.id].size,
                'path': `${this.path}/${this.formDate.name}`,
              })
            }
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
        this.tableData.splice(index, 1)
        console.log(this.tableData)
        this.$http
          .post(
            `/rest/2.0/xpan/file?method=filemanager&access_token=${token}&opera=delete`,
            {
              'async': 1,
              'filelist': [row.path],
            },
          )
          .then((res) => {
            console.log(res)
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    //  ftp文件列表获取
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
              .get(
                `/rest/2.0/xpan/multimedia?&access_token=${token}&method=listall`,
                {
                  params: {
                    path: row.path,
                  },
                },
              )
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
          .get(
            `/rest/2.0/xpan/multimedia?&access_token=${token}&method=listall`,
            {
              params: {
                path,
              },
            },
          )
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
        ipcRenderer.send('async-openDialog', 'ok') //  发送消息
        ipcRenderer.on('async-get', (event, msg) => {
          console.log(msg[0], '0000')
          const server = new Server(
            'BaiDu',
            this.servertypeIndex,
            JSON.parse(localStorage.getItem('config')),
            msg[0],
            '',
            '',
          )
          server.singleUpload(msg[0])
        })
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
          console.log('baid')
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
    //  选中行，获取行数据
    selec(selection, row) {
      if (selection.length) {
        this.rowDate = row
        this.show = true
      } else {
        this.rowDate = []
        this.show = false
      }
      //获取选中行的索引
      const index = this.tableData
        .map((e) => e.server_filename)
        .indexOf(row.server_filename)
      this.moveIndex = index
    },
    // 文件移动/复制--搜索展示
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    //文件移动、复制--点击
    handleNodeClick(data) {
      this.selecPath = data.path
    },
    //  文件移动/复制--懒加载
    async lazyLoadTreeDir(node, resolve) {
      this.selecPath = '/'
      const config = JSON.parse(localStorage.getItem('config'))[
        Number(this.servertypeIndex)
      ]
      const { host, user, pwd, token } = config
      let moveFile = {},
        moveData = []
      const client = new ftp.Client()
      if (node.level === 0) {
        for (let item of this.$store.state.indexFileDate) {
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
            // let newPath = node.data.path
            // this.$set(this.selecPath, 0, { newPath })
            resolve(moveData)
          })
        } catch (error) {
          console.log(error)
          client.close()
        }
      } else if (this.parents[0] == 'baid') {
        this.$http
          .get(`/rest/2.0/xpan/file?&access_token=${token}&method=list`, {
            params: {
              dir: node.data.path,
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
        //提交移动
        if (select == 'move') {
          this.tableData.splice(this.moveIndex, 1)
          let movePath = `[{"path":"${this.rowDate.path}","dest":"${this.selecPath}"}]`
          this.$http
            .post(
              `/rest/2.0/xpan/file?method=filemanager&access_token=${token}&opera=move`,
              {
                filelist: movePath,
                async: 1,
              },
            )
            .then((res) => {
              console.log(res)
            })
        } else {
          //提交复制
          this.tableData.splice(0, 0)
          let copePath = `[{"path":"${this.rowDate.path}","dest":"${this.selecPath}","newname":"${this.rowDate.server_filename}"}]`
          this.$http
            .post(
              `/rest/2.0/xpan/file?method=filemanager&access_token=${token}&opera=copy`,
              {
                filelist: copePath,
                async: 2,
              },
            )
            .then((res) => {
              console.log(res)
            })
        }
        this.selecPath = '/'
      }
      this.moveDialog = false //关闭模态框
      this.copeDialog = false //关闭模态框
      this.show = false
    },

    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    //  选中行，获取行数据

    seleChange(selection) {
      if (selection.length) {
        this.downtag = false
      } else {
        this.downtag = true
      }
    },
    setTable() {
      this.layout = 'table'
    },
    setGrid() {
      this.layout = 'grid'
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
  margin-bottom: 10px;
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
.delete {
  border: none;
  background: initial !important;
}
.control {
  text-align: left;
  min-width: 385px;
}
.cursor {
  cursor: pointer;
}
.createFlex {
  display: flex;
  justify-content: flex-end;
  margin: 0;
}
.gridContainer {
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px);
  grid-template-rows: repeat(3, 100px);
  grid-row-gap: 20px;
  grid-column-gap: 20px;
}
.gridContainer div {
  overflow: auto;
  cursor: pointer;
}
</style>
