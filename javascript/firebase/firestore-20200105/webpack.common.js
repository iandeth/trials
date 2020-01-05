const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'bundle': './src/js/bundle.js'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({ $:'jquery', jQuery:'jquery' }),

    new HtmlWebpackPlugin({ filename:'index.html', template:'src/index.html' })
  ],
  module: {
    rules: [
      {
        // https://eslint.org/docs/rules/
        enforce: "pre",
        test: /js\/.+\.js$/i,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: { configFile:"./.eslintrc.json" }
      },
      {
        test: /js\/.+\.js$/i,
        use: ['buble-loader']
      },
      {
        test: /\.css$/i,
        exclude: /common\/.+\.css$/i,
        use: [
          { loader:'style-loader', options:{ injectType:'lazyStyleTag' } },
          'css-loader'
        ]
      },
      {
        test: /common\/.+\.css$/i,
        use: [
          { loader:'file-loader', options:{ regExp:/src\/(.+)\/[^/]+\.[^/]+$/, name:'/[1]/[name].[ext]' } }
        ]
      }
    ],
  },
  optimization: {
    moduleIds: 'hashed'
  }
};
