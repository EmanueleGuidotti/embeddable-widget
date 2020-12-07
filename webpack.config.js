const path = require('path');
const webpack = require('webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');
const terserPlugin = require('terser-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');

const ROOT = path.resolve(__dirname, 'src');
const DESTINATION = path.resolve(__dirname, './dist');

module.exports = (env) => {
  const isDevBuild = !(env && env.prod);
  console.log('isDevBuild: ', isDevBuild);
  return [
    {
      context: ROOT,

      entry: {
        main: './main.ts',
      },

      output: {
        filename: '[name].bundle.js',
        path: DESTINATION,
      },

      resolve: {
        extensions: ['.ts', '.js', '.css', '.html'],
        modules: [ROOT, 'node_modules'],
      },

      module: {
        rules: [
          {
            test: /\.html$/i,
            use: 'raw-loader',
          },
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
          },
          {
            enforce: 'pre',
            test: /\.js$/,
            use: 'source-map-loader',
          },
          {
            enforce: 'pre',
            test: /\.ts$/,
            exclude: /node_modules/,
            use: 'tslint-loader',
          },
          {
            test: /\.ts$/,
            exclude: [/node_modules/],
            use: 'awesome-typescript-loader',
          },
        ],
      },
      devtool: 'cheap-module-source-map',
      devServer: {},
      plugins: !isDevBuild
        ? [new webpack.SourceMapDevToolPlugin()]
        : [
            new miniCssExtractPlugin({
              filename: '[name].css',
              chunkFilename: '[id].css',
            }),
          ],
      optimization: {
        minimize: !isDevBuild ? true : false,
        minimizer: [
          new terserPlugin({
            cache: true,
            parallel: true,
            sourceMap: true,
          }),
        ],
      },
    },
  ];
};
