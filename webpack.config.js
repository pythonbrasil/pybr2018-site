const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'bundle.js', 
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {},
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: [['es2015', {'modules': false}], 'es2016', 'stage-2']
            }
          }
        ]
      },
      {
        test:  /\.(jpe?g|png|gif|svg|obj|mtl)$/i,
        use: [{
          loader: 'file-loader'
        }]
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(['css-loader?sourceMap', 'postcss-loader?sourceMap=inline', 'sass-loader?sourceMap'])
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer(),
        ]
      }
    })
  ]
}