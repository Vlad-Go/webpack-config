const path = require('path');

module.exports = {
  pathes: {
    src: path.resolve(__dirname, './src'), // context path
    dist: path.resolve(__dirname, './dist'),
    images: './images',
    fonts: './fonts',
  },
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
  staticFiles: [
    {
      from: path.resolve(__dirname, './src/static'),
      to: path.resolve(__dirname, './dist/static'),
    },
  ],
  fileStructure: [
    {
      html: {path: './index.html'},
      css: [
        {path: './styles/style.scss'},
      ],
      js: [
        {path: './index.js'},
      ],
    },
  ],
};
