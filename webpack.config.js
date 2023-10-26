// webpack.config.js
const path = require("path");

module.exports = {
  entry: "./server.js", // Entry point of your Express server file
  target: "node", // Set the target environment to Node.js
  output: {
    filename: "bs-host-zipped-site.js", // Output bundle file for the server
    path: path.resolve(__dirname, "dist"), // Output directory
  },
  node: {
    __dirname: false, // Ensure that __dirname works as expected
  },
};
