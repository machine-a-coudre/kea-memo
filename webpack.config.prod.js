const common = require("./webpack.config");
const webpack = require("webpack");
const path = require("path");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
    entry: "./src/index.jsx",
    mode: "production",
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
        filename: "[name]-[contenthash].bundle.js",
        path: path.resolve(__dirname, "dist"),
        assetModuleFilename: 'images/[name]-[hash][ext][query]',
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './public/index.html' }),
      new TerserPlugin({
        parallel: true,
      }),     
      new CleanWebpackPlugin()
    ],
});