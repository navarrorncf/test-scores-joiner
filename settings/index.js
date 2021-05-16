const scores = require("./scores");
const studentsOriginal = require("./students");
const essays = require("./essays");
const alternateEmails = require("./alternateEmails");

const students = JSON.parse(JSON.stringify(studentsOriginal));
const errors = {};
let untracked = [];

class CustomError extends Error {
  constructor(message, data) {
    super(message);
    this._data = data;
  }
}

const flag = (object, tag) => {
  if (!object.errors) object.errors = {};
  object.errors[tag] = true;
};

const checkGroup = (scoreObject) => {
  try {
    let { code, group } = scoreObject;
    if (!code || code < 99) {
      code = alternateEmails[scoreObject.email];
    }

    if (!group) {
      throw new CustomError(`No group found: ${code}`, code);
    }

    if (!group === students.map[code]) {
      throw new CustomError(`Group Mismatch: ${code}`, code);
    }
  } catch (e) {
    let code = e._data;
    if (!errors[code]) {
      errors[code] = { noGroup: true };
    } else {
      errors[code].noGroup = true;
    }
  }
};

const checkName = (scoreObject) => {
  try {
    let { name: reportedName, code } = scoreObject;
    if (!code || code < 99) {
      code = alternateEmails[scoreObject.email];
    }

    let group = students.map[code];
    if (!group) {
      throw new CustomError(`No group found: ${code}`, code);
    }

    const student = students[group][code];

    let { name: actualName } = student;

    let regex = new RegExp(reportedName.split(" ").join(".+") + ".*");
    if (!regex.test(actualName)) {
      flag(student, "nameMismatch");
      student.reportedName = reportedName;
      throw new CustomError(`Name mismatch: ${code}`, code);
    }
  } catch (e) {
    let code = e._data;
    if (!errors[code]) {
      errors[code] = { nameMismatch: true };
    } else {
      errors[code].nameMismatch = true;
    }
  }
};

const checkEmail = (scoreObject) => {
  try {
    let { email: reportedEmail, code } = scoreObject;
    if (!code || code < 99) {
      code = alternateEmails[scoreObject.email];
    }

    let group = students.map[code];
    if (!group) {
      throw new CustomError(`No group found: ${code}`, code);
    }

    let student = students[group][code];
    let { email: actualEmail } = student;

    if (
      !alternateEmails[reportedEmail] &&
      (reportedEmail !== actualEmail ||
        !/\@ESTUDANTE\.SE\.DF\.GOV\.BR/.test(reportedEmail))
    ) {
      flag(student, "emailMismatch");
      student.reportedEmail = reportedEmail;
      throw new CustomError(`Email mismatch: ${reportedEmail}`, code);
    }
  } catch (e) {
    let code = e._data;
    if (!errors[code]) {
      errors[code] = { emailMismatch: true };
    } else {
      errors[code].emailMismatch = true;
    }
  }
};

const validateScore = (scoreObject) => {
  checkGroup(scoreObject);
  checkName(scoreObject);
  checkEmail(scoreObject);
};

scores.forEach((score) => {
  try {
    validateScore(score);
    let { code } = score;
    if (!code || code < 99) {
      code = alternateEmails[score.email];
    }

    const group = students.map[code];
    if (!group) {
      untracked.push(score);
      throw new CustomError(`No group found: ${code}`, code);
    }
    const studentObject = students[group][code];
    if (!isNaN(score.humanas * 1)) {
      studentObject.scores.humanas = score.humanas * 1;
    }
    if (!isNaN(score.exatas * 1)) {
      studentObject.scores.exatas = score.exatas * 1;
    }
    if (!isNaN(score.linguagens * 1)) {
      studentObject.scores.linguagens = score.linguagens * 1;
    }
  } catch (e) {
    let code = e._data;
    if (!errors[code]) {
      errors[code] = { noGroup: true };
    } else {
      errors[code].noGroup = true;
    }
  }
});

require("fs").writeFileSync(
  `${__dirname}/../log/errors.json`,
  JSON.stringify(errors),
  {
    encoding: "utf-8",
  }
);

module.exports = { students, untracked, essays };
