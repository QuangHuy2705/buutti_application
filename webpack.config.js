const path = require('path');

module.exports = {
    target: 'node',
    entry: {
        app: [
            'babel-polyfill',
            './index.js'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ["@babel/preset-env"] 
            }
        }]
    }
};