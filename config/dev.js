const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: './examples/index.ts',
    plugins: [
        new HtmlWebpackPlugin({
            template: './examples/index.html',
            title: 'LightJs',
            favicon: 'favicon.ico'
        }),
    ],
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ],
    },
    devServer: {
        compress: true,
        port: 3000,
    }
};
