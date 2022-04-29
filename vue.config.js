
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: isProd ? '/casinomanage'  : '/',
  outputDir: 'docs',
  filenameHashing: false,
  productionSourceMap: false
}

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
};