const path = require("path");
module.exports = {
  mode: "development",
  entry: "./src/renderer/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "renderer.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3000,
    open: true,
  },
  devtool: "source-map",
};
