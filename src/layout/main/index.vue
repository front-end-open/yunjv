<template>
  <el-container class="main-container">
    <vue-progress-bar></vue-progress-bar>
    <el-aside width="200px" class="aside">
      <el-popover placement="top-start" width="200" trigger="click">
        <ul class="avater_menu">
          <li>个人中心</li>
          <li @click="loginout">注销</li>
        </ul>
        <div class="user" slot="reference">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          ></el-avatar>
        </div>
        <!-- <el-button slot="reference">hover 激活</el-button> -->
      </el-popover>

      <el-menu
        router
        :default-active="activeIndex"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
      >
        <el-menu-item index="/main/library">
          <i class="el-icon-folder"></i>
          <span slot="title">文件库</span>
        </el-menu-item>
        <el-menu-item class="transsion" index="/main/transmission">
          <i class="el-icon-sort"></i>
          <span slot="title">传输列表</span>
          <transition name="el-fade-in">
            <div v-if="this.$store.state.tag" class="brand">
              {{ this.$store.state.brandNum }}
            </div>
          </transition>
        </el-menu-item>
        <el-menu-item index="/main/backup">
          <i class="el-icon-receiving"></i>
          <span slot="title">备份</span>
        </el-menu-item>
        <el-menu-item index="/main/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <keep-alive>
        <router-view />
      </keep-alive>
    </el-main>
  </el-container>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      isCollapse: false,
      rootPaths: [
        '/main/library',
        '/main/transmission',
        '/main/backup',
        '/main/setting',
      ],
    }
  },
  methods: {
    loginout() {
      axios
        .get('http://121.40.30.117:5000/api/user/logout')
        .then((res) => {
          if (res.data.status) {
            this.$store.commit('loginstate', {
              islogin: false,
              user_id: null,
            })
          }
        })
        .catch((error) => {
          throw error
        })
    },
  },
  computed: {
    activeIndex() {
      const currentPath = this.$route.path
      for (const rootPath of this.rootPaths) {
        if (currentPath.substr(0, rootPath.length) === rootPath) {
          return rootPath
        }
      }
      return currentPath
    },
  },
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100vh;
}
.user {
  text-align: center;
  padding: @space 0;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: @main-aside-width;
}
.aside {
  user-select: none;
  overflow: hidden;
}
.transsion {
  position: relative;
}
.brand {
  position: absolute;
  top: 50%;
  right: 10%;
  width: 2em;
  height: 2em;
  border-radius: 50%;
  background: #409eff;
  text-align: center;
  line-height: 2em;
  margin-top: -1em;
  color: #fff;
}
.avater_menu {
  list-style: none;
  padding: 0;
  text-align: center;
}
.avater_menu li {
  height: 40px;
  line-height: 40px;
  margin: 0 -12px;
}
.avater_menu li:hover {
  background: #409eff;
  color: #fff;
}
</style>
