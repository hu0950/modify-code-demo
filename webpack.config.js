const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const MyReplacePlugin = require('./plugins/modify-code-plugin')
const webpack = require('webpack');
const { resolve } = require('path')

// presets: [['@babel/preset-env', {
// 	targets: {
//      chrome: "67",
//    },
// 	useBuiltIns: 'usage'
// }]]


module.exports = {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	entry: {
		main: './src/index.js'
	},
	devServer: {
		contentBase: './dist',
		open: true,
		port: 8080,
		hot: true,
		hotOnly: true
	},
	module: {
		rules: [
		// {
		// 	test: /\.js$/,
		// 	// 要修改的源码的路径->需要匹配的路径
     //  include: resolve('./node_modules/lodash/concat.js'),
		// 	use: {
		// 		// 使用该loader对匹配到的文件进行转换
     //    loader: resolve('./loaders/modify-loader.js')
		// 	}
		// },
		{
			test: /\.(jpg|png|gif)$/,
			use: {
				loader: 'url-loaders',
				options: {
					name: '[name]_[hash].[ext]',
					outputPath: 'images/',
					limit: 10240
				}
			} 
		}, {
			test: /\.(eot|ttf|svg)$/,
			use: {
				loader: 'file-loaders'
			} 
		}, {
			test: /\.scss$/,
			use: [
				'style-loaders',
				{
					loader: 'css-loaders',
					options: {
						importLoaders: 2
					}
				},
				'sass-loaders',
				'postcss-loaders'
			]
		}, {
			test: /\.css$/,
			use: [
				'style-loaders',
				'css-loaders',
				'postcss-loaders'
			]
		}]
	},
  // resolve: {
  //   alias: {
  //     'lodash/concat': path.resolve('replace/concat.js')
  //   }
  // },
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		}), 
		new CleanWebpackPlugin(['dist']),
    // new MyReplacePlugin(),
		new webpack.HotModuleReplacementPlugin()
    // new webpack.NormalModuleReplacementPlugin(
    	// /node_modules\/lodash\/concat.js/,
		// 	'./../../replace/concat.js'
		// )

	],
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	}
}