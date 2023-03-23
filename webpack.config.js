const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = {
	entry: './src/index.jsx',
	mode: 'development',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'index_bundle.js',
	},
	target: 'web',
	devServer: {
		port: '5000',
		static: {
			directory: path.join(__dirname, 'public'),
		},
		open: true,
		hot: true,
		liveReload: true,
		historyApiFallback: true,
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json'],
		alias: {
			'@components': path.resolve(__dirname, 'src/components'),
			'@config': path.resolve(__dirname, 'src/config'),
			'@graphql': path.resolve(__dirname, 'src/graphql'),
			'@hooks': path.resolve(__dirname, 'src/hooks'),
			'@layouts': path.resolve(__dirname, 'src/layouts'),
			'@providers': path.resolve(__dirname, 'src/providers'),
			'@utils': path.resolve(__dirname, 'src/utils'),
			'@views': path.resolve(__dirname, 'src/views'),
			'@mui/styled-engine': '@mui/styled-engine-sc',
		},
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(png|jpe?g|gif|ttf|svg)$/i,
				type: 'asset/resource',
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'public', 'index.html'),
		}),
		new Dotenv({ systemvars: true }),
	],
};
