const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const poststylus = require('poststylus');

module.exports = {
    context: __dirname,
    entry: {
        'app': './app/ts/main.tsx'
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['*', '.tsx', '.ts', '.js', '.styl', '.css'],
        alias: {
            '~': path.resolve(__dirname, './app/ts'),
            'react3': path.resolve(__dirname, './node_modules/react-three-renderer'),
            'lodash': path.resolve(__dirname, './node_modules/lodash'),
            'es6-promise': path.resolve(__dirname, './node_modules/es6-promise')
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                enforce: 'pre',
                use: 'tslint-loader',
                exclude: /(node_modules)/
            },
            {
                test: /\.ts(x?)$/,
                loader: 'ts-loader',
                exclude: /(node_modules)/
            },
            {
                test: /\.styl$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'stylus-loader'],
                exclude: /(node_modules)/
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'main.css',
            allChunks: true
        }),
        new webpack.LoaderOptionsPlugin({
            debug: false,
            options: {
                resolve: {},
                stylus: {
                    use: [poststylus(['autoprefixer', 'rucksack-css'])]
                }
            }
        })
    ]
};
