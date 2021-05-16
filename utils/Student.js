const normalizeString = require("./normalizeString");

const regex = {
  name: /(([A-Z]+) ){1,}/,
  email: /[A-Z]+[0-9]+\@ESTUDANTE\.SE\.DF\.GOV\.BR/,
};

const groups = {
  AMAZONIA: "AMAZÔNIA",
  ANDIROBA: "ANDIROBA",
  ANGELIM: "ANGELIM",
  "ARARA.AZUL": "ARARA-AZUL",
  ARAUCARIA: "ARAUCÁRIA",
  ARIRANHA: "ARIRANHA",
  BRAUNA: "BRAÚNA",
  BROMELIA: "BROMÉLIA",
  CAATINGA: "CAATINGA",
  CAIXETA: "CAIXETA",
  CAMPOS: "CAMPOS",
  CASTANHEIRA: "CASTANHEIRA",
  CEDRO: "CEDRO",
  CEREJEIRA: "CEREJEIRA",
  CERRADO: "CERRADO",
  CHAUA: "CHAUÁ",
  DESERTO: "DESERTO",
  FLORESTAS: "FLORESTAS",
  GARAPEIRA: "GARAPEIRA",
  "GATO.MARACAJA": "GATO-MARACAJÁ",
  "GAVIAO.REAL": "GAVIÃO-REAL",
  IMBUIA: "IMBUIA",
  JACARANDA: "JACARANDÁ",
  JACUTINGA: "JACUTINGA",
  JATOBA: "JATOBÁ",
  JEQUITIBA: "JEQUITIBÁ",
  "LOBO.GUARA": "LOBO-GUARÁ",
  "MATA.ATLANTICA": "MATA ATLÂNTICA",
  "MICO.LEAO.DOURADO": "MICO-LEÃO-DOURADO",
  MOGNO: "MOGNO",
  MURIQUI: "MURIQUI",
  "ONCA.PINTADA": "ONÇA-PINTADA",
  PAMPAS: "PAMPAS",
  PANTANAL: "PANTANAL",
  "PAU.BRASIL": "PAU-BRASIL",
  SAGUI: "SAGUI",
  SAVANA: "SAVANA",
  TAIGA: "TAIGA",
  "TAMANDUA.BANDEIRA": "TAMANDUÁ-BANDEIRA",
  "TARTARUGA.GIGANTE": "TARTARUGA-GIGANTE",
  "TATU.BOLA": "TATU-BOLA",
  TUCUXI: "TUCUXI",
  TUNDRA: "TUNDRA",
  UACARI: "UACARI",
};

const validateName = (name) => {
  const normalizedName = normalizeString(name).trim();
  if (!regex.name.test(normalizedName))
    throw new Error(`Invalid name format: ${name}`);
  return normalizedName;
};

const validateEmail = (email) => {
  const normalizedEmail = normalizeString(email).trim();
  if (!regex.email.test(normalizedEmail))
    throw new Error(`Invalid email format: ${email}`);
  return normalizedEmail;
};

const validateGroupName = (groupName) => {
  const normalizedGroupName = normalizeString(groupName).trim();
  for (group in groups) {
    if (new RegExp(group).test(normalizedGroupName)) return groups[group];
  }
  throw new Error(`Invalid group name: ${groupName}`);
};

const getStudendCode = (email) => {
  let matches = email.split("@")[0].match(/[0-9]+/);
  if (!matches || !/[0-9]{3,}/.test(matches[1])) {
    throw new Error(`Code parsing failed: ${email}`);
  }
  return matches[1];
};

/**
 * Student object factory
 * @param {string} name Student's name
 * @param {string} email Student's email
 * @param {string} group Student's group name
 * @returns {Object}
 */
const Student = (name, email, group) => {
  try {
    this.name = validateName(name);
    this.email = validateEmail(email);
    this.group = validateGroupName(group);
    this.code = getStudendCode(this.email);

    return this;
  } catch (e) {
    throw e;
  }
};

module.exports = Student;
