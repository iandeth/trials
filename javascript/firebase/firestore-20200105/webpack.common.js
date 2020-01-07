const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const fileLoaderOpt = {
  regExp: /src\/(.+)\/[^/]+\.[^/]+$/,
  name: '[1]/[name].[ext]'
};

module.exports = {
  entry: {
    'bundle': './src/js/bundle.js'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ filename:'index.html', template:'src/index.html' }),
    new HtmlWebpackPlugin({ filename:'404.html', template:'src/404.html' })
  ],
  module: {
    rules: [
      {
        // https://eslint.org/docs/rules/
        enforce: "pre",
        test: /js\/.+\.js$/i,
        loader: 'eslint-loader',
        options: { configFile:"./.eslintrc.json" }
      },
      {
        test: /src\/js\/.+\.js$/i,
        use: ['buble-loader']
      },
      {
        test: /\.css$/i,
        exclude: /src\/common\/.+\.css$/,
        use: [
          { loader:'style-loader', options:{ injectType:'lazyStyleTag' } },
          'css-loader'
        ]
      },
      {
        test: /\.css$/i,
        include: /src\/common\/.+\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jp(e)?g|gif|ico)$/i,
        use: [
          { loader:'file-loader', options:fileLoaderOpt }
        ]
      }
    ],
  },
  optimization: {
    moduleIds: 'hashed'
  },
  output: {
    publicPath: '/'
  }
};
