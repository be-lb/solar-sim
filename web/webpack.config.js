const path = require('path');

module.exports = {
  entry: '../lib/exe.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname)
  }
};
