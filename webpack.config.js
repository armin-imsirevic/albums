const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    devtool: 'source-map',
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'main.js',
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devServer: {
        contentBase: './src',
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            // {
            //     enforce: 'pre',
            //     test: /\.js$/,
            //     loader: 'source-map-loader'
            // },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
        ]
    },
    plugins: [new HtmlWebpackPlugin({template: './src/index.html'})],
};
