const load = require("../../utils/load");
const normalizeString = require("../../utils/normalizeString");
const validateGroupName = require("../groups");

const csvFileContents = normalizeString(load(__dirname, "students.csv")).split(
  "\n"
);

let groupName = null;

const updateGroupName = (line) => {
  groupName = validateGroupName(line);
};

const validateStudent = (studentObject) => {
  const { code, name, birthdate, email } = studentObject;
  if (!code || !name || !birthdate || !email) {
    throw new Error(`Malformed student object: ${studentObject}`);
  }
};

const studentFactory = (line) => {
  const [code, name, birthdate, email, ...phones] = line.split(",");

  const student = {
    group: groupName,
    code,
    name,
    birthdate,
    email,
    phones,
    scores: { exatas: undefined, humanas: undefined, linguagens: undefined },
  };

  validateStudent(student);

  return student;
};

const parseLine = (line) => {
  if (/^[1-3]..ANO/.test(line)) {
    updateGroupName(line);
    return "delete_me";
  } else if (line.split(",").length > 3) {
    return studentFactory(line);
  }
  throw new Error(`Invalid line format: ${line}`);
};

const isStudentData = (line) => line !== "delete_me";

const addToGroup = (object, subObject) => {
  const { code, group } = subObject;
  object[group][code] = subObject;
  object.map[code] = group;
  return object;
};

const aggregateData = (acc, cur) => {
  if (!acc[cur["group"]]) {
    acc = Object.assign(acc, { [cur["group"]]: {} });
  }
  return addToGroup(acc, cur);
};

const studentsData = csvFileContents
  .map(parseLine)
  .filter(isStudentData)
  .reduce(aggregateData, { map: {} });

module.exports = studentsData;
