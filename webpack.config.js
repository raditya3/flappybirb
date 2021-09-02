const path = require("path");

const mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

module.exports = {
  mode: mode,
  entry: path.resolve("src", "index.ts"),
  devtool: "source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    port: 4000,
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
