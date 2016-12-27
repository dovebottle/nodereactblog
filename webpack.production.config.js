var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var webpack = require('webpack');
var TransferWebpackPlugin = require('transfer-webpack-plugin');


var productionConfig = [{
    entry: {
        page1: './client/page1',
        page2: './client/page2',
        addnote: './client/addnote/addnote.js',
        mynote: './client/mynote/mynote.js',
        mytags: './client/mytags/mytags.js',
        singlenote: './client/singlenote/singlenote.js'

    },
    externals: {
        jquery: 'window.$'
    },
    output: {
        filename: './[name]/bundle.js',
        path: path.resolve(__dirname, './public'),
        publicPath: '/'
    },
    module: {
        loaders: [{
            test: /\.(png|jpg)$/,
            loader: 'url?limit=8192&context=client&name=[path][name].[ext]'
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('style', 'css!resolve-url!sass?sourceMap')
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
        new CleanWebpackPlugin(['public']),
        //把指定文件夹下的文件复制到指定的目录
        new TransferWebpackPlugin([
            {from: './client/lib', to: './lib'}
        ], path.resolve(__dirname)),
        new ExtractTextPlugin('./[name]/index.css', {
            allChunks: true
        }),
        //react
        //bundle.js:1 Warning: It looks like you're using a minified copy of the development build of React. When deploying React apps to production, make sure to use the production build which skips development warnings and is faster. 
        //216 = > 145kb
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        new webpack.optimize.UglifyJsPlugin({
          output: {
            comments: false,  // remove all comments
          },
          compress: {
            warnings: false
          }
        })
    ]
}];

module.exports = productionConfig;
