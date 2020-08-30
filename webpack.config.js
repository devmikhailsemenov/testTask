const path = require("path");
const webpack = require("webpack");

module.exports = {
	plugins: [],

	entry: {
		main: "./src/js/index.js",
	},

	output: {
		filename: "[name].js",
		chunkFilename: "[name].js",
		publicPath: "/"
	},

	module: {
		rules: [
		{
			test: /\.js$/,
			exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
			use: {
				loader: "babel-loader",
				query: {
					presets: [
						["@babel/preset-env", { modules: false }]
					]
				}
			}
		}
		]
	},

	optimization: {
		minimize: true
	},

	resolve: {
		alias: {
			"@modules": path.resolve(__dirname, "src/blocks/modules"),
			"@components": path.resolve(__dirname, "src/blocks/components"),
			"@helpers": path.resolve(__dirname, "src/js/helpers"),
		}
	}
};
