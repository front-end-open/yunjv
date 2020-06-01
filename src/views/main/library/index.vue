<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'Library',
}
</script>

<style lang="less" scoped>
.el-row {
  margin: -20px -20px 0px -20px;
}
.toolbar {
  padding: 12px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.28s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
