<template>
  <el-container class="main-container">
    <el-aside width="200px">
      <el-menu
        router
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
      >
        <el-menu-item index="/main/library">
          <i class="el-icon-folder"></i>
          <span slot="title">文件库</span>
        </el-menu-item>
        <el-menu-item index="/main/transmission">
          <i class="el-icon-sort"></i>
          <span slot="title">传输列表</span>
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
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
    }
  },
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100vh;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
