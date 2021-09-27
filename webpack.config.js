const path = require('path')

const postCSSPlugins = [
  require('postcss-import'),
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
  plugins: []
}