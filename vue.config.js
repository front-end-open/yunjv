module.exports = {
  devServer: {
    proxy: {
      '/rest/2.0/xpan/file': {
        target: 'https://pan.baidu.com',
        ws: true,
        changeOrigin: true,
      },
      '/rest/2.0/xpan/file/multimedia': {
        target: 'https://pan.baidu.com',
        ws: true,
        changeOrigin: true,
      },
      '/rest/2.0/xpan/multimedia': {
        target: 'https://pan.baidu.com',
        ws: true,
        changeOrigin: true,
      },
      '/rest/2.0/xpan/nas': {
        target: 'https://pan.baidu.com',
        ws: true,
        changeOrigin: true,
      },
      '/api/quota': {
        target: 'https://pan.baidu.com',
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
