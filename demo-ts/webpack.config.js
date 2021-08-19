const path = require('path');

module.exports = {
	mode: 'development',
	entry: './index.ts',
	devtool: 'inline-source-map',
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
	},
	module: {
		rules: [
			{
			test: /\.tsx?$/,
			use: 'ts-loader',
			exclude: /node_modules/,
			},
		],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
};
