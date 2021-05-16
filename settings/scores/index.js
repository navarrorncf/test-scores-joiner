const { load, normalizeString } = require("../../utils");
const validateGroup = require("../groups");

const bimester = 1;
const regex = new RegExp(`\.${bimester}\.`);

const loadFile = (fileName) => ({
  [fileName.split(".")[0]]: normalizeString(load(__dirname, fileName)),
});

const pluckCode = (email) => {
  try {
    let code = email.match(/[0-9]+/)[0];
    if (code) return code;

    throw new Error();
  } catch (e) {
    e.message = `Invalid email format: ${email}`;
  }
};

const parseLine = (line, key) => {
  let [email, group, name, score] = line.split(",").map((str) => str.trim());
  group = validateGroup(group);
  const code = pluckCode(email);

  return { code, name: name.replace(/\./g, ""), email, [key]: score, group };
};

const parseScores = (rawObject) => {
  let [key, val] = [...Object.keys(rawObject), ...Object.values(rawObject)];
  val = val.split("\n").map((line) => parseLine(line, key));
  return val;
};

const gradesData = require("fs")
  .readdirSync(__dirname)
  .filter((file) => /csv$/.test(file) && regex.test(file))
  .map(loadFile)
  .map(parseScores)
  .reduce((acc, cur) => [...acc, ...cur], []);

module.exports = gradesData;
