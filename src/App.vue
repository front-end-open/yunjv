<template>
  <router-view></router-view>
</template>
<script>
export default {
  name: 'APP',
  created() {
    // vuex 全局数据刷新丢失
    // 页面刷新之前 localstorege 保存state数据， 页面加载完成 替换state数据，并清空 localsterge
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('stateInfo', JSON.stringify(this.$store.state))
    })
    if (localStorage.getItem('stateInfo')) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(localStorage.getItem('stateInfo')),
        ),
      )
    }

    localStorage.removeItem('stateInfo')
  },
}
</script>
