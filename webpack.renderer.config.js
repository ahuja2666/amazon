const rules = require("./webpack.rules");

rules.push({
  test: /\.css$/,
  use: [
    { loader: "style-loader" },
    { loader: "css-loader" },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [require("tailwindcss"), require("autoprefixer")],
        },
      },
    },
  ],
});
rules.push({
  test: /\.svg$/, // Match image file extensions
  type: "asset/resource",         // Use Webpack's asset module for handling images
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
