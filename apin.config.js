var path = require("path");
var router = require("./router.js");




//修改ANTD主题
var json = {};
var fs = require("fs");
var file = fs.readFileSync(__dirname+"/src/theme.less").toString();
var fileS = file.split(";");
for(var i=0;i<fileS.length;i++){
    if(fileS[i].trim().indexOf("@")==0){
        var arr = fileS[i].split(":");
        json[arr[0].trim()] = arr[1].trim();
    }
}

var themeV = JSON.stringify(json);
var babelrc = {
    "presets": [
        "react",
        "es2015"
    ],
    "plugins": [
        [
            "import",
            {
                libraryName: "antd",
                style: true
            }
        ]
        // `style: true` 会加载 less 文件
    ],
    "env":{
        "development": {
            "presets": [
                "react-hmre"
            ]
        }
    }
};
var jsLoader = "babel-loader?"+JSON.stringify(babelrc).trim()+"!eslint-loader";
var configModule = {
    loaders: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: jsLoader
            // include: path.join(__dirname, "src")
        },
        {
            test: /\.css/,
            loader: "style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]!"
        },
        {
            test: /^(?!.*?(\\|\/)src(\\|\/)).*less$/,
            loader: "style-loader!css-loader!less-loader?{\"sourceMap\":true,\"modifyVars\":"+themeV+"}"
        },
        {
            test: /(.*?(\\|\/)src(\\|\/)).*less$/,
            loader: "style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]!less-loader"
        },
        {
            test: /\.(png|jpg|gif)$/,
            loader: "url-loader?limit=5120&name=images/[hash:8].[name].[ext]"
        }

    ]
};
module.exports = {
	server: {
		port: 3000,
		assetPath: "./public",
        viewPath:"./view",
		custom: {
            serverRoutes:router
		},
        hlIP:"http://192.168.0.46:8080"
	},
	webpack: {
		dev: {
			useAnalyzer:false,
			config: {
                devtool: "cheap-module-eval-source-map",
				output: {
					path: path.resolve(__dirname,"./public/project"),
					filename: "spa.js",
					publicPath: "/project"
				},
                module: configModule
			}


		},
		release: {
			config: {
                output: {
                    path: path.resolve(__dirname,"./public/project"),
                    filename: "spa.js",
                    sourceMapFilename: "[file].map",
                    //加这个！
                    chunkFilename: "[name].[chunkhash:5].chunk.js",
                    publicPath: "/project/"
                },
                module: configModule
			}

		},
		useBundle: false
	}
};