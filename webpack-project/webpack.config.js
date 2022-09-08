const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpritesmithPlugin = require('webpack-spritesmith')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");

module.exports = {
    mode: process.env.NODE_ENV,
    // runtime抽离运行时代码，多入口时用于性能优化
    entry: {
        app: { import: "./src/index.ts", runtime: "runtime-app" },
        main: { import: "./src/main.ts", runtime: "runtime-main" },
    },
    output: {
        filename: '[name].js',
        path: path.resolve('./dist')
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        extensions: ['.ts', '.js', 'less', '.json', '.wasm'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            },
            {
                test: /\.less$/,
                use: [process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', {
                    loader: "postcss-loader", options: {
                        postcssOptions: {
                            plugins: [require("autoprefixer")]
                        }
                    }
                }, 'less-loader']
            },
            {
                test: /\.css$/,
                use: [process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
            },
            // {
            //     test: /\.(gif|png|jpe?g|svg)$/,
            //     type: "asset/resource",
            //     use: [
            //         {
            //             loader: "image-webpack-loader",
            //             options: {
            //                 mozjpeg: {
            //                     quality: 80
            //                 }
            //             }
            //         },
            //     ]
            // },
            // 生成响应式图片，css中可通过myImage.jpg?size=320引入具体分辨率，js中可通过require('myImage.jpg?placeholder=true&sizes[]=320,sizes[]=640,sizes[]=960')
            // {
            //     test: /\.(png|jpg)$/,
            //     type: "asset/resource",
            //     use: [
            //         {
            //           loader: "responsive-loader",
            //           options: {
            //             adapter: require('responsive-loader/sharp'),
            //             sizes: [320, 640, 960],
            //             placeholder: true,
            //             placeholderSize: 20
            //           },
            //         },
            //       ],
            // }

        ],
        // 跳过文件编译(一般都是第三方库，不能存在对其它文件的依赖，除非运行环境支持这种模块化方案。同时跳过内容分析，无法标记文件导出值，无法实现tree-shaking)
        // noParse: /lodash/
    },
    plugins: [
        // new BlockPlugin(),
        new ESLintPlugin({ extensions: ['.js', '.ts'] }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({ filename: "[name]-[contenthash].css" }),
        new SpritesmithPlugin({
            // 需要
            src: {
                cwd: path.resolve(__dirname, 'src/icons'),
                glob: '*.png'
            },
            target: {
                image: path.resolve(__dirname, 'src/assets/sprite.png'),
                css: path.resolve(__dirname, 'src/assets/sprite.less')
            }
        }),
        new HtmlWebpackPlugin({ template: './index.html', title: "webpack-project" }),
        // fork 出子进程，专门用于执行类型检查
        new ForkTsCheckerWebpackPlugin()
    ],
    devServer: {
        hot: true,
        open: true
    },
    cache: {
        type: "filesystem"
    },
    optimization: {
        // 默认terser作为js压缩器，production下默认开启
        minimize: false,
        // minimize为true才执行
        minimizer: [
            // Webpack5 之后，约定使用 `'...'` 字面量保留默认 `minimizer` 配置
            "...",
            // new TerserPlugin({
            //     terserOptions: {
            //         compress: {
            //             reduce_vars: true,
            //             pure_funcs: ["console.log"],
            //         },
            //         // ...
            //     },
            // }),
            new CssMinimizerPlugin(),
            new HtmlMinimizerPlugin({
                minimizerOptions: {
                    // 折叠 Boolean 型属性
                    collapseBooleanAttributes: true,
                    // 使用精简 `doctype` 定义
                    useShortDoctype: true,
                    // ...
                },
            }),
        ],
        splitChunks: {
            chunks: 'all',
            // cacheGroups: {
            //     vendors: {
            //       test: /[\\/]node_modules[\\/]/,
            //       chunks: 'initial',
            //       name: 'vendors',
            //     },
            //     'async-vendors': {
            //       test: /[\\/]node_modules[\\/]/,
            //       minChunks: 2,
            //       chunks: 'async',
            //       name: 'async-vendors'
            //     }
            //   }
        },
        //针对 node_modules 资源：
        //可以将 node_modules 模块打包成单独文件(通过 cacheGroups 实现)，防止业务代码的变更影响 NPM 包缓存，同时建议通过 maxSize 设定阈值，防止 vendor 包体过大；
        // 更激进的，如果生产环境已经部署 HTTP2/3 一类高性能网络协议，甚至可以考虑将每一个 NPM 包都打包成单独文件，具体实现可查看小册示例；
        // 针对业务代码：
        // 设置 common 分组，通过 minChunks 配置项将使用率较高的资源合并为 Common 资源；
        // 首屏用不上的代码，尽量以异步方式引入；
        // 设置 optimization.runtimeChunk 为 true，将运行时代码拆分为独立资源。

        // 抽离运行时代码，entry也可进行配置(entry优先级更高)
        runtimeChunk: { name: 'runtime-optimization' },
        // 启动tree-shaking，还需要启用mode=production或者optimization.minimize = true或者optimization.minimizer 数组
        usedExports: true
    },
    externals: {
        // 将部分模块排除在 Webpack 打包系统之外，此时lodash通过CDN方式引入
        lodash: "_",
    },
    // experiments: {
    //     // 编译期间跳过异步加载模块
    //     lazyCompilation: true
    // }
};