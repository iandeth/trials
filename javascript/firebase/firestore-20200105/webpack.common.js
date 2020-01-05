var path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    'hello': './src/hello.js'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  plugins: [
    new CleanWebpackPlugin()
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
        use: ['style-loader', 'css-loader']
      }
    ],
  },
  optimization: {
    moduleIds: 'hashed'
  }
};
