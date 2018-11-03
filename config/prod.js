const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './src/View.ts',
    devtool: 'source-map',
    output: {
        filename: 'view.js',
        path: path.resolve(__dirname, '../dist')
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
    ],
};
