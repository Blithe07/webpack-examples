const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  mode: "development",
  devtool: false,
  entry: path.resolve(__dirname, "./src/main.js"),
  output: {
    path: path.resolve(__dirname, "./dist"),
  },
  plugins: [
    new ModuleFederationPlugin({
      remotes: {
        app1: "app1@http://localhost:8081/dist/remoteEntry.js", //cdn地址
      },
      // 可被共享的依赖模块，要求两个应用使用 版本号完全相同 的依赖才能被复用
      // shared: {
      //    lodash: {
      //      requiredVersion: "xxx"
      //    }
      // }
    }),
    new HtmlWebpackPlugin(),
  ],
  devServer: {
    port: 8082,
    hot: true,
    open: true,
  },
};
