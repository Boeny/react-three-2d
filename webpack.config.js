const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    context: __dirname,
    entry: {
        'app': './app/ts/main.tsx'
    },
    output: {
        path: path.join(__dirname, "docs"),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['*', '.tsx', '.ts', '.js', '.styl', '.css'],
        alias: {
            '~': path.resolve(__dirname, './app/ts'),
            'react3': path.resolve(__dirname, './node_modules/react-three-renderer')
        }
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.tsx?$/,
                use: 'tslint-loader',
                exclude: /(node_modules)/
            },
            {
                test: /\.ts(x?)$/,
                use: 'ts-loader',
                exclude: /(node_modules)/
            },
            {
                test: /\.styl$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'stylus-loader']
                }),
                exclude: /(node_modules)/
            },
            {
                test: /\.css/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader']
                }),
                exclude: /(node_modules)/
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("main.css"),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-us|en-ca|en-gb|ru/)
    ],
    // watch: true
};
