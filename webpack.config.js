var webpack = require('webpack')
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const cesiumBuild = 'node_modules/cesium/Build/Cesium';

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'js/[name].bundle.js',
		path: path.resolve(__dirname, 'web')
	},
	devtool: 'cheap-module-eval-source-map',
	devServer: {
		contentBase: './web'
	},
	module: {
		rules: [{
			test: /\.(js)$/i,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['env']
				}
			}
		}, { 
			test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
			loader: "file-loader" 
		}, {
			test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			loader: "url-loader?limit=10000&mimetype=application/font-woff"
		}, {
			test: /\.(jpg|png|gif)$/i,
			use: {
				loader: "url-loader",
				options: {
					name: '[name].[ext]',
					outputPath: './css/images/'
				}
			}
		}, {
			test: /\.(zip)/i,
			use: {
				loader: "file-loader",
				options: {
					name: '[name].[ext]',
					outputPath: './data/'
				}
			}
		}, {
			test: /\.css$/,
			use: ['style-loader', {
				loader: 'css-loader',
				options: {
					minimize: true
				}
			}]
		}]
	},
	plugins: [
		new CleanWebpackPlugin(['web']),
		new htmlWebpackPlugin({
			template: './src/index.html'
		}),
		new CopyPlugin([{from: path.join(__dirname, cesiumBuild), to: 'Cesium'}]),
		new CopyPlugin([{from: path.join(__dirname, 'src/data'), to: 'Data'}])
	]
};