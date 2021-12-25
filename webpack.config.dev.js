const common = require("./webpack.config");
const webpack = require("webpack");
const path = require("path");
const { merge } = require("webpack-merge");

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
    entry: "./src/index.jsx",
    mode: "development",
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/env"]
                }
            }, {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }, {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    resolve: {
        extensions: ["*", ".js", ".jsx", ".scss"]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
        filename: "[name].bundle.js",
        assetModuleFilename: 'images/[name][ext][query]',
    },
    devServer: {
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './public/index.html' }),
        new webpack.HotModuleReplacementPlugin(),
    ],
});