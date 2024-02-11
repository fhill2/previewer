const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  mode: process.env.NODE_ENV,

  // target is essential, otherwise webpack cannot find the 'electron' module when bundling
  target: ["electron-renderer"],
  entry: "./src/renderer/index.js",
  output: {
    path: path.join(__dirname, "dist", "renderer"),
    filename: "renderer.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env"], ["@babel/preset-react"]],
          },
        },
      },
      {
        test: /\.s?(c|a)ss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
            },
          },
          "sass-loader",
        ],
        include: /\.module\.s?(c|a)ss$/,
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"],
        exclude: /\.module\.s?(c|a)ss$/,
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname), "node_modules"],
    extensions: [".js", ".jsx"],
    // fix for pdfjs-dist.split().at() is not a function
    // https://github.com/wojtekmaj/react-pdf/issues/1220
    alias: {
      "pdfjs-dist/build/pdf": "pdfjs-dist/legacy/build/pdf",
    },
  },
  // webpack does not clean old bundles inside dist/renderer by defaulrt
  plugins: [new CleanWebpackPlugin({ verbose: true })],

  devServer: {
    port: 3000,
    open: false,
  },
  devtool: "source-map",
};
