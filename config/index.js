const devWebpack = require('./dev');
const prodWebpack = require('./prod');
const ENVS = {
    NODE_ENV: process.env.NODE_ENV || 'development', // development, production
};

module.exports = {
    env: ENVS.NODE_ENV || 'development',
    isProd: ENVS.NODE_ENV === 'production',
    webpackConfig: ENVS.NODE_ENV === 'production' ? prodWebpack : devWebpack
};
