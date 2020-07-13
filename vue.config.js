module.exports = {
  devServer: {
    proxy: {
      '/rest': {
        target: 'https://pan.baidu.com',
        ws: true,
        changeOrigin: true,
      },
      '/api/quota': {
        target: 'https://pan.baidu.com',
        ws: true,
        changeOrigin: true,
      },
      'seafile': {
        target: 'http://seafile.example.com',
        ws: true,
        changeOrigin: true,
      },
      '/rest/2.0/pcs/superfile2': {
        target: 'https://d.pcs.baidu.com',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  css: {
    loaderOptions: {
      less: {
        prependData: `@import "~@/style/variables.less";`,
      },
    },
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: 'YunJv',
        artifactName: '${productName}-Setup-${version}.${ext}',
        win: {
          signAndEditExecutable: false,
          target: ['nsis', 'portable'],
        },
        portable: {
          artifactName: '${productName}-Portable-${version}.${ext}',
        },
      },
    },
  },
}
