const path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./src/main/main.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  target: "electron-main",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [new CleanWebpackPlugin({ verbose: true })],
  devtool: "source-map"
}
