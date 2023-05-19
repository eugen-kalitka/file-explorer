const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [{
    entry: {
        client: './src/frontend/index.tsx',
    },
    mode: 'development',
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'build', 'public'),
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    useCaseSensitiveFileNames: true,
                },
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public', 'index.html'),
            filename: './index.html'
        }),
    ],
}];
