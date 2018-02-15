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
    publicPath: '/'
  },
  resolve: {
    alias: {
      'scss': path.resolve(__dirname, 'src/scss'),
      'templates': path.resolve(__dirname, 'src/templates'),
      'img': path.resolve(__dirname, 'src/img'),
      'misc': path.resolve(__dirname, 'src/misc'),
      'app': path.resolve(__dirname, 'src/js'),
      'config': path.resolve(__dirname, 'site.config.js'),
    }
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          interpolate: true
        }
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test:  /\.(jpe?g|png|gif|svg|obj|mtl|pdf|zip)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name(file) {
              if (file.match(/\.zip$|\.pdf$/)) {
                return '[name].[ext]';
              }
              return '[hash].[ext]';
            }
          }
        }]
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract([
          'css-loader?sourceMap',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')],
              sourceMap: 'inline',
            }
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, 'node_modules')],
              sourceMap: true
            }
          }
        ]),
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/templates/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'codigo-de-conduta/index.html',
      template: './src/templates/codigo-de-conduta.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'quero-patrocinar/index.html',
      template: './src/templates/quero-patrocinar.html'
    })
  ]
}