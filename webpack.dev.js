const path = require('path'); 
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map', // Source maps for easier debugging
  devServer: {
    static: path.join(__dirname, 'dist'), // Use 'path' here
    compress: true,
    port: 9000,
    open: true, // Automatically open the browser
    hot: true, // Make sure HMR is enabled
    watchFiles: ['src/**/*'], // Watch all files, including CSS
  },
});