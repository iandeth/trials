const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  resolve: {
    modules: [path.resolve(__dirname), "node_modules"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
  devtool: "source-map",
  devServer: {
    contentBase: "public",
    compress: true,
  },
};
