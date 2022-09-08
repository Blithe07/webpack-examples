const path = require("path");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  mode: "development",
  devtool: false,
  entry: path.resolve(__dirname, "./src/main.js"),
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: `http://localhost:8081/dist/`,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      filename: `remoteEntry.js`,
      exposes: {
        "./utils": "./src/utils",
      },
      // 可被共享的依赖模块，要求两个应用使用 版本号完全相同 的依赖才能被复用
      // shared: ['lodash']
    }),
  ],
  devServer: {
    port: 8081,
    hot: true,
  },
};
