const currentTask = process.env.npm_lifecycle_event

const path = require('path')
const fse = require('fs-extra')

const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const postCSSPlugins = [
  require('postcss-import'),
  require('postcss-mixins'),
  require('postcss-simple-vars'),
  require('postcss-nested'),
  require('autoprefixer')
]

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap('Copy assets', function() {

      fse.copySync('./app/assets/images', './docs/assets/images', {filter: file => !file.endsWith('-o.png')})

      fse.copySync('./app/assets/styles/fonts', './docs/assets/styles/fonts')

      fse.copySync('./app/assets/data', './docs/assets/data')

      fse.copySync('./app/assets/ilustrations/newsletter__galaxy.svg', './docs/assets/ilustrations/newsletter__galaxy.svg',)
    })
  }
}

let cssRule = {
  test: /\.css$/i,
  use: [{loader: 'css-loader', options: {url: false}}, {loader: 'postcss-loader', options: {postcssOptions: {plugins: postCSSPlugins}}}]
}

let svgRule = {
  test: /\.svg$/i,
  use: [{loader: 'svg-sprite-loader'}]
}

let config = {
  entry: './app/assets/scripts/App.js',
  module: {
    rules: [
      cssRule,
      svgRule,
      {
        test: /\.(woff|woff2|ttf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.hbs$/i,
        use: [{loader: 'handlebars-loader', options: {rootRelative: './helpers/'}}]
      }
    ]
  },
  plugins: [
    new SpriteLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './app/index.html'
    })
  ]
}

if(currentTask == 'dev') {

  cssRule.use.unshift('style-loader')

  config.output = {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'app')
  }

  config.mode = 'development'

  config.devServer = {
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
  }

}

if(currentTask == 'build') {

  config.module.rules.push({
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
  })

  cssRule.use.unshift(MiniCssExtractPlugin.loader)

  config.plugins.push(
    new MiniCssExtractPlugin({filename: 'styles.[chunkhash].css'}),
    new RunAfterCompile()
  )

  config.output = {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'docs'),
    clean: true
  }

  config.mode = 'production'

  config.optimization = {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
      }
    },
    minimize: true,
    minimizer: [`...`, new CssMinimizerPlugin()]
  }
}

module.exports = config