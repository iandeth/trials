const path = require("path");
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
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          { loader: "babel-loader", options: { cacheDirectory: true } },
          { loader: "ts-loader" },
          { loader: "eslint-loader", options: { cache: true } },
        ],
      },
      { test: /\.css$/i, use: ["style-loader/useable", "css-loader"] },
    ],
  },
  optimization: {
    moduleIds: "hashed",
  },
};
