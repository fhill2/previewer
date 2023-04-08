const path = require('path');
module.exports = {
  mode: "development",
  entry: "./src/main/main.js",
  output: {
    path: path.join(__dirname, "dist", "main"),
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
  devtool: "source-map"
}
