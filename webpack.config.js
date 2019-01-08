const webpack = require('webpack');
const path = require('path');
const modules = require('./webpack.modules');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: './src/index',
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
    mode: 'development',
	module: modules,
	plugins: [new UglifyJSPlugin()]
};
