var path = require('path');

module.exports = {
  context: __dirname,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, 'src'),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['@babel/env', '@babel/react']
          }
        },
      },
      {
        test: /\.(s)?css$/,
        // exclude: /(node_modules)/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/i,
        use: [{
          loader: 'url-loader'
        }]
      }
    ]
  },
  // plugins: [
  //   new HtmlWebpackPlugin({
  //       template: "./public/index.html"
  //   }),
  //   new webpack.HotModuleReplacementPlugin()
  // ],
  devtool: 'source-map',
  resolve: {
    extensions: [".js", ".jsx", "*"]
  }
}