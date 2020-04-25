const path = require('path');

module.exports = {
    devtool: "source-map",
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './main.js'
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    devServer: {
        writeToDisk: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },
};
