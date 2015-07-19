var Webpack = require('webpack');
var path = require('path');
var appPath = path.resolve(__dirname, 'app');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'public', 'assets');

var config = {
  context: __dirname,
  devtool: 'eval-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/dev-server',
    path.resolve(appPath, 'index.jsx')],
  output: {
    path: buildPath,
    filename: 'bundle.js',
    publicPath: '/assets/'
  },
  module: {
    loaders: [{
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx$/,
                loader: 'jsx-loader?insertPragma=React.DOM&harmony'
              },
              {

                test: /\.css$/,
                loader: 'style!css'
              }],
    externals: {
        //don't bundle the 'react' npm package with our bundle.js
        //but get it from a global 'React' variable
        'react': 'React'
    }
  },
  plugins: [new Webpack.HotModuleReplacementPlugin()]
};

module.exports = config;
