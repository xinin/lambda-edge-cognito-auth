const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

const config = require('./config.json');

console.log('Your configuration is ');
console.log(config);

module.exports = {
  mode: 'production',
  target: 'node',
  entry: {
    app: './index.js',
  },
  node: {
    __dirname: false,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ZipPlugin({
      filename: 'lambda_edge.zip',
      exclude: [/\.zip$/, /\.txt$/],
    }),
  ],
  resolve: {
    extensions: ['.js'],
  },
  externals: [
    /^aws-sdk/, // Don't include the aws-sdk in bundles as it is already present in the Lambda runtime
  ],
  performance: {
    hints: 'error',
    maxAssetSize: 1048576, // Max size of deployment bundle in Lambda@Edge Viewer Request
    maxEntrypointSize: 1048576, // Max size of deployment bundle in Lambda@Edge Viewer Request
  },
  optimization: {
    minimizer: [new TerserPlugin({
      cache: true,
      parallel: true,
      extractComments: true,
    })],
  },
  module: {
    rules: [
      {
        exclude: [
          `${__dirname}/tests`,
        ],
      },
    ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs',
  },
};
