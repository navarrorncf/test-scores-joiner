const { load } = require("../../utils");

const csvEssays = load(__dirname, "redação.csv");

const parseLine = (line) => {
  const [code, name, essayScore, mod] = line.split(",");
  return { code, name, essayScore, mod };
};

const aggregate = (acc, cur) => {
  return Object.assign(acc, { [cur.code]: cur });
};

const essaysData = csvEssays.split("\n").map(parseLine).reduce(aggregate, {});

module.exports = essaysData;
