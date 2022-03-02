const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: false,
  outputDir: 'dist',
  configureWebpack: {
    devtool: 'source-map'
  },

  chainWebpack: (config) => {
    config.resolve.alias.set('~$', resolve('./')).set('@$', resolve('src'))
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [require('autoprefixer')()],
      },
    },
  },

  devServer: {
    proxy: {
      '/api': {
        target: "http://localhost:5000/",
      },
    },
  },

  assetsDir: 'static',
  runtimeCompiler: true,
}
