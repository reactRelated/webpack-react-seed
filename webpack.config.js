var path = require('path');
var webpack= require('webpack');
var pkg=require("./package.json");
var util = require('util');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); //提取文本
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成 html 模板 

//引入路径
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.js');
var pathToReactDom = path.resolve(node_modules, 'react-dom/dist/react-dom.js');

var jsBundle = path.join('_js', util.format('[name].%s.js', pkg.version));
var cssBundle = path.join('_css', util.format('[name].%s.css', pkg.version));

// var jsBundle = util.format('[name].%s.js', pkg.version);
// var cssBundle = util.format('[name].%s.css', pkg.version);

console.log("**********************")
console.log(jsBundle)
console.log(cssBundle)
console.log(path.join(__dirname, './app'))

console.log("**********************")


config = {
    devServer: {
        inline: true,
        port: 7777
    },
    context: path.join(__dirname, './app'),
    // devtool : "source-map",
    // entry: ['webpack/hot/only-dev-server', './app/main.jsx'],
    entry: {
        "home/index":['./home/main.jsx','webpack/hot/only-dev-server'],
        "home/order":['./home/order.jsx'],
        "product/index":['./product/main.jsx']
    },
    resolve: {
        alias: {
         'react': pathToReact,
            'react-dom':pathToReactDom
        }
    },
    output: {
        path: path.join(__dirname, './dist'),
       filename: jsBundle
    },
    module: {
        loaders: [{ test: /\.jsx?$/,
                    exclude: /node_modules/, //排除文件夹
                    loader: 'babel',
                    query:{
                        presets:['es2015','react']
                    } 
                },
                {
                    test:/\.scss$/,
                    // loaders: ['style', 'css', 'sass']
                    loader: ExtractTextPlugin.extract("style", "css","sass")
                }],
                noParse: [pathToReact]
        },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin(cssBundle, {
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common', // 将公共模块提取，生成名为`vendors`的chunk
            chunks: ['home/index','home/order','product/index'], //提取哪些模块共有的部分
            minChunks: 3 // 提取至少3个模块共有的部分
        }),
        new HtmlWebpackPlugin({
            template:  path.resolve(__dirname, './app/home/index.html'),
            filename:"./home/index.html",
            hash: true,
            title: 'home',
            ni:"你好 home",
            chunks: ["common","home/index"]
        }),
        new HtmlWebpackPlugin({
            template:  path.resolve(__dirname, './app/home/order.html'),
            filename:"./home/order.html",
            hash: true,
            title: 'order',
            ni:"你好 order",
            chunks: ["common","home/order"]
        }),
        new HtmlWebpackPlugin({
            template:  path.resolve(__dirname, './app/product/index.html'),
            filename:"./product/index.html",
            hash: true,
            title: 'product',
            ni:"你好 product",
            chunks: ["common","product/index"]
        })
    ]
};

module.exports = config;