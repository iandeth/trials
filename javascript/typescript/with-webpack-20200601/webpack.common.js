var path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    bundle: "src/index.ts",
  },
  resolve: {
    modules: [path.resolve(__dirname), "node_modules"],
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      { test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ },
      { test: /\.css$/i, use: ["style-loader/useable", "css-loader"] },
    ],
  },
  optimization: {
    moduleIds: "hashed",
  },
};
