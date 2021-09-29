const path = require('path')

const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')

const postCSSPlugins = [
  require('postcss-import'),
  require('postcss-mixins'),
  require('postcss-simple-vars'),
  require('postcss-nested'),
  require('autoprefixer')
]

module.exports ={
  entry: './app/assets/scripts/App.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'app')
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader',{loader: 'css-loader', options: {url: false}}, {loader: 'postcss-loader', options: {postcssOptions: {plugins: postCSSPlugins}}}]
      },
      {
        test: /\.(woff|woff2|ttf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.svg$/i,
        use: [{loader: 'svg-sprite-loader'}]
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'app'),
      watch: false
    },
    watchFiles: './app/index.html',
    compress: true,
    port: 3000,
    hot: true,
    host: '0.0.0.0',
    open: 'http://localhost:3000'
  },
  plugins: [
    new SpriteLoaderPlugin()
  ]
}