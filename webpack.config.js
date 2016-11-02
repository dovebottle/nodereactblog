var webpack = require('webpack');
var path = require('path');

var publicPath = 'http://localhost:13300/';
//reload=true的意思是，如果碰到不能hot reload的情况，就整页刷新。
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

var devConfig = {
    entry: {
        page1: ['./client/page1', hotMiddlewareScript],
        page2: ['./client/page2', hotMiddlewareScript],
        addnote: ['./client/addnote/addnote.js', hotMiddlewareScript],
        mynote: ['./client/mynote/mynote.js', hotMiddlewareScript]
    },
    output: {
        filename: './[name]/bundle.js',
        //输出的文件夹public至于根目录下
        path: path.resolve(__dirname, './public'),
        publicPath: publicPath
    },
    devtool: 'eval-source-map',
    module: {
        loaders: [{
            test: /\.(png|jpg)$/,
            //小于8192的用url loader转成base64
            loader: 'url?limit=8192&context=client&name=[path][name].[ext]'
        }, {
            test: /\.scss$/,
            loader: 'style!css?sourceMap!resolve-url!sass?sourceMap'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react']
            }
        }]
    },
    plugins: [
        //webpack就能够比对id的使用频率和分布来得出最短的id分配给使用频率高的模块
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        //允许错误不打断程序
        new webpack.NoErrorsPlugin()
    ]
};

module.exports = devConfig;
