const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const config = require('./config');

module.exports = {
    mode: config.env,
    devtool: 'source-map',
    entry: './examples/index.ts',
    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './examples/index.html', ...config.htmlHead }),
        new ForkTsCheckerWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [['@babel/preset-env', { useBuiltIns: 'usage' }]],
                            plugins: ['@babel/plugin-transform-runtime']
                        }
                    },
                    { loader: 'ts-loader', options: { transpileOnly: true } }
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ],
    },
    devServer: {
        compress: true,
        port: 3000,
    },
};
