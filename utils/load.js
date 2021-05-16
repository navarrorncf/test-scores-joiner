const { readFileSync } = require("fs");
const { join } = require("path");
const opt = { encoding: "utf-8" };

module.exports = (...path) => readFileSync(join(...path), opt);
