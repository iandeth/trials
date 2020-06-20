const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const fileLoaderOpt = {
  regExp: /src\/(.+)\/[^/]+\.[^/]+$/,
  name: "[1]/[name].[ext]",
};

module.exports = {
  entry: {
    bundle: "src/index.ts",
  },
  resolve: {
    modules: [path.resolve(__dirname), "node_modules"],
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/index.html",
    }),
  ],
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
      { test: /\.css$/i, use: ["style-loader", "css-loader"] },
      {
        test: /\.(png|jp(e)?g|gif|ico|svg)$/i,
        use: [{ loader: "file-loader", options: fileLoaderOpt }],
      },
    ],
  },
  optimization: {
    moduleIds: "hashed",
  },
};
