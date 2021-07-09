const path = require('path')
module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, './drag.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'drag-everywhere.bundle.js',
    clean: true,
    library: {
      type: "commonjs",
    }
  },
};
