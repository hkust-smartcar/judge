const webpack = require('webpack')
const configs = require('./config')

module.exports = env => ({
	module: {
		rules: [
			{
				test: /\.imba$/,
				loader: 'imba/loader',
			}
		]
	},
	resolve: {
		extensions: [".imba",".js", ".json"]
	},
	plugins: [
		configs(env && env.NODE_ENV || 'production'),
		new webpack.DefinePlugin({
			'process.env': JSON.stringify({NODE_ENV:'production',...env})
		})
	],
	entry: "./src/client/index.imba",
	output: {  path: __dirname + '/dist', filename: "client.js" }
})