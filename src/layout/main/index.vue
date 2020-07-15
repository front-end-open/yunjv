<template>
  <el-container class="main-container">
    <vue-progress-bar></vue-progress-bar>
    <el-aside width="200px" class="aside">
      <div class="user">
        <el-avatar
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        ></el-avatar>
      </div>
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
<<<<<<< HEAD
  overflow: hidden;
=======
  overflow:hidden;
>>>>>>> feat(filelist.vue): 右击菜单
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
</style>
