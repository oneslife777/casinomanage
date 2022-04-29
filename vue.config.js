const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: isProd ? 'management' : '/',
  outputDir: 'docs',
  filenameHashing: false,
  productionSourceMap: false
}

module.exports = {
  transpileDependencies: [
    'vuetify'
  ]
}

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
};