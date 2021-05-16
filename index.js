const { writeFileSync } = require("fs");
const { join } = require("path");

const nightShift = [
  "AMAZÔNIA",
  "CAATINGA",
  "CERRADO",
  "MATA ATLÂNTICA",
  "PAMPAS",
  "PANTANAL",
];

const { students, untracked, essays } = require("./settings");
let csvStudents = "",
  csvUntracked = "";

const addStudent = (student) => {
  const { group: g, code: c, name: n, scores: ss } = student;
  const { exatas = 0, humanas = 0, linguagens = 0 } = ss;
  const { errors, reportedName = "", reportedEmail = "" } = student;
  const essay = essays[c];
  let e;

  if (!essay) {
    e = 0;
    if (!nightShift.includes(g)) {
      untracked.push({ group: g, code: c, name: n, email: "no essay found" });
    }
  } else {
    e = essay.essayScore * 1;
  }
  let er = (exatas * 1 + e).toFixed(2),
    hr = (humanas * 1 + e).toFixed(2),
    lr = (linguagens * 1 + e).toFixed(2);

  csvStudents += `${g},${c},${n},${exatas},${er},${humanas},${hr},${linguagens},${lr},`;

  if (errors) {
    csvStudents += `${
      errors.nameMismatch ? "Nome preenchido: " + reportedName : ""
    },`;
    csvStudents += `${
      errors.emailMismatch ? "Email usado: " + reportedEmail : ""
    }`;
  }
  csvStudents += "\n";
};

const addGroup = (groupName) => {
  const groupData = Object.values(students[groupName]);
  groupData.forEach(addStudent);
  csvStudents += "\n";
};

Object.keys(students)
  .filter((el) => el !== "map" && !nightShift.includes(el))
  .forEach(addGroup);

writeFileSync(join(__dirname, "out/scores.csv"), csvStudents, {
  encoding: "utf-8",
});

const parseUntracked = (student) => {
  const {
    group = "NA",
    code = "NA",
    name,
    email,
    exatas = 0,
    humanas = 0,
    linguagens = 0,
  } = student;

  return `${group},${code},${name},${email},${exatas},${humanas},${linguagens}\n`;
};

csvUntracked = untracked.map(parseUntracked).join("");

writeFileSync(join(__dirname, "out/untracked.csv"), csvUntracked, {
  encoding: "utf-8",
});
