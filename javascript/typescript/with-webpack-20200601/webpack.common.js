var path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    bundle: "./src/index.js",
  },
  resolve: {
    modules: [path.resolve(__dirname), "node_modules"],
  },
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader/useable", "css-loader"],
      },
    ],
  },
  optimization: {
    moduleIds: "hashed",
  },
};
