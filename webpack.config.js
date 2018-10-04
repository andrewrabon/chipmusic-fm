const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
  {
    mode: 'production',
    entry: [
      './public/src/app.js',
    ],
    output: {
      path: path.resolve(__dirname, 'public/'),
      filename: 'bundle.min.js',
    },
  },
  {
    mode: 'production',
    entry: [
      './node_modules/concrete-elements/src/styles/mobile.css',
    ],
    output: {
      path: path.resolve(__dirname, 'public/styles/'),
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'concrete-mobile.min.css',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
      ],
    },
  },
  {
    mode: 'production',
    entry: [
      './node_modules/concrete-elements/src/styles/desktop.css',
    ],
    output: {
      path: path.resolve(__dirname, 'public/styles/'),
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'concrete-desktop.min.css',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
      ],
    },
  },
];
