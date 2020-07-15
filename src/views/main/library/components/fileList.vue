<template>
  <el-container style="position: relative">
    <el-header>
      <el-row class="row-bg" :gutter="20">
        <el-col :span="10">
          <div class="flexBox">
            <el-button size="small" plain @click="createDiretory"
              >新建文件夹</el-button
            >
            <!-- 上传 -->
            <el-upload
              v-if="serverType == 'baid'"
              class="upload-bt"
              action="xxx"
              :on-change="btUp"
              :file-list="upload_list"
              multiple
              :limit="1"
              :auto-upload="false"
            >
              <el-button size="small" plain
                >上传<i class="el-icon-upload el-icon--right"></i
              ></el-button>
            </el-upload>
            <el-button
              v-if="serverType !== 'baid'"
              size="mini"
              plain
              @click="upLoadFile"
              >上传<i class="el-icon-upload el-icon--right"></i
            ></el-button>
            <!-- 下载 -->
            <el-button size="mini" plain @click="downLoadFile" :disabled="show"
              >下载<i class="el-icon-download el-icon--right"></i
            ></el-button>
          </div>
        </el-col>
        <!-- 搜索框 -->
        <el-col :span="6" :offset="3">
          <el-input
            placeholder="请输入"
            size="small"
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
        <!-- grid布局切换按钮组 -->
        <el-col :span="5">
          <div class="switch">
            <el-button-group>
              <el-button
                size="small"
                plain
                icon="el-icon-s-unfold"
                @click="setTable"
              ></el-button>
              <el-button
                size="small"
                plain
                @click="setGrid"
                icon="el-icon-s-grid"
              ></el-button>
            </el-button-group>
          </div>
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
              :to="{
                path: item.path,
                query: { path: item.filePath, repos_id: item.repos_id },
              }"
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
        class="tableStyle"
        row-key="id"
        @select="selec"
        :default-expand-all="false"
        @row-dblclick="switchDir"
        @row-contextmenu="rightMenuMethod"
        :highlight-current="true"
      >
        <el-table-column fixed="left" type="selection" width="50">
        </el-table-column>
        <el-table-column label="名字" sortable>
          <template slot-scope="scope">
            <div class="cellLater">
              <v-icon
                :class="scope.row.isdir == 1 ? 'dir dirFile' : 'file dirFile'"
                :name="scope.row.isdir ? 'folder' : 'file'"
                scale="2"
              />
              <el-tooltip
                :content="scope.row.server_filename"
                effect="light"
                placement="right-start"
                :offset="800"
                :open-delay="900"
              >
                <span class="listText">{{ scope.row.server_filename }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小"> </el-table-column>
        <el-table-column prop="local_mtime" label="已改变" sortable width="180">
        </el-table-column>
        <el-table-column prop="permission" label="权限" sortable width="180">
        </el-table-column>
        <el-table-column prop="Owner" label="所有者"> </el-table-column>
      </el-table>
      <!-- Grid网格布局 -->
      <div class="gridContainer" v-if="layout == 'grid'">
        <div
          v-for="(item, index) of tableData"
          :key="index"
          @click.capture="changeIn(item)"
        >
          <el-tooltip
            :content="item.server_filename"
            effect="light"
            placement="bottom"
            :open-delay="900"
          >
            <div>
              <v-icon
                :class="item.isdir ? 'dir' : 'file'"
                :name="item.isdir ? 'folder' : 'file'"
                scale="2"
              />
              <p class="iconText">{{ item.server_filename }}</p>
            </div>
          </el-tooltip>
        </div>
      </div>
      <!-- 创建文件夹模态框 -->
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
              <el-button plain @click="resetForm('ruleForm')">重置</el-button>
              <el-button plain type="primary" @click="submitForm()"
                >立即创建</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <!-- 重命名模态框 -->
      <el-dialog
        title="重命名提示"
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
          <el-button type="primary" plain @click="changeDirName"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 删除模态框 -->
      <el-dialog
        title="删除提示"
        :visible.sync="deleteDialogVisible"
        width="437px"
      >
        <i
          class="el-icon-warning"
          style="font-size: 1.5em;margin-right: 5px;color:rgb(64,158,255);vertical-align: middle;"
        ></i>
        <span style="margin:0 auto">确认删除？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            plain
            @click="deleteFile(rightMenuIndex, rightMenuRow)"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 右键菜单 -->
      <transition name="el-zoom-in-top">
        <div ref="rightMenu" v-show="rightMenushow" class="rightMenu">
          <ul>
            <el-button
              size="mini"
              type="text"
              class="renameBtnColor"
              @click="switchDir(rightMenuRow)"
              >打开</el-button
            >
          </ul>
          <ul>
            <el-button
              size="mini"
              type="text"
              class="renameBtnColor"
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
                <el-button type="primary" @click="moveOk('copy')" plain
                  >确 定</el-button
                >
              </div>
            </el-dialog>
            <el-button
              size="mini"
              type="text"
              class="renameBtnColor"
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
                <el-button type="primary" @click="moveOk('move')" plain
                  >确 定</el-button
                >
              </div>
            </el-dialog>
          </ul>
          <ul>
            <el-button
              size="mini"
              slot="reference"
              type="text"
              class="renameBtnColor"
              @click="deleteDialogVisible = true"
            >
              删除
            </el-button>
            <el-button
              size="mini"
              slot="reference"
              type="text"
              class="renameBtnColor"
              @click="downLoadFile"
            >
              下载
            </el-button>
            <el-button
              size="mini"
              type="text"
              class="renameBtnColor"
              @click="editFileName(rightMenuIndex, rightMenuRow)"
              >重命名
            </el-button>
          </ul>
        </div>
      </transition>
    </el-main>
  </el-container>
</template>
<script>
import Dateformate from '@/lib/DateFormate.js'
import SizeConvert from '@/lib/SizeConvert.js'
import Server from '@/lib/ServerFactory.js'
import OwnerConvert from '@/lib/PERMISSIONCONVERT.js'
import rename from '@/lib/renameDir_File.js'
import Distinct from '@/lib/arryDuplicateRemove.js'
import http from '@/server/index.js'
import axios from 'axios'
const SparkMD5 = require('spark-md5')
const { SeafileAPI } = require('seafile-js')
const ipcRenderer = require('electron').ipcRenderer
const path = require('path')
const ftp = require('basic-ftp')
const SMB = require('@marsaud/smb2')
const { dialog } = require('electron').remote
const client = new ftp.Client()

export default {
  name: 'fileList',
  data() {
    return {
      upload_list: [],
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
      allRepos_id: '',
      // 目录f数据
      selecPath: '',
      selecReposID: '9a69b781-7421-4e31-a65b-a5451f7d92b2',
      selecParent: '/',
      moveDatas: [],
      moveIndex: '', //选中行的索引
      //搜索文件
      searchFile: '',
      // 移动dialog
      moveDialog: false,
      // 复制dialog
      copeDialog: false,
      //文件操作、下载默认禁用
      show: true,
      layout: 'table',
      //删除dialog
      deleteDialogVisible: false,
      //右击事件
      rightMenushow: false,
      rightMenuIndex: '', //右击获取当前index
      rightMenuRow: [],
      serverType: '',
    }
  },

  created() {
    // 面包屑初始路径加载
    // 服务索引
    this.servertypeIndex = this.$route.params.index
    // 服务类型
    this.parents.push(this.$route.params.serverType)
    this.serverType = this.$route.params.serverType

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
      this.pathbread = [
        {
          name: `${this.$route.params.serverType}:`,
          path: `/main/Library/filelist/${this.$route.params.serverType}`,
          filePath: '',
        },
      ]
      this.tableData = this.$store.state.indexFileDate
    }
    this.$router.beforeEach((to, from, next) => {
      //  does the page we want to go to have a meta.progress object
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress
        // parse meta tags
        this.$Progress.parseMeta(meta)
      }
      //  start the progress bar
      this.$Progress.start()
      //  continue to next page
      next()
    })
    //  hook the progress bar to finish after we've finished moving router-view
    this.$router.afterEach(() => {
      //  finish the progress bar
      this.$Progress.finish()
    })
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
        ],
        { token, user, pwd, host } = config

      let seafileAPI = new SeafileAPI(),
        obj = { server: host, username: user, password: pwd }
      seafileAPI.init(obj)

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
          createD
            .createDir(this.ruleForm.name)
            .then(
              // 创建目录
              (res) => {
                //成功提示消息
                this.$notify({
                  title: '操作成功',
                  type: 'success',
                  duration: 1500,
                  showClose: false,
                })
                this.tableData = res
                this.centerDialogVisible = false
              },
              () => {
                this.centerDialogVisible = false
              },
            )
            .catch((err) => {
              console.log(err)
              // 错误提示消息
              this.$notify({
                title: '操作失败',
                type: 'error',
                duration: 1500,
                showClose: false,
              })
            })
          break
        case 'smb':
          var smbclient = new SMB({
            share: `\\\\${host}\\share`,
            domain: 'WORKGROUP',
            username: user,
            password: pwd,
            port: 445,
            autoCloseTimeout: 0,
          })
          this.path == '/'
            ? smbclient.mkdir(
                `${this.ruleForm.name}` + Math.random(),
                (err) => {
                  if (err) throw err
                  console.log('Directory created!')
                  let tableDatas = []
                  smbclient
                    .readdir('')
                    .then((res) => {
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
                      // 成功提示消息
                      this.$notify({
                        title: '操作成功',
                        type: 'success',
                        duration: 1500,
                        showClose: false,
                      })
                    })
                    .catch((err) => {
                      console.log(err)
                      // 错误提示消息
                      this.$notify({
                        title: '操作失败',
                        type: 'error',
                        duration: 1500,
                        showClose: false,
                      })
                    })
                },
              )
            : smbclient.mkdir(
                `${this.path}${this.ruleForm.name}` + Math.random(),
                (err) => {
                  if (err) throw err
                  console.log('Directory created!')

                  let tableDatas = []
                  smbclient
                    .readdir(this.path)
                    .then((res) => {
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
                      // 成功提示消息
                      this.$notify({
                        title: '操作成功',
                        type: 'success',
                        duration: 1500,
                        showClose: false,
                      })
                    })
                    .catch((err) => {
                      console.log(err)
                      // 错误提示消息
                      this.$notify({
                        title: '操作失败',
                        type: 'error',
                        duration: 1500,
                        showClose: false,
                      })
                    })
                },
              )
          this.centerDialogVisible = false
          break
        case 'baid':
          this.$http
            .post(`/rest/2.0/xpan/file?method=create&access_token=${token}`, {
              'path': `${this.path}/${this.ruleForm.name}`,
              'size': '0',
              'isdir': '1',
              'rtype': 1,
            })
            .then((res) => {
              const { data } = res
              let moveFile = {}
              //  由于返回数据没有标识，因此需要加上筛选拼接数据
              moveFile = {}
              moveFile.id = Math.random()
              moveFile.fs_id = data.fs_id
              moveFile.server_filename = this.ruleForm.name
              moveFile.isdir = data.isdir
              moveFile.path = data.path
              this.tableData.push(moveFile)
              // 成功提示消息
              this.$notify({
                title: '操作成功',
                type: 'success',
                duration: 1500,
                showClose: false,
              })
            })
            .catch((err) => {
              console.log(err)
              // 错误提示消息
              this.$notify({
                title: '操作失败',
                type: 'error',
                duration: 1500,
                showClose: false,
              })
            })
          break
        default:
          seafileAPI.login().then(async () => {
            if (this.path == '/') {
              let repoes = await seafileAPI.listRepos()
              let reposID = repoes.data.repos[0].repo_id
              await seafileAPI
                .createDir(
                  reposID, //repos_id
                  `${this.path}${this.ruleForm.name}`,
                )
                .then((res) => {
                  console.log(res)
                  // 成功提示消息
                  this.$notify({
                    title: '操作成功',
                    type: 'success',
                    duration: 1500,
                    showClose: false,
                  })
                })
                .catch((err) => {
                  console.log(err)
                  // 错误提示消息
                  this.$notify({
                    title: '操作失败',
                    type: 'error',
                    duration: 1500,
                    showClose: false,
                  })
                })

              let arr = []
              let axiosListDir = []
              let arrDir = []
              let tableD = {}
              let repos = await seafileAPI.listRepos()
              repos.data.repos.forEach((item) => {
                arr.push(item.repo_id)
              })
              Distinct(arr).forEach((item) => {
                axiosListDir.push(seafileAPI.listDir(item, ''))
              })

              await Promise.all(axiosListDir).then((res) => {
                res.forEach((item, index) => {
                  arr[index]
                  for (let val of item.data.dirent_list) {
                    val.repos_id = arr[index]
                    arrDir.push(val)
                  }
                })

                console.log(arrDir)
                this.tableData = []

                arrDir.forEach((item) => {
                  tableD = {}
                  tableD.id = Math.random() + 1
                  tableD.repos_id = '9a69b781-7421-4e31-a65b-a5451f7d92b2'
                  tableD.server_filename = item.name
                  tableD.parentsPath = item.parent_dir
                  tableD.path = `/${item.name}`
                  tableD.isdir = item.type == 'file' ? 0 : 1
                  tableD.local_mtime = item.mtime
                  tableD.permission = ''
                  this.tableData.push(tableD)
                })
                console.log(this.tableData)
              })
            } else {
              await seafileAPI
                .createDir(
                  this.rowDate.repos_id,
                  `${this.path}/${this.ruleForm.name}`,
                )
                .then((res) => {
                  console.log(res)
                  // 成功提示消息
                  this.$notify({
                    title: '操作成功',
                    type: 'success',
                    duration: 1500,
                    showClose: false,
                  })
                })
                .catch((err) => {
                  console.log(err)
                  // 错误提示消息
                  this.$notify({
                    title: '操作失败',
                    type: 'error',
                    duration: 1500,
                    showClose: false,
                  })
                })
              await seafileAPI
                .listDir(this.rowDate.repos_id, this.path)
                .then((res) => {
                  this.tableData = []
                  for (let item of res.data.dirent_list) {
                    const {
                      name,
                      size,
                      type,
                      permissions,
                      mtime,
                      parent_dir,
                    } = item
                    this.singleFile = {}
                    this.singleFile.id = Math.random()
                    this.singleFile.repos_id = this.rowDate.repos_id
                    this.singleFile.server_filename = name
                    this.singleFile.size = size
                    this.singleFile.parent = parent_dir
                    this.singleFile.parentsPath = this.path
                    this.singleFile.path = `${this.path}/${name}`
                    this.singleFile.isdir = type == 'file' ? 0 : 1
                    this.singleFile.local_mtime = mtime
                    this.singleFile.permission = permissions
                    this.tableData.push(this.singleFile)
                  }
                })
            }
          })
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
        ],
        { user, pwd, host } = config

      let seafileAPI = new SeafileAPI(),
        obj = { server: host, username: user, password: pwd }
      seafileAPI.init(obj)

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
          await client
            .rename(
              this.rowDate[0].path, // 设置要更改的文件/文件夹路径
              `${this.rowDate[0].parentsPath}/${this.formDate.name}`, // 设置更改后的路径---祖先路径+当前文件名
            )
            .then((res) => {
              console.log(res)
              //成功提示消息
              this.$notify({
                title: '操作成功',
                type: 'success',
                duration: 1500,
                showClose: false,
              })
            })
            .catch((err) => {
              console.log(err)
              //错误提示消息
              this.$notify({
                title: '操作失败',
                type: 'error',
                duration: 1500,
                showClose: false,
              })
            })
          if (this.path == '/') {
            this.$set(this.tableData, this.formDate.id, {
              'id': this.tableData[this.formDate.id].id,
              'isdir': this.tableData[this.formDate.id].isdir,
              'server_filename': this.formDate.name,
              'parentsPath': this.path,
              'local_mtime': this.tableData[this.formDate.id].local_mtime,
              'size': this.tableData[this.formDate.id].size,
              'path': `${this.path}${this.formDate.name}`,
            })
          } else {
            this.$set(this.tableData, this.formDate.id, {
              'id': this.tableData[this.formDate.id].id,
              'isdir': this.tableData[this.formDate.id].isdir,
              'server_filename': this.formDate.name,
              'parentsPath': this.path,
              'local_mtime': this.tableData[this.formDate.id].local_mtime,
              'size': this.tableData[this.formDate.id].size,
              'path': `${this.rowDate[0].parentsPath}/${this.formDate.name}`,
            })
          }
          this.centerDialogVisible2 = false
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
          smbclient
            .rename(
              this.rowDate[0].path.slice(0, -2),
              `${this.formDate.name}`,
              function(err) {
                if (err) throw err
                console.log('file has been renamed')
              },
            )
            .then((res) => {
              console.log(res)
              //成功提示消息
              this.$notify({
                title: '操作成功',
                type: 'success',
                duration: 1500,
                showClose: false,
              })
            })
            .catch((err) => {
              console.log(err)
              //错误提示消息
              this.$notify({
                title: '操作失败',
                type: 'error',
                duration: 1500,
                showClose: false,
              })
            })
        } else {
          //子目录下更名
          smbclient
            .rename(
              `${this.rowDate[0].parentsPath}${this.rowDate[0].server_filename}`,
              `${this.rowDate[0].parentsPath}${this.formDate.name}`,
              function(err) {
                if (err) throw err
                console.log('file has been renamed')
              },
            )
            .then((res) => {
              console.log(res)
              //成功提示消息
              this.$notify({
                title: '操作成功',
                type: 'success',
                duration: 1500,
                showClose: false,
              })
            })
            .catch((err) => {
              console.log(err)
              //错误提示消息
              this.$notify({
                title: '操作失败',
                type: 'error',
                duration: 1500,
                showClose: false,
              })
            })
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
            //成功消息提示
            this.$notify({
              title: '操作成功',
              type: 'success',
              duration: 1500,
              showClose: false,
            })
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
          .catch((err) => {
            console.log(err)
            //错误消息提示
            this.$notify({
              title: '操作失败',
              type: 'error',
              duration: 1500,
              showClose: false,
            })
          })
      } else {
        seafileAPI.login().then(() => {
          if (this.rowDate[0].isdir) {
            seafileAPI
              .renameDir(
                this.rowDate[0].repos_id,
                this.rowDate[0].path,
                this.formDate.name,
              )
              .then((res) => {
                console.log(res)
                rename(this)
                //成功消息提示
                this.$notify({
                  title: '操作成功',
                  type: 'success',
                  duration: 1500,
                  showClose: false,
                })
              })
              .catch((err) => {
                console.log(err)
                //错误消息提示
                this.$notify({
                  title: '操作失败',
                  type: 'error',
                  duration: 1500,
                  showClose: false,
                })
              })
          } else {
            seafileAPI
              .renameFile(
                this.rowDate[0].repos_id,
                this.rowDate[0].path,
                this.formDate.name,
              )
              .then((res) => {
                console.log(res)
                rename(this)
                //成功
                this.$notify({
                  title: '操作成功',
                  type: 'success',
                  duration: 1500,
                  showClose: false,
                })
              })
              .catch((err) => {
                console.log(err)
                //错误消息提示
                this.$notify({
                  title: '操作失败',
                  type: 'error',
                  duration: 1500,
                  showClose: false,
                })
              })
          }
        })
      }
      this.centerDialogVisible2 = false // 关闭模态框
    },
    // TODO: 文件删除
    async deleteFile(index, row) {
      this.deleteDialogVisible = false //关闭模态框
      console.log(index)
      console.log(row)
      const config = JSON.parse(localStorage.getItem('config'))[
        this.servertypeIndex
      ]
      const { host, user, pwd, token } = config

      let seafileAPI = new SeafileAPI(),
        obj = { server: host, username: user, password: pwd }
      seafileAPI.init(obj)
      // ftp__删除文件/夹路径
      if (this.parents[0] == 'ftp') {
        const ftpClient = new ftp.Client()

        try {
          await ftpClient.access({
            host,
            user,
            password: pwd,
            secure: false,
          })
          if (row.isdir == 1) {
            await ftpClient
              .removeDir(row.path)
              .then((res) => {
                this.tableData.splice(index, 1)
                console.log(res)
              })
              .then((res) => {
                console.log(res)
                //成功消息提示
                this.$notify({
                  title: '操作成功',
                  type: 'success',
                  duration: 1500,
                  showClose: false,
                })
              })
          } else {
            await ftpClient
              .remove(row.path)
              .then((res) => {
                this.tableData.splice(index, 1)
                console.log(res)
              })
              .then((res) => {
                console.log(res)
                //成功消息提示
                this.$notify({
                  title: '操作成功',
                  type: 'success',
                  duration: 1500,
                  showClose: false,
                })
              })
          }
        } catch (error) {
          console.log(error)
          //错误消息提示
          this.$notify({
            title: '操作失败',
            type: 'error',
            duration: 1500,
            showClose: false,
          })
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
            await smbclient
              .rmdir(`${row.server_filename}`, function(err) {
                if (err) throw err
                console.log('dirctory has been deleted')
              })
              .then((res) => {
                console.log(res)
                // 成功提示消息
                this.$notify({
                  title: '操作成功',
                  type: 'success',
                  duration: 1500,
                  showClose: false,
                })
              })
          } else {
            await smbclient
              .unlink(`${row.server_filename}`, function(err) {
                if (err) throw err
                console.log('file has been deleted')
              })
              .then((res) => {
                console.log(res)
                //成功提示消息
                this.$notify({
                  title: '操作成功',
                  type: 'success',
                  duration: 1500,
                  showClose: false,
                })
              })
          }
        } catch (error) {
          console.log(error)
          //错误提示消息
          this.$notify({
            title: '操作失败',
            type: 'error',
            duration: 1500,
            showClose: false,
          })
        }
      } else if (this.parents[0] == 'baid') {
        this.$http
          .post(
            `/rest/2.0/xpan/file?method=filemanager&access_token=${token}&opera=delete`,
            {
              'async': 1,
              'filelist': [row.path],
            },
          )
          .then((res) => {
            this.tableData.splice(index, 1)
            console.log(res)

            //成功提示消息
            this.$notify({
              title: '操作成功',
              type: 'success',
              duration: 1500,
              showClose: false,
            })
          })
          .catch((error) => {
            console.log(error)
            //错误提示消息
            this.$notify({
              title: '操作失败',
              type: 'error',
              duration: 1500,
              showClose: false,
            })
          })
      } else {
        seafileAPI.login().then(() => {
          if (row.isdir == 1) {
            seafileAPI.deleteDir(row.repos_id, row.path).then((res) => {
              console.log(res)
              this.tableData.splice(index, 1)
              //成功提示消息
              this.$notify({
                title: '操作成功',
                type: 'success',
                duration: 1500,
                showClose: false,
              })
            })
          } else {
            seafileAPI.deleteFile(row.repos_id, row.path).then((res) => {
              console.log(res)
              this.tableData.splice(index, 1)
              //错误提示消息
              this.$notify({
                title: '操作失败',
                type: 'error',
                duration: 1500,
                showClose: false,
              })
            })
          }
        })
      }
    },
    //  ftp文件列表获取
    async ftpclient() {
      const config = JSON.parse(localStorage.getItem('config'))[
        Number(this.servertypeIndex)
      ]
      console.log('ftpclonet')
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
      console.log(row, 'row')
      this.rowDate = row
      const config = JSON.parse(localStorage.getItem('config'))[
          Number(this.servertypeIndex)
        ],
        { host, user, pwd, token } = config
      let seafileAPI = new SeafileAPI(),
        obj = { server: host, username: user, password: pwd }
      seafileAPI.init(obj)
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
        default:
          if (row.isdir) {
            this.path = row.path
            this.$router.push({
              name: 'filelist',
              params: {
                serverType: `${row.server_filename}`,
                currentdirpath: `${row.path}`,
                repos_id: `${row.repos_id}`,
              },
            })
            seafileAPI
              .login()
              .then(() => {
                seafileAPI.listDir(row.repos_id, row.path).then((res) => {
                  this.tableData = []
                  for (let item of res.data.dirent_list) {
                    if (item.type == 'file') {
                      const {
                        name,
                        size,
                        type,
                        permissions,
                        mtime,
                        parent_dir,
                      } = item
                      console.log(item)
                      this.singleFile = {}
                      this.singleFile.id = Math.random()
                      this.singleFile.server_filename = name
                      this.singleFile.size = size
                      this.singleFile.parent = parent_dir
                      this.singleFile.parentsPath = row.path
                      this.singleFile.path = `${row.path}/${name}`
                      this.singleFile.isdir = type == 'file' ? 0 : 1
                      this.singleFile.local_mtime = mtime
                      this.singleFile.permission = permissions
                      this.singleFile.repos_id = row.repos_id
                    } else {
                      const {
                        name,
                        type,
                        permissions,
                        mtime,
                        parent_dir,
                      } = item
                      this.singleFile = {}
                      this.singleFile.id = Math.random()
                      this.singleFile.server_filename = name
                      this.singleFile.parent = parent_dir
                      this.singleFile.size = ''
                      this.singleFile.parentsPath = row.path
                      this.singleFile.path = `${row.path}/${name}`
                      this.singleFile.isdir = type == 'dir' ? 1 : 0
                      this.singleFile.local_mtime = mtime
                      this.singleFile.permission = permissions
                      this.singleFile.repos_id = row.repos_id
                    }
                    this.tableData.push(this.singleFile)
                  }
                })
              })
              .catch((err) => {
                throw Error(err)
              })
          }
      }
    },
    //面包屑切换文件列表加载
    async getFile(path, parent = '', repoID = '') {
      // ftp
      const config = JSON.parse(localStorage.getItem('config'))[
          Number(this.servertypeIndex)
        ],
        { host, user, pwd, token } = config,
        seafileAPI = new SeafileAPI(),
        obj = { server: host, username: user, password: pwd }
      seafileAPI.init(obj)
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
      } else {
        await seafileAPI.login()
        return await seafileAPI.listDir(repoID, path)
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
    btUp(files) {
      let This = this
      console.log(This, 'ddddds23')
      this.upload_list = []
      let file = files.raw
      let block_list = []
      let fileSize = file.size // 文件大小
      let chunkSize = 4 * 1024 * 1024 // 切片的大小
      let chunks = Math.ceil(fileSize / chunkSize) // 获取切片的个数
      let blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice
      let spark = new SparkMD5.ArrayBuffer()
      let spark1 = new SparkMD5.ArrayBuffer()
      let reader = new FileReader()
      let currentChunk = 0
      let preparams = null
      let chunksarr = []
      // 文件hash, 分块hash
      reader.onload = async function(e) {
        console.log(This, this, 'ddddddd')
        const result = e.target.result
        spark.append(result)
        spark1.append(result)
        const fileChunkMd5 = spark1.end()
        block_list.push(`${fileChunkMd5}`)
        currentChunk++
        if (currentChunk < chunks) {
          loadNext()
        } else {
          spark.end()
          console.log(block_list)
          //预上传
          await http
            .post(
              `/rest/2.0/xpan/file?method=precreate&access_token=123.17ab2fea084763a72ce05e1a7ec74b3c.YsWy6lXitNM7caGvCWxAm1b6Hzf4LY_3feRIAK5.hQgeXQ`,
              {
                path: '/apps/BTBD',
                size: this.size,
                isdir: '0',
                autoinit: 1,
                rtype: 1,
                block_list: JSON.stringify(block_list),
              },
            )
            .then((res) => {
              preparams = res.data
            })
            .catch((err) => {
              throw new Error(err)
            })

          // 分片上传
          for (let i = 0; i < chunks; i++) {
            const start = i * chunkSize
            const end = Math.min(file.size, start + chunkSize)
            const params = new FormData()
            params.append('file', blobSlice.call(file, start, end))
            chunksarr.push(
              axios.post(
                `https://d.pcs.baidu.com/rest/2.0/pcs/superfile2?method=upload&access_token=123.17ab2fea084763a72ce05e1a7ec74b3c.YsWy6lXitNM7caGvCWxAm1b6Hzf4LY_3feRIAK5.hQgeXQ&type=tmpfile&path=/apps/BTBD&uploadid=${preparams.uploadid}&partseq=${preparams.block_list[i]}`,
                params,
                {
                  headers: { 'Content-Type': 'multipart/form-data' },
                },
              ),
            )
          }
          await Promise.all(chunksarr)
            .then((res) => {
              console.log(res)
            })
            .catch((error) => {
              throw new Error(error)
            })
          // 创建文件
          await http
            .post(
              ` https://pan.baidu.com/rest/2.0/xpan/file?method=create&access_token=123.17ab2fea084763a72ce05e1a7ec74b3c.YsWy6lXitNM7caGvCWxAm1b6Hzf4LY_3feRIAK5.hQgeXQ`,
              {
                path: `/apps/BTBD/${file.name}`,
                size: fileSize,
                isdir: 0,
                uploadid: preparams.uploadid,
                block_list: JSON.stringify(block_list),
              },
            )
            .then((res) => {
              console.log(res, '文件上传成功')
            })
            .catch((error) => {
              throw new Error(error)
            })
        }
      }
      reader.onerror = function() {
        console.log('读取文件失败')
      }
      function loadNext() {
        var start = currentChunk * chunkSize
        var end = start + chunkSize > file.size ? file.size : start + chunkSize
        reader.readAsArrayBuffer(blobSlice.call(file, start, end))
      }
      loadNext()
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
          if (this.rowDate.isdir == 0) {
            this.$store.commit('downloadTasks', { file: this.rowDate })
            this.$store.dispatch('startDownload')
          }
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
    // 移动、复制模态框
    openDialog_move(select) {
      select == 'move' ? (this.moveDialog = true) : (this.copeDialog = true) // 打开模态框
      this.selecPath = '/'
    },
    //  选中行，获取行数据
    selec(selection, row) {
      if (selection.length) {
        this.rowDate = row
        console.log(this.rowDate)
        this.show = false
      } else {
        this.rowDate = []
        this.show = true
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
      this.selecReposID = data.repos_id
      this.selecParent = data.path
    },
    //  文件移动/复制--懒加载
    async lazyLoadTreeDir(node, resolve) {
      this.selecPath = '/'
      const config = JSON.parse(localStorage.getItem('config'))[
        Number(this.servertypeIndex)
      ]
      const { host, user, pwd, token } = config

      let seafileAPI = new SeafileAPI(),
        obj = { server: host, username: user, password: pwd }
      seafileAPI.init(obj)

      let moveFile = {},
        moveData = []
      const client = new ftp.Client()
      if (node.level === 0) {
        for (let item of this.$store.state.indexFileDate) {
          const { server_filename, isdir, repos_id, parentsPath } = item
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
            } else {
              moveFile.path = `/${server_filename}`
              moveFile.repos_id = repos_id
              moveFile.isdir = isdir
              moveFile.parentsPath = parentsPath
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
      } else {
        console.log(node.data)

        seafileAPI.login().then(() => {
          seafileAPI
            .listDir(node.data.repos_id, node.data.path) //全部repos_id
            .then((res) => {
              for (let item of res.data.dirent_list) {
                const { name, type } = item
                moveFile = {}
                if (type == 'dir') {
                  moveFile.id = Math.random()
                  moveFile.repos_id = node.data.repos_id
                  moveFile.name = name
                  moveFile.path = `${node.data.path}/${name}`
                  moveFile.isdir = type == 'file' ? 0 : 1
                  moveFile.parentsPath = node.data.path
                  moveData.push(moveFile)
                  console.log(moveFile)
                }
              }
              resolve(moveData)
            })
        })
      }
    },
    // 移动/复制 提交
    async moveOk(select) {
      this.selecPath = '/'
      const config = JSON.parse(localStorage.getItem('config'))[
        Number(this.servertypeIndex)
      ]
      const { host, user, pwd, token } = config

      let seafileAPI = new SeafileAPI(),
        obj = { server: host, username: user, password: pwd }
      seafileAPI.init(obj)

      if (this.parents[0] == 'ftp') {
        try {
          await client.access({
            host,
            user,
            password: pwd,
            secure: false,
          })
          if (select == 'move') {
            await client
              .rename(
                this.rowDate.path,
                `${this.selecPath}/${this.rowDate.server_filename}`,
              )
              .then((res) => {
                console.log(res)
                this.tableData.splice(this.moveIndex, 1)
                //成功提示消息
                this.$notify({
                  title: '操作成功',
                  type: 'success',
                  duration: 1500,
                  showClose: false,
                })
              })
              .catch((err) => {
                console.log(err)
                //错误提示消息
                this.$notify({
                  title: '操作失败',
                  type: 'error',
                  duration: 1500,
                  showClose: false,
                })
              })
          } else if (select == 'copy') {
            console.log('复制功能')
            //提示消息
            this.$notify({
              title: '此功能尚在完善',
              type: 'info',
              duration: 1500,
              showClose: false,
            })
          }
          this.copeDialog = false
          this.moveDialog = false
        } catch (error) {
          console.log(error)
          client.close()
          //错误提示消息
          this.$notify({
            title: '操作失败',
            type: 'error',
            duration: 1500,
            showClose: false,
          })
        }
      } else if (this.parents[0] == 'smb') {
        console.log('smb文件移动')
        //提示消息
        this.$notify({
          title: '此功能尚在完善',
          type: 'info',
          duration: 1500,
          showClose: false,
        })
      } else if (this.parents[0] == 'baid') {
        //提交移动
        if (select == 'move') {
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
              this.tableData.splice(this.moveIndex, 1)
              //成功提示消息
              this.$notify({
                title: '操作成功',
                type: 'success',
                duration: 1500,
                showClose: false,
              })
            })
            .catch((err) => {
              console.log(err)
              //错误提示消息
              this.$notify({
                title: '操作失败',
                type: 'error',
                duration: 1500,
                showClose: false,
              })
            })
        } else {
          //提交复制
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
              this.tableData.splice(0, 0)
              //成功提示消息
              this.$notify({
                title: '操作成功',
                type: 'success',
                duration: 1500,
                showClose: false,
              })
            })
            .catch((err) => {
              console.log(err)
              //错误提示消息
              this.$notify({
                title: '操作失败',
                type: 'error',
                duration: 1500,
                showClose: false,
              })
            })
        }
      } else {
        if (select == 'move') {
          let repoID = this.rowDate.repos_id
          let dstrepoID = this.selecReposID
          let dstfilePath = this.selecParent
          let dirPath = this.rowDate.parentsPath
          let direntNames = this.rowDate.server_filename

          seafileAPI.login().then(() => {
            seafileAPI
              .moveDir(repoID, dstrepoID, dstfilePath, dirPath, direntNames)
              .then((res) => {
                console.log(res)
                this.tableData.splice(this.moveIndex, 1)
                this.selecParent = '/'
                //成功提示消息
                this.$notify({
                  title: '操作成功',
                  type: 'success',
                  duration: 1500,
                  showClose: false,
                })
              })
              .catch((err) => {
                console.log(err)
                //错误提示消息
                this.$notify({
                  title: '操作失败',
                  type: 'error',
                  duration: 1500,
                  showClose: false,
                })
              })
          })
        } else {
          let repoID = this.rowDate.repos_id
          let dstrepoID = this.selecReposID
          let dstfilePath = this.selecParent
          let dirPath = this.rowDate.parentsPath
          let direntNames = this.rowDate.server_filename

          console.log(repoID)
          console.log(dstrepoID)
          console.log(dstfilePath)
          console.log(dirPath)
          console.log(direntNames)

          seafileAPI.login().then(() => {
            seafileAPI
              .copyDir(repoID, dstrepoID, dstfilePath, dirPath, direntNames)
              .then((res) => {
                console.log(res)
                this.tableData.splice(0, 0)
                this.selecParent = '/'
                //成功提示消息
                this.$notify({
                  title: '操作成功',
                  type: 'success',
                  duration: 1500,
                  showClose: false,
                })
              })
              .catch((err) => {
                console.log(err)
                //错误提示消息
                this.$notify({
                  title: '操作失败',
                  type: 'error',
                  duration: 1500,
                  showClose: false,
                })
              })
          })
        }
      }
      this.moveDialog = false //关闭模态框
      this.copeDialog = false //关闭模态框
      this.show = true
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
    changeIn(row) {
      console.log('ok', row)
      this.switchDir(row)
    },
    foo() {
      // 取消鼠标监听事件 菜单栏
      this.rightMenushow = false
      document.removeEventListener('click', this.foo)
    },
    //表格单元行右击事件
    rightMenuMethod(row, column, event) {
      this.rightMenushow = false

      this.rightMenushow = true

      this.$refs.rightMenu.style.left = event.clientX - 196 + 'px'
      document.addEventListener('click', this.foo)
      this.$refs.rightMenu.style.top = event.clientY + 5 + 'px'
      //获取选中行的索引
      const index = this.tableData
        .map((e) => e.server_filename)
        .indexOf(row.server_filename)
      this.rightMenuIndex = index
      this.rightMenuRow = row
      //获取选中行数据
      this.rowDate = row
      console.log(this.rowDate)
      this.moveIndex = index
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
        Path.repos_id = newVal.params.repos_id
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
        } else {
          if (newVal.query.path) {
            this.tableData = []
            this.getFile(newVal.query.path, '', newVal.query.repos_id).then(
              (res) => {
                console.log(res)
                for (let item of res.data.dirent_list) {
                  if (item.type == 'file') {
                    const {
                      name,
                      size,
                      mtime,
                      parent_dir,
                      permissions,
                      type,
                    } = item
                    this.singleFile = {}
                    this.singleFile.id = (Math.random() + 1) * 10
                    this.singleFile.server_filename = name
                    this.singleFile.size = size
                    this.singleFile.parentsPath = parent_dir
                    this.singleFile.path = `${newVal.query.path}${name}`
                    this.singleFile.isdir = type == 'file' ? 0 : 1
                    this.singleFile.local_mtime = mtime
                    this.singleFile.permission = permissions
                    this.singleFile.repos_id = newVal.query.repos_id
                  } else {
                    const { name, type, permissions, mtime, parent_dir } = item
                    this.singleFile = {}
                    this.singleFile.id = Math.random()
                    this.singleFile.server_filename = name
                    this.singleFile.parent = parent_dir
                    this.singleFile.size = ''
                    this.singleFile.parentsPath = parent_dir
                    this.singleFile.path = `${parent_dir}/${name}`
                    this.singleFile.isdir = type == 'dir' ? 1 : 0
                    this.singleFile.local_mtime = mtime
                    this.singleFile.permission = permissions
                    this.singleFile.repos_id = newVal.query.repos_id
                  }
                  this.pathbread.splice(this.isSame + 1)
                  this.parents.splice(this.isSame + 1)
                  this.tableData.push(this.singleFile)
                }
              },
            )
          } else {
            this.tableData = this.$store.state.indexFileDate
            this.pathbread.splice(this.isSame + 1)
            this.parents.splice(this.isSame + 1)
          }
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
  background-color: #fff;
}

.breadbox {
  background: rgb(220, 230, 246);
}

.delete {
  border: none;
  background: initial !important;
}
.flexBox {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  <<<<<<<headwidth: 380px;
  =======width: 375px;
  >>>>>>>style(filelist): seafile repos;
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
  justify-items: center;
  align-items: center;
}

.gridContainer div {
  overflow: auto;
  cursor: pointer;
}
// 重命名按钮样式
.renameBtnColor {
  color: #606266;
  padding: 7px 5px;
  margin: 0 !important;
}
// 文件夹颜色
.dir {
  color: rgb(255, 216, 104);
}
// 文件颜色
.file {
  color: rgb(94, 199, 251);
}
// 文件与目录样式
.dirFile {
  vertical-align: middle;
  width: 18px;
}
// 文件名称
.iconText {
  width: 85px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
//列表文本
.listText {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: auto 0;
  margin-left: 10px;
}
.cellLater {
  display: flex;
}
// 重命名按钮样式
.renameBtnColor {
  color: #606266;
  padding: 7px 5px;
  margin: 0 !important;
}
// 文件夹颜色
.dir {
  color: rgb(255, 216, 104);
}
// 文件颜色
.file {
  color: rgb(94, 199, 251);
}
// 文件与目录样式
.dirFile {
  vertical-align: middle;
  width: 18px;
}
// 文件名称
.iconText {
  width: 85px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
//列表文本
.listText {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: auto 0;
  margin-left: 10px;
}
.cellLater {
  display: flex;
}
//表格样式
.tableStyle {
  width: 100%;
  margin-bottom: 20px;
}
//右击菜单
.rightMenu {
  width: 200px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  background: #fff;
  padding: 3px 0;
  box-shadow: 0.5px 0.5px 0.5px 1px rgb(219, 219, 219);
}
.rightMenu > ul {
  border-bottom: 1px solid rgb(230, 231, 236);
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  border-radius: 3px;
}
.rightMenu > ul:last-child {
  border-bottom: none;
}
.rightMenu > ul,
.rightMenu > ul > button {
  list-style: none;
  cursor: default;
}
.rightMenu > ul > button {
  text-align: left;
  padding-left: 25px;
}
.rightMenu > ul > button {
  border: 1px solid transparent;
}
.rightMenu > ul > button:hover {
  border: 1px solid rgb(213, 234, 255);
  background: rgb(236, 245, 255);
}
.rightMenu > ul {
  border-bottom: 1px solid rgb(230, 231, 236);
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  border-radius: 3px;
}
.rightMenu > ul:last-child {
  border-bottom: none;
}
.rightMenu > ul,
.rightMenu > ul > button {
  list-style: none;
  cursor: default;
}
.rightMenu > ul > button {
  text-align: left;
  padding-left: 25px;
}
</style>
