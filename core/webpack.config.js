const path = require('path')
module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, './drag.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'drag-everywhere.bundle.js',
    libraryTarget: "commonjs-module"
  },
  module: {
    rules: [
      {
        test: /\.js$|jsx/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-optional-chaining']
            }
          }
        ]
      }
    ]
  }
};
