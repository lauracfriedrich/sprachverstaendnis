module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.csv$/,
          loader: 'csv-loader',
          options: {
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true
          }
        }
      ]
    }
  },

  lintOnSave: false,

  pluginOptions: {
    lintStyleOnBuild: false,
    stylelint: {}
  },

  publicPath:
    process.env.NODE_ENV === 'production'
      ? '/sprachverstaendnis/'
      : '/',

  pwa: {
    name: 'Sprachverständnis',
    themeColor: '#ffffff',
    msTileColor: '#ffffff',
    appleMobileWebAppCapable: 'yes',

    workboxOptions: {
      navigateFallback: 'index.html',
      maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
    }
  }
};