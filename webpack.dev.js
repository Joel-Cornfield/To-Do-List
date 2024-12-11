const path = require('path');
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    static: path.join(__dirname, 'dist'),
    watchFiles: ["./src/index.html"],
    open: true,
    hot: true,
  },
});
