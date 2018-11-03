const webpackMerge = require('webpack-merge');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const config = require('./config');

module.exports = webpackMerge(
    {
        mode: config.env,
        resolve: {
            extensions: ['.ts', '.js', '.json'],
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
        ],
        module: {
            rules: [
                {
                    test: /\.ts$/,
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
                }
            ],
        },
    },
    config.webpackConfig
);
