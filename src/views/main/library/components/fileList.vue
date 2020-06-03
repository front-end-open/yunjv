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
                    @click="moveDialogFormVisible = true"
                    >复制</el-button
                  >
                </el-dropdown-item>
                <el-dropdown-item class="moveFile_btn_dad">
                  <el-button
                    size="mini"
                    class="moveFile_btn"
                    type="text"
                    @click="copeDialogFormVisibles"
                    >移动</el-button
                  >

                  <el-dialog
                    title="复制到"
                    :visible.sync="copeDialogFormVisible"
                    append-to-body
                    class="fixedWH"
                    width="550px"
                  >
                    <div class="border">
                      <el-tree
                        :data="moveData"
                        :props="defaultProps"
                        lazy
                        :load="handclik"
                        :icon-class="icon"
                      >
                      </el-tree>
                    </div>

                    <div slot="footer" class="dialog-footer">
                      <el-button @click="copeDialogFormVisible = false"
                        >取 消</el-button
                      >
                      <el-button type="primary" @click="copeOk"
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
        :default-expand-all="false"
        @row-dblclick="switchDir"
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
          <el-button type="primary" @click="changeDirName">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
// import Vue from 'vue'
import Dateformate from '@/lib/DateFormate.js'
import SizeConvert from '@/lib/SizeConvert.js'
import Server from '@/lib/ServerFactory.js'
import OwnerConvert from '@/lib/PERMISSIONCONVERT.js'
const ipcRenderer = require('electron').ipcRenderer
const ftp = require('basic-ftp')
const SMB = require('@marsaud/smb2')
const { dialog } = require('electron').remote
const client = new ftp.Client()
export default {
  name: 'fileList',
  data() {
    return {
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
      //目录移动数据
      moveDialogFormVisible: false,
      copeDialogFormVisible: false,
      copeDate: {},
      copeFDate: {
        name: '',
      },
      moveData: [],
      children: [],
      moveDataEs: [],
      movePath: '',
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      icon: 'el-icon-folder',
    }
  },
  created() {
    //面包屑初始路径加载
    //服务索引
    this.servertypeIndex = this.$route.params.index
    //服务类型
    this.parents.push(this.$route.params.serverType)

    if (this.$route.params.serverType == 'ftp') {
      this.pathbread = [
        {
          name: `${this.$route.params.serverType}:`,
          path: `/main/Library/filelist/${this.$route.params.serverType}`,
          filePath: '/',
        },
      ]
      this.ftpclient().then((res) => {
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
          this.singleFile.permission = permissions
            ? OwnerConvert(permissions)
            : ''
          this.singleFile.Owner = user
          this.tableData.push(this.singleFile)
        }
      })
    } else if (this.$route.params.serverType == 'baid') {
      this.pathbread = [
        {
          name: `${this.$route.params.serverType}:`,
          path: `/main/Library/filelist/${this.$route.params.serverType}`,
          filePath: '/',
        },
      ]
      let id = 1
      const { token } = JSON.parse(localStorage.getItem('config'))[
        this.servertypeIndex
      ] //服务配置
      this.$http
        .get(`/rest/2.0/xpan/file?method=list&access_token=${token}`)
        .then((res) => {
          const { list } = res.data
          let fileDate = {}
          for (let val of list) {
            // 由于返回数据没有标识，因此需要加上筛选拼接数据
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
    } else if (this.$route.params.serverType == 'smb') {
      this.smbClient()
    }
  },
  methods: {
    //创建目录-开启模态
    createDiretory() {
      this.centerDialogVisible = true
    },
    //创建目录
    async submitForm() {
      switch (this.parents[0]) {
        case 'ftp':
          var createD = new Server( //实列话类
            'FTP',
            this.servertypeIndex,
            JSON.parse(localStorage.getItem('config')),
            '',
            this.path,
            '',
          )
          createD.createDir(this.ruleForm.name).then(
            //创建目录
            (res) => {
              ipcRenderer.send('async-openNotiton', 'notion') // 发送消息
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
            share: '\\\\172.17.6.8\\share',
            domain: 'WORKGROUP',
            username: 'smb',
            password: '175623',
          })
          smbclient.mkdir('newFle', (res) => {
            console.log(res)
          })
          break
        case 'baid':
          break
      }
    },
    //重命名-开启模态框
    async editFileName(index, row) {
      this.rowDate = []
      this.centerDialogVisible2 = true //打开模态框
      this.rowDate.push(index, row)
      this.formDate.name = row.server_filename
    },
    //重命名-目录更该
    async changeDirName() {
      // try {
      //   await client.access({
      //     host: '10.10.12.8',
      //     user: 'scitc',
      //     password: 'scitc',
      //     secure: false,
      //   })
      //   await client.rename(
      //     this.rowDate[1].path, //设置要更改的文件/文件夹路径
      //     `${this.rowDate[1].parentsPath}/${this.formDate.name}`, //设置更改后的路径---祖先路径+当前文件名
      //   )
      //   await client.list(this.rowDate[1].parentsPath).then((res) => {
      //     this.tableDatas = []
      //     for (let [index, item] of res.entries()) {
      //       const { name, size, isDirectory, modifiedAt } = item
      //       this.singleFile = {}
      //       this.singleFile.parent = res.server_filename //行目录名
      //       //子目录请求内容
      //       this.singleFile.id = index + Math.random()
      //       this.singleFile.server_filename = name
      //       this.singleFile.size = SizeConvert(size)
      //       this.singleFile.parentsPath = this.rowDate[1].parentsPath
      //       this.singleFile.path =
      //         this.rowDate[1].parentsPath == '/'
      //           ? `${this.rowDate[1].parentsPath}${name}`
      //           : `${this.rowDate[1].parentsPath}/${name}`
      //       this.singleFile.isdir = Number(isDirectory)
      //       this.singleFile.local_mtime = modifiedAt
      //       this.tableDatas.push(this.singleFile) //把行请求内容加入到表格数据
      //     }
      //   })
      //   this.tableData = this.tableDatas //将新的列表赋给原列表
      //   this.centerDialogVisible2 = false //关闭模态框
      // } catch (error) {
      //   console.log(error)
      //   client.close()
      // }
      // var createD = new Server( //实列话类
      //   'FTP',
      //   this.servertypeIndex,
      //   JSON.parse(localStorage.getItem('config')),
      //   '',
      //   this.path,
      //   '',
      // )
    },
    //文件下载
    downLoadFile() {
      // ftp-目录出创建
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
    //TODO: 文件删除
    deleteFile(index, row) {
      console.log(index, row)
    },
    //ftp文件列表获取
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
        return await client.list('')
      } catch (err) {
        console.log(err)
        client.close()
      }
    },
    //目录切换
    async switchDir(row) {
      console.log(row)
      //ftp
      const config = JSON.parse(localStorage.getItem('config'))[
        Number(this.servertypeIndex)
      ]
      const { host, user, pwd, token } = config
      switch (this.parents[0]) {
        case 'ftp':
          if (row.isdir == 1) {
            //处理目录
            // let currentDirflag = Math.ceil(Math.random() + 10)
            this.switchDirTag = 1
            this.tableData = [] //目录清空

            try {
              //异步错误捕获
              await client.access({
                host: host,
                user: user,
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
                  this.singleFile.parent = row.server_filename //行目录名
                  //子目录请求内容
                  this.singleFile.id = index
                  this.singleFile.server_filename = name
                  this.singleFile.size = SizeConvert(size)
                  this.singleFile.parentsPath = row.path + '/'
                  this.singleFile.path = `${row.path}/${name}` // 作为子目录，请求remote-path
                  this.singleFile.isdir = Number(isDirectory)
                  this.singleFile.local_mtime = date
                  this.singleFile.permission = permissions
                    ? OwnerConvert(permissions)
                    : ''
                  this.singleFile.Owner = user
                  this.tableData.push(this.singleFile) //把行请求内容加入到表格数据
                }
                this.path = row.path
                this.$router.push({
                  name: 'filelist',
                  params: {
                    serverType: `${row.server_filename}`,
                    currentdirpath: `${row.path}`,
                  },
                })
              })
            } catch (error) {
              this.$router.push({
                name: 'filelist',
                params: {
                  id: `${row.server_filename}`,
                  title: `${row.path}`,
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
            this.cliDirTag = 1
            this.tableData = []
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
                  // 由于返回数据没有标识，因此需要加上筛选拼接数据
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
                this.path = row.path
                this.$router.push({
                  name: 'filelist',
                  params: {
                    id: `${row.server_filename}`,
                    title: `${row.path}`,
                  },
                })
              })
              .catch((error) => {
                console.log(error.toJSON())
              })
          }
          break
      }
    },
    //smb服务文件列表获取
    async smbClient() {
      let smbData = [] //存放smb数据
      try {
        const smbclient = new SMB({
          share: '\\\\172.17.6.8\\share',
          domain: 'WORKGROUP',
          username: 'smb',
          password: '175623',
        })
        smbclient.readdir('', (err, files) => {
          if (err) throw err
          console.log(files)
          let smbFile = {}
          for (const file of files) {
            smbFile = {}
            smbFile.id = Math.random()
            smbFile.parentsPath = ''
            smbFile.path = `${smbFile.parentsPath}\\\\${file}`
            smbFile.server_filename = file
            smbData.push(smbFile)
          }
          this.tableData = smbData
          console.log(smbData)
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
      const { host, user, pwd, token } = config
      if (this.parents[0] == 'ftp') {
        if (path) {
          var source = null
          try {
            await client.access({
              host: host,
              user: user,
              password: pwd,
              secure: false,
            })
            source = await client.list(path)
            // return source
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
        //待完成
        let id = 1
        this.$http
          .get(`/rest/2.0/xpan/multimedia`, {
            params: {
              path: path,
              method: 'listall',
              access_token: token,
            },
          })
          .then((res) => {
            const { list } = res.data
            let fileDate = {}
            for (let val of list) {
              // 由于返回数据没有标识，因此需要加上筛选拼接数据
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
    //复制、移动__模态框
    async copeDialogFormVisibles() {
      this.copeDialogFormVisible = true //打开模态框
      try {
        this.moveDataEs = []
        await this.ftpclient().then((res) => {
          for (let [index, item] of res.entries()) {
            const { name: label, isDirectory } = item
            this.singleFile = {}
            //子目录请求内容
            if (isDirectory) {
              this.singleFile.isLeaf = true
              this.singleFile.id = index + Math.random(1)
              this.singleFile.label = label //行目录名
              this.singleFile.parentsPath = `/`
              this.singleFile.path = `/${label}`
              this.moveDataEs.push(this.singleFile) //把行请求内容加入到表格数
            }
          }
          this.moveData = this.moveDataEs
        })
      } catch (error) {
        console.log(error)
        client.close()
      }
    },
    //文件移动/复制__更新目录
    async handclik(node, resolve) {
      try {
        await client.access({
          host: '10.10.12.8',
          user: 'scitc',
          password: 'scitc',
          secure: false,
        })
        const moveDataEs = []
        await client.list(node.data.path).then((res) => {
          for (let [index, item] of res.entries()) {
            this.singleFile = {}
            const { name, isDirectory } = item
            if (isDirectory) {
              this.singleFile.id = index + Math.random()
              this.singleFile.label = name
              this.singleFile.isLeaf = true
              this.singleFile.parentsPath = node.data.path
              this.singleFile.path = `${node.data.path}/${name}`
              moveDataEs.push(this.singleFile)
            }
          }
          resolve(moveDataEs)
        })
        this.movePath = `${node.data.path}/`
      } catch (error) {
        console.log(error)
        client.close()
      }
    },
    //移动提交
    async copeOk() {
      try {
        await client.access({
          host: '10.10.12.8',
          user: 'scitc',
          password: 'scitc',
          secure: false,
        })
        await client
          .rename(
            this.rowDate.path,
            `${this.movePath}${this.rowDate.server_filename}`,
          )
          .then((res) => {
            console.log(res)
          })
        this.copeDialogFormVisible = false
      } catch (error) {
        console.log(error)
        client.close()
      }
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 选中行，获取行数据
    selec(selection, row) {
      this.rowDate = row
      // this.rowfileID = row.fs_id
      if (selection.length) {
        this.downtag = false
        // this.showtag = true
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
    //New.params.id 切换目录，当前目录
    //New.params.title 当前目录路径
    //面包屑功能-路由列表加载
    '$route': function(newVal) {
      const Path = {} //存入当前面包屑路径
      for (let val of this.parents) {
        //面包屑路由切换
        if (newVal.params.serverType === val) {
          this.switchDirTag = 0
        }
      }
      // cliDirTag 表示路由的前进后退
      if (this.switchDirTag === 1) {
        //目录切换，添加面包屑路径
        Path.name = newVal.params.serverType
        Path.filePath = newVal.params.currentdirpath
        Path.path = newVal.path
        this.parents.push(newVal.params.serverType)
        this.pathbread.push(Path)
      } else {
        //面包屑切换
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
</style>
