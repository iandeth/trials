const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const merge = require("webpack-merge");
const dev = require("./webpack.dev.js");

module.exports = merge.strategy({
  plugins: "replace",
})(dev, {
  entry: {
    bundle: "test/index.ts",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "test/index.html",
    }),
  ],
});
