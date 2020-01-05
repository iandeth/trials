const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    'hello': './src/hello.js'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({ $:'jquery', jQuery:'jquery' })
  ],
  module: {
    rules: [
      {
        // https://eslint.org/docs/rules/
        enforce: "pre",
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: { configFile: "./.eslintrc.json" }
      },
      {
        test: /\.js$/i,
        use: ['buble-loader']
      },
      {
        test: /\.css$/i,
        use: [
          { loader: 'style-loader', options: { injectType: 'lazyStyleTag' } },
          'css-loader'
        ]
      }
    ],
  },
  optimization: {
    moduleIds: 'hashed'
  }
};
