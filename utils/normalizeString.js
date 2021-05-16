/**
 * Normalizes string ("Crème Brulée" => "CREME BRULEE")
 * @param {string} string String to be normalized
 * @returns {string}      normalized string
 */
const normalizeString = (string) =>
  string
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

module.exports = normalizeString;
