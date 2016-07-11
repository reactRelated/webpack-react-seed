var path = require('path');
var glob = require('glob');
var util = require('util');


var webpack= require('webpack');
var pkg=require("./package.json");

var ExtractTextPlugin = require('extract-text-webpack-plugin'); //提取文本
var HtmlWebpackPlugin = require('html-webpack-plugin'); //生成 html 模板 

//引入路径
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.js');
var pathToReactDom = path.resolve(node_modules, 'react-dom/dist/react-dom.js');

//获取路径
var jsBundle = path.join('_js', util.format('[name].%s.js', pkg.version));
var cssBundle = path.join('_css', util.format('[name].%s.css', pkg.version));

var source =[
    "app/home/",
    "app/product/"
];

/*突然发现 这个 suffix 函数没有什么用 
* 注意: 这里的文件设计模式是 html 和 js/jsx , scss 前缀文件名 单一对应
* */
var sourceJsx = suffix(source,'*.jsx');
// var sourceHtml = suffix(source,'.html');
// console.log(sourceJsx);
// console.log(sourceHtml);

// 获取js
var entries = getEntry(sourceJsx, 'app/');

// var page = getEntry(sourceHtml, 'app/');
//获取 html 多模块入口文件
var pages = Object.keys(entries);

// console.log(entries);
// console.log(pages);

config = {
    devServer: {
        inline: true,
        port: 7777
    },
    // context: path.join(__dirname, './app'),
    // devtool : "source-map",
    // entry: ['webpack/hot/only-dev-server', './app/main.jsx'],
    entry: entries,
    resolve: {
        alias: {
         'react': pathToReact,
            'react-dom':pathToReactDom
        }
    },
    output: {
        path: path.join(__dirname, './dist'),
        publicPath:"/webpack-react-seed/dist/",
        filename: jsBundle
    },
    module: {
        loaders: [
                    { test: /\.jsx?$/,
                        exclude: /node_modules/, //排除文件夹
                        loader: 'babel',
                        query:{
                            presets:['es2015','react']
                        } 
                    },
                    {
                        test:/\.scss$/,
                        // loaders: ['style', 'css', 'sass']
                        loader: ExtractTextPlugin.extract("css!sass")
                        // loaders: ExtractTextPlugin.extract("css","sass")
                    },
                    {
                        test: /\.(woff|woff2|ttf|eot|svg)(\?t=[0-9]\.[0-9]\.[0-9])?$/,
                        loader: 'file-loader?name=_fonts/[name].[ext]'
                    }, {
                        test: /\.(png|jpe?g|gif)$/,
                        loader: 'url-loader?limit=8192&name=_images/[name]-[hash].[ext]'
                    }
                ],
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
            })
        ]
};

//html 模板插件
pages.forEach(function(pathname) {

    var conf = {
        filename: './' + pathname + '.html', //生成的html存放路径，相对于path
        template: path.resolve(__dirname, './app/' + pathname + '.html'), //html模板路径
        hash: true,
        ni:"呵呵"
        //inject: false, //js插入的位置，true/'head'/'body'/false
        /*
         * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
         * 如在html标签属性上使用{{...}}表达式，很多情况下并不需要在此配置压缩项，
         * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
         * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
         */
        // minify: { //压缩HTML文件
        // 	removeComments: true, //移除HTML中的注释
        // 	collapseWhitespace: false //删除空白符与换行符
        // }
    };
    if (pathname in config.entry) {
        conf.inject = 'body';
        conf.chunks = ['common', pathname];
    }
    config.plugins.push(new HtmlWebpackPlugin(conf));
});

module.exports = config;

/**
 * 获得路径
 * @param globPath: arr
 * @param pathDir: path
 * @returns {{}}
 */
function getEntry(globPath, pathDir) {
    var files = [];

    globPath.forEach(function (p) {
        files=files.concat(glob.sync(p))
    });
    var entries = {},
        entry, dirname, basename, pathname, extname;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = path.normalize(path.join(dirname,  basename));
        pathDir = path.normalize(pathDir);
        if(pathname.startsWith(pathDir)){
            pathname = pathname.substring(pathDir.length)
        }
        entries[pathname] = ['./' + entry];
    }

    return entries;
}


/**
 * 添加后缀
 * @param sou:[Array]添加的源数据文件路劲
 * @param sfx:[String]后缀名
 */
 function suffix(sou,sfx) {
    var cache_sou = [];
    sou.forEach(function (item, index, array) {
        cache_sou[index] = item+sfx
    });
    return cache_sou
 }