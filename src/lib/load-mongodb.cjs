const { createRequire } = require("node:module");
const path = require("node:path");

module.exports = createRequire(path.join(process.cwd(), "package.json"))("mongodb");
