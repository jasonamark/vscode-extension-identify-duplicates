"use strict";
const path = require("path");
const webpack = require("webpack");

const config = [
  {
    name: "webview",
    target: "web",
    entry: {
      sidebar: "./src/sidebar/index.tsx",
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "../dist"),
    },
    devtool: "source-map",
    resolve: {
      extensions: [".ts", ".js", ".tsx", ".jsx"],
      fallback: {
        path: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader",
            },
          ],
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(png|jpg|gif|svg)$/i,
          use: [
            {
              loader: "file-loader",
            },
          ],
        },
      ],
    },
    performance: {
      hints: false,
    },
    plugins: [],
    devServer: {
      compress: true,
      port: 9000,
      hot: true,
      allowedHosts: "all",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  },
];

module.exports = (env, argv) => {
  for (const configItem of config) {
    configItem.mode = argv.mode;

    if (argv.mode === "production") {
      configItem.devtool = "hidden-source-map";
    }

    configItem.plugins.push(
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(argv.mode),
      }),
    );
  }

  return config;
};
