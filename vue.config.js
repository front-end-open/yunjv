module.exports = {
  css: {
    loaderOptions: {
      less: {
        prependData: `@import "~@/style/variables.less";`,
      },
    },
  },
}
