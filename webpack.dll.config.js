const webpack = require('webpack');
module.exports = {
    output: {
        path: "./public",
        filename: '[name].js',
        library: '[name]_library'
    },
    entry: {
        vendor: ['react', 'react-dom']
    },
    plugins: [
        new webpack.DllPlugin({
            path: './manifest.json', // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
            name: '[name]_library'
        })
    ]
};