const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./config');
const PATH_NAME = 'View';

module.exports = {
    mode: config.env,
    devtool: config.isProd ? false : 'inline-source-map',
    entry: `./src/${PATH_NAME}.ts`,
    output: {
        filename: '[name]_[hash].js',
        path: path.resolve(__dirname, `dist/${PATH_NAME}`),
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({ template: 'src/index.html', ...config.htmlHead }),
        new ForkTsCheckerWebpackPlugin(),
        new MiniCssExtractPlugin({ filename: '[name]_[hash].css' })
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
                test: /\.scss$/,
                use: [
                    config.isProd ? MiniCssExtractPlugin.loader : 'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1024,
                        fallback: 'file-loader',
                        name: '[path][name]_[hash:base64:5].[ext]'
                    }
                }]
            }
        ],
    },
    devServer: {
        https: config.devHttps,
        compress: true,
        port: 9000,
    },
};
