/**
 * Created by Administrator on 2017/1/3.
 */
module.exports = {
	// devtool: "source-map",
	entry: __dirname + "/entry.js",
	output: {
		path: __dirname + "/output/",
		filename: "bundle.js"
	},
	resolve: {
		extensions: ['', '.js',]
	},
	module: {
		loaders: [
		{
			test: /\.json$/,
			loader: 'json'
		}, {
			test: /\.css$/,
			loader: 'style!css'
		}, {
			test: /\.less$/,
			loader: 'style!css!less'
		}, {
			test: /\.html$/,
			loader: 'html'
		}, {
			test: /.(ttf|woff2|png|jpg|svg|gif)$/,
			loader: 'url'
		}, ]
	},
}